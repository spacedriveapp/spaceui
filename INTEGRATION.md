# Integrating SpaceUI Into Your Project

This guide covers how to consume SpaceUI packages from an external project (outside the SpaceUI monorepo). It documents the real-world integration pattern used by Spacedrive, including publishing, local development linking, Vite transpilation, and Tailwind v4 scanning.

## Table of Contents

- [Installing from npm](#installing-from-npm)
- [Local Development (Linking)](#local-development-linking)
- [Vite Configuration](#configure-vite)
- [Tailwind CSS v4](#set-up-tailwind-css-v4)
- [Using Components](#use-components)
- [Publishing & Releases](#publishing--releases)
- [React Native / NativeWind](#react-native--nativewind)
- [Next.js](#nextjs)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- [Bun](https://bun.sh) 1.1.0+
- [Vite](https://vitejs.dev) (or another bundler — this guide focuses on Vite)
- [Tailwind CSS v4](https://tailwindcss.com)
- React 18 or 19

## Directory Layout

SpaceUI is designed to live as a sibling repo alongside your project:

```
your-workspace/
├── spaceui/          # This repo
└── your-project/     # Your app
```

All relative paths in this guide assume this layout. Adjust if your setup differs.

---

## Installing from npm

SpaceUI packages are published publicly on npm under the `@spacedrive` scope. For production use, install published versions:

```bash
bun add @spacedrive/tokens @spacedrive/primitives
# Add whichever packages you need:
bun add @spacedrive/forms @spacedrive/ai @spacedrive/explorer
```

This gives you pre-built `dist/` output — no source aliases or special Vite config needed beyond Tailwind setup (Step 3) and peer dependencies (Step 4).

For **local development** against an unreleased version of SpaceUI, see the next section.

---

## Local Development (Linking)

When you're iterating on SpaceUI and a consuming project simultaneously, use Bun's linking to symlink local packages instead of pulling from npm.

### Register SpaceUI packages globally

```bash
cd spaceui
bun run link
```

This runs `bun link` inside each package directory, registering `@spacedrive/tokens`, `@spacedrive/primitives`, `@spacedrive/forms`, `@spacedrive/ai`, and `@spacedrive/explorer` in Bun's global link registry.

### Link into your project

```bash
cd your-project
bun link @spacedrive/tokens
bun link @spacedrive/primitives
# ... and whichever other packages you need
```

### Override versions in package.json

While developing locally, override the npm versions with the `link:` protocol:

```json
{
  "dependencies": {
    "@spacedrive/tokens": "link:@spacedrive/tokens",
    "@spacedrive/primitives": "link:@spacedrive/primitives",
    "@spacedrive/ai": "link:@spacedrive/ai",
    "@spacedrive/forms": "link:@spacedrive/forms",
    "@spacedrive/explorer": "link:@spacedrive/explorer"
  }
}
```

> **Note:** `link:@spacedrive/primitives` tells Bun to resolve via the global link registry, not a local file path. This is different from `link:../spaceui/packages/primitives`.

When you're done developing locally, switch back to versioned ranges for production:

```json
{
  "dependencies": {
    "@spacedrive/tokens": "^0.1.0",
    "@spacedrive/primitives": "^0.1.0"
  }
}
```

---

## Configure Vite

> **If you installed from npm and are NOT using `link:` for local development**, you can skip sections 2a-2c. You only need the React deduplication (2d) and the Tailwind setup (Step 3). Published packages resolve to pre-built `dist/` output automatically.

This is where most of the complexity lives for local development. Vite needs four things configured to work with linked SpaceUI packages.

### 2a. Resolve aliases (point to source)

SpaceUI packages ship with `dist/` output, but for local development you want Vite to resolve directly to **source TypeScript files**. This gives you instant HMR without needing to rebuild SpaceUI:

```ts
// vite.config.ts
import path from 'path';

export default defineConfig({
  resolve: {
    alias: [
      // Tokens — CSS imports need the directory, not a JS entry
      {
        find: '@spacedrive/tokens/src/css',
        replacement: path.resolve(__dirname, '../spaceui/packages/tokens/src/css')
      },
      {
        find: '@spacedrive/tokens',
        replacement: path.resolve(__dirname, '../spaceui/packages/tokens')
      },
      // Component packages — point to source index.ts
      {
        find: '@spacedrive/primitives',
        replacement: path.resolve(__dirname, '../spaceui/packages/primitives/src/index.ts')
      },
      {
        find: '@spacedrive/ai',
        replacement: path.resolve(__dirname, '../spaceui/packages/ai/src/index.ts')
      },
      {
        find: '@spacedrive/forms',
        replacement: path.resolve(__dirname, '../spaceui/packages/forms/src/index.ts')
      },
      {
        find: '@spacedrive/explorer',
        replacement: path.resolve(__dirname, '../spaceui/packages/explorer/src/index.ts')
      },
    ]
  }
});
```

> **Important:** The `@spacedrive/tokens/src/css` alias must come _before_ the `@spacedrive/tokens` alias. Vite matches aliases in order, and the more specific path needs to match first.

### 2b. Exclude from dependency pre-bundling

Vite pre-bundles dependencies for performance. SpaceUI packages must be excluded, otherwise Vite caches a snapshot and won't pick up changes:

```ts
export default defineConfig({
  optimizeDeps: {
    exclude: ['@spacedrive/tokens', '@spacedrive/primitives', '@spacedrive/ai', '@spacedrive/forms', '@spacedrive/explorer']
  }
});
```

### 2c. Allow filesystem access

Vite's dev server restricts file reads to the project root by default. Since SpaceUI lives outside your project, you must explicitly allow it:

```ts
export default defineConfig({
  server: {
    fs: {
      allow: [
        path.resolve(__dirname, '..'),          // parent directory
        path.resolve(__dirname, '../spaceui')   // spaceui repo
      ]
    }
  }
});
```

### 2d. Deduplicate React

When two repos both depend on React, Vite can end up bundling two copies, which causes the infamous "Invalid hook call" error. Pin React to your project's copy:

```ts
export default defineConfig({
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: [
      { find: /^react$/, replacement: path.resolve(__dirname, './node_modules/react/index.js') },
      { find: /^react\/jsx-runtime$/, replacement: path.resolve(__dirname, './node_modules/react/jsx-runtime.js') },
      { find: /^react\/jsx-dev-runtime$/, replacement: path.resolve(__dirname, './node_modules/react/jsx-dev-runtime.js') },
      { find: /^react-dom$/, replacement: path.resolve(__dirname, './node_modules/react-dom/index.js') },
      { find: /^react-dom\/client$/, replacement: path.resolve(__dirname, './node_modules/react-dom/client.js') },
      // ... your @spacedrive aliases from 2a ...
    ]
  }
});
```

### Complete vite.config.ts example

```ts
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

const spaceui = path.resolve(__dirname, '../spaceui/packages');

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: [
      // Pin React to a single copy
      { find: /^react$/, replacement: path.resolve(__dirname, './node_modules/react/index.js') },
      { find: /^react\/jsx-runtime$/, replacement: path.resolve(__dirname, './node_modules/react/jsx-runtime.js') },
      { find: /^react\/jsx-dev-runtime$/, replacement: path.resolve(__dirname, './node_modules/react/jsx-dev-runtime.js') },
      { find: /^react-dom$/, replacement: path.resolve(__dirname, './node_modules/react-dom/index.js') },
      { find: /^react-dom\/client$/, replacement: path.resolve(__dirname, './node_modules/react-dom/client.js') },

      // SpaceUI — resolve to source for HMR
      { find: '@spacedrive/tokens/src/css', replacement: `${spaceui}/tokens/src/css` },
      { find: '@spacedrive/tokens', replacement: `${spaceui}/tokens` },
      { find: '@spacedrive/primitives', replacement: `${spaceui}/primitives/src/index.ts` },
      { find: '@spacedrive/ai', replacement: `${spaceui}/ai/src/index.ts` },
      { find: '@spacedrive/forms', replacement: `${spaceui}/forms/src/index.ts` },
      { find: '@spacedrive/explorer', replacement: `${spaceui}/explorer/src/index.ts` },
    ]
  },

  optimizeDeps: {
    exclude: ['@spacedrive/tokens', '@spacedrive/primitives', '@spacedrive/ai', '@spacedrive/forms', '@spacedrive/explorer']
  },

  server: {
    fs: {
      allow: [
        path.resolve(__dirname, '..'),
        path.resolve(__dirname, '../spaceui')
      ]
    }
  }
});
```

---

## Step 3: Set Up Tailwind CSS v4

### Import the theme and base styles

In your app's main CSS entry point:

```css
@import "tailwindcss";

/* SpaceUI design tokens — must come after tailwindcss import */
@import "@spacedrive/tokens/src/css/theme.css";
@import "@spacedrive/tokens/src/css/base.css";

/* Include whichever themes you need */
@import "@spacedrive/tokens/src/css/themes/light.css";
@import "@spacedrive/tokens/src/css/themes/dark.css";
@import "@spacedrive/tokens/src/css/themes/midnight.css";
@import "@spacedrive/tokens/src/css/themes/noir.css";
@import "@spacedrive/tokens/src/css/themes/slate.css";
@import "@spacedrive/tokens/src/css/themes/nord.css";
@import "@spacedrive/tokens/src/css/themes/mocha.css";
```

### Tell Tailwind where to scan for classes

SpaceUI components use Tailwind utility classes internally. Tailwind v4 needs `@source` directives so it knows to scan those files and include the right classes in your build:

```css
/* Adjust relative paths based on your project structure */
@source "../../spaceui/packages/primitives/src";
@source "../../spaceui/packages/ai/src";
@source "../../spaceui/packages/explorer/src";
@source "../../spaceui/packages/forms/src";
```

> **Why `@source` instead of `content`?** Tailwind v4 uses CSS-native `@source` directives instead of the `content` array from v3's JS config. These paths are resolved relative to the CSS file they appear in.

### Available semantic colors

Once the theme is imported, you get these Tailwind classes:

| Category | Classes |
|----------|---------|
| **Accent** | `bg-accent`, `text-accent`, `border-accent`, `bg-accent-faint`, `bg-accent-deep` |
| **Text** | `text-ink`, `text-ink-dull`, `text-ink-faint` |
| **App** | `bg-app`, `bg-app-box`, `bg-app-hover`, `bg-app-selected`, `border-app-line`, `bg-app-input` |
| **Sidebar** | `bg-sidebar`, `bg-sidebar-box`, `text-sidebar-ink`, `border-sidebar-line`, `bg-sidebar-selected` |
| **Menu** | `bg-menu`, `text-menu-ink`, `bg-menu-hover`, `bg-menu-selected`, `border-menu-line` |
| **Status** | `text-status-success`, `text-status-warning`, `text-status-error`, `text-status-info` |

All colors support opacity modifiers: `bg-accent/50`, `bg-sidebar/65`, etc.

---

## Step 4: Use Components

```tsx
// Primitives
import { Button, Input, Dialog, DropdownMenu, Badge, Card, Tooltip } from '@spacedrive/primitives';

// Forms (requires react-hook-form + zod as peer deps)
import { Form, InputField, SelectField, CheckboxField } from '@spacedrive/forms';

// AI components (requires @tanstack/react-query + @tanstack/react-virtual as peer deps)
import { ToolCall, Markdown, MessageBubble, ModelSelector, TaskRow } from '@spacedrive/ai';

// Explorer
import { TagPill, RenameInput } from '@spacedrive/explorer';
```

### Peer dependencies

Each package declares its peer dependencies. Install them in your project:

```bash
# For @spacedrive/primitives
bun add react react-dom tailwindcss

# For @spacedrive/forms (in addition to the above)
bun add react-hook-form zod

# For @spacedrive/ai (in addition to primitives peers)
bun add @tanstack/react-query @tanstack/react-virtual
```

---

## Development Workflow

### Watch mode (local linking only)

Run SpaceUI in watch mode alongside your app for live rebuilds:

```bash
# Terminal 1 — SpaceUI (only needed if NOT using source aliases)
cd spaceui
bun run dev

# Terminal 2 — Your app
cd your-project
bun run dev
```

> **If you set up Vite source aliases (Step 2a)**, you don't need SpaceUI's watch mode at all. Vite transpiles SpaceUI source files directly on demand and picks up changes via HMR.

---

## Publishing & Releases

SpaceUI packages are published publicly to npm under the `@spacedrive` scope. Releases are managed with [Changesets](https://github.com/changesets/changesets) and automated via GitHub Actions.

### How versioning works

- **Linked packages:** `@spacedrive/primitives`, `@spacedrive/forms`, `@spacedrive/ai`, and `@spacedrive/explorer` are version-linked — they always release together at the same version. A breaking change in primitives bumps all four.
- **Independent packages:** `@spacedrive/tokens` is versioned independently, since design token updates don't necessarily require component changes.
- **Internal dependencies:** When a linked package bumps, any internal `@spacedrive/*` dependency is automatically updated to the new version (as a patch bump).

### Release flow

#### 1. Create a changeset

When your PR includes user-facing changes, create a changeset describing what changed:

```bash
bun run changeset
```

This walks you through an interactive prompt:
- Select which packages were affected
- Choose the semver bump type (patch / minor / major)
- Write a summary of the change

It creates a markdown file in `.changeset/` — commit this with your PR.

#### 2. Merge to main

CI runs on every PR (typecheck, build, export verification). The `changeset` job warns if no changeset is included.

#### 3. Version Packages PR (automatic)

When changesets land on `main`, the release workflow automatically opens (or updates) a **"Version Packages"** PR. This PR:
- Bumps version numbers in all affected `package.json` files
- Updates `CHANGELOG.md` in each package
- Updates internal `@spacedrive/*` dependency ranges

Review this PR to see exactly what versions will be published.

#### 4. Publish (automatic)

When you merge the "Version Packages" PR, the release workflow runs again and:
- Builds all packages (`turbo run build`)
- Publishes to npm (`changeset publish`)
- Creates git tags for each released version

### Setting up the release workflow

The GitHub Actions workflow (`.github/workflows/release.yml`) needs one secret:

1. Generate an npm access token: `npm token create` (or create one at npmjs.com → Access Tokens)
2. Add it as `NPM_TOKEN` in your GitHub repo: Settings → Secrets and variables → Actions → New repository secret

The `GITHUB_TOKEN` is provided automatically by GitHub Actions.

### Consuming published versions

Once packages are published, consuming projects should use versioned ranges instead of `link:`:

```json
{
  "dependencies": {
    "@spacedrive/tokens": "^0.1.0",
    "@spacedrive/primitives": "^0.1.0",
    "@spacedrive/ai": "^0.1.0",
    "@spacedrive/forms": "^0.1.0",
    "@spacedrive/explorer": "^0.1.0"
  }
}
```

With published packages, you can remove the Vite source aliases (Step 2a), `optimizeDeps.exclude` (Step 2b), and `server.fs.allow` (Step 2c). Imports will resolve to the pre-built `dist/` output in `node_modules`. You still need:
- React deduplication (Step 2d)
- Tailwind CSS setup (Step 3) — `@source` paths change to point into `node_modules`:

```css
@source "node_modules/@spacedrive/primitives/dist";
@source "node_modules/@spacedrive/ai/dist";
@source "node_modules/@spacedrive/explorer/dist";
@source "node_modules/@spacedrive/forms/dist";
```

### Manual publishing (without CI)

If you need to publish without the GitHub Action:

```bash
cd spaceui

# 1. Create changeset (if not already done)
bun run changeset

# 2. Bump versions
bun run version-packages

# 3. Review changes, then commit
git add .
git commit -m "chore: version packages"

# 4. Build and publish
bun run publish

# 5. Push tags
git push --follow-tags
```

### Pre-release versions

For testing before a stable release:

```bash
# Enter pre-release mode
bunx changeset pre enter alpha

# Create changesets and version as normal
bun run changeset
bun run version-packages
# This produces versions like 0.1.0-alpha.0

# Publish pre-release
bun run publish --tag alpha

# Exit pre-release mode when ready
bunx changeset pre exit
```

Consumers install pre-releases explicitly: `bun add @spacedrive/primitives@alpha`

---

## React Native / NativeWind

For React Native projects using NativeWind, you can't import CSS files directly. SpaceUI provides `raw-colors.cjs` — a CommonJS export of raw HSL values:

```js
// tailwind.config.js (React Native)
const sharedColors = require('@spacedrive/tokens/raw-colors');

module.exports = {
  theme: {
    extend: {
      colors: {
        accent: sharedColors.accent,
        ink: sharedColors.ink,
        sidebar: sharedColors.sidebar,
        app: sharedColors.app,
        menu: sharedColors.menu,
      }
    }
  }
};
```

---

## Next.js

For Next.js projects, the Vite-specific config doesn't apply. Instead:

### next.config.ts

Tell Next.js to transpile SpaceUI packages (they ship as ESM with JSX):

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: [
    '@spacedrive/primitives',
    '@spacedrive/ai',
    '@spacedrive/forms',
    '@spacedrive/explorer',
  ],
};

export default nextConfig;
```

### CSS setup

The Tailwind v4 CSS setup (Step 3) is the same — add `@import` and `@source` directives in your global CSS file.

### React deduplication

Next.js handles React deduplication automatically. No extra config needed.

---

## Troubleshooting

### "Invalid hook call" / multiple React instances

React is being bundled twice. Make sure you have the React aliases from Step 2d, and that `dedupe: ['react', 'react-dom']` is set.

### Tailwind classes from SpaceUI components are missing

Your CSS file is missing the `@source` directives from Step 3. Tailwind v4 only scans paths it's told about.

### Vite can't resolve `@spacedrive/tokens/src/css/theme.css`

The `@spacedrive/tokens/src/css` alias must be listed _before_ the `@spacedrive/tokens` alias. Vite matches the first alias that fits.

### Changes in SpaceUI aren't reflected

1. Check that `optimizeDeps.exclude` includes all `@spacedrive/*` packages
2. Try deleting `node_modules/.vite` to clear Vite's cache
3. If using dist (not source aliases), make sure `bun run dev` is running in SpaceUI

### `EACCES` or "not allowed" from Vite dev server

Add the SpaceUI directory to `server.fs.allow` (Step 2c).

### Bun link not resolving

```bash
# Re-register in spaceui
cd spaceui && bun run link

# Re-link in your project
cd your-project && bun link @spacedrive/primitives

# Verify it's linked
ls -la node_modules/@spacedrive/primitives
# Should show a symlink
```

### Module not found after `bun install`

Running `bun install` can remove links. Re-run `bun link @spacedrive/primitives` (etc.) after installing new dependencies. The `link:` protocol in package.json should prevent this, but if it doesn't, re-link.

---

## Unlinking

When you're done with local development and want to switch back to published versions:

```bash
# In spaceui
bun run unlink

# In your project — switch back to npm versions
# Update package.json: "link:@spacedrive/primitives" → "^0.1.0"
bun install
```

---

## Quick Reference

| Task | Command |
|------|---------|
| **Install from npm** | `bun add @spacedrive/primitives @spacedrive/tokens` |
| **Register for linking** | `cd spaceui && bun run link` |
| **Link into your project** | `cd your-project && bun link @spacedrive/primitives` |
| **Watch mode** | `cd spaceui && bun run dev` |
| **Build all packages** | `cd spaceui && bun run build` |
| **Create a changeset** | `cd spaceui && bun run changeset` |
| **Bump versions** | `cd spaceui && bun run version-packages` |
| **Build + publish to npm** | `cd spaceui && bun run publish` |
| **Unlink** | `cd spaceui && bun run unlink` |
| **Clear Vite cache** | `rm -rf node_modules/.vite` |
