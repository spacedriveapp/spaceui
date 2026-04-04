# Tailwind v4 Migration Spec

Migration spec for upgrading the entire Spacedrive stack from Tailwind CSS v3 to v4.

**Scope:** spaceui, spacedrive (app), spacedrive-web (marketing site)

---

## Why

Next.js 16 + Turbopack requires Tailwind v4. The marketing site (spacedrive-web) is blocked on this. Rather than maintain two Tailwind versions across the stack, we're upgrading everything.

---

## Critical v4 Changes (Must Understand Before Starting)

### 1. CSS-First Configuration

v4 replaces `tailwind.config.js` with CSS directives. Custom colors, fonts, spacing, etc. are defined in `@theme` blocks in CSS:

```css
@import "tailwindcss";

@theme {
  --color-brand: oklch(0.55 0.2 250);
  --font-display: "Satoshi", sans-serif;
}
```

Any `--color-*` variable in `@theme` auto-generates ALL color utilities (`bg-*`, `text-*`, `border-*`, `ring-*`, `fill-*`, etc.).

JS config files are still supported via the `@config` directive but are not auto-detected:

```css
@import "tailwindcss";
@config "../../tailwind.config.js";
```

### 2. Import Syntax

**v3:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**v4:**
```css
@import "tailwindcss";
```

### 3. PostCSS Plugin Changed

**v3:**
```js
plugins: { tailwindcss: {}, autoprefixer: {} }
```

**v4:**
```js
plugins: { "@tailwindcss/postcss": {} }
```

Autoprefixer is built in — remove it.

For Vite-based projects (Tauri, Storybook, showcase), use the Vite plugin instead:

```ts
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
});
```

### 4. SCSS Not Supported

**Tailwind v4 does not work with Sass/SCSS/Less/Stylus.** It is designed to be the preprocessor. The spacedrive app's `packages/ui/style/style.scss` must be converted to plain CSS. Modern CSS has nesting and variables natively — SCSS is no longer needed.

### 5. Color Token Format

v4 `@theme` expects **complete CSS color values**, not bare HSL triplets:

```css
/* v3 pattern (bare triplets + <alpha-value> in JS) */
--color-app: 240, 20%, 16%;

/* v4 pattern (full CSS color values in @theme) */
--color-app: hsl(240, 20%, 16%);
```

When defined in `@theme`, opacity modifiers still work: `bg-app/50` applies 50% opacity automatically.

### 6. Dark Mode

No `darkMode: 'class'` config key. Use `@custom-variant`:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

For theme classes like `midnight-theme`:

```css
@custom-variant midnight (&:where(.midnight-theme, .midnight-theme *));
```

### 7. Content Detection

v4 auto-detects files to scan (excludes `.gitignore`-d files, `node_modules`, binaries). No `content` array needed.

To add sources (e.g., node_modules packages):

```css
@source "../node_modules/@spacedrive/primitives";
```

### 8. Plugins

JS plugins loaded via `@plugin` in CSS:

```css
@plugin "@tailwindcss/typography";
@plugin "./my-local-plugin.js";
```

### 9. Renamed/Changed Utilities

| v3 | v4 |
|---|---|
| `shadow-sm` | `shadow-xs` |
| `shadow` (default) | `shadow-sm` |
| `rounded-sm` | `rounded-xs` |
| `rounded` (default) | `rounded-sm` |
| `blur-sm` | `blur-xs` |
| `blur` (default) | `blur-sm` |
| `ring` (3px) | `ring-3` (default `ring` is 1px) |
| `outline-none` | `outline-hidden` |
| `bg-gradient-to-*` | `bg-linear-to-*` |

### 10. Removed Utilities

These are removed — use opacity modifiers instead:

- `bg-opacity-*` → `bg-black/50`
- `text-opacity-*` → `text-black/50`
- `border-opacity-*` → `border-black/50`
- `ring-opacity-*` → `ring-black/50`

### 11. Changed Defaults

| Feature | v3 | v4 |
|---|---|---|
| Default border color | `gray-200` | `currentColor` |
| Default ring width | `3px` | `1px` |
| Hover | All devices | Only `@media (hover: hover)` |

### 12. Custom Utilities

**v3:**
```css
@layer utilities {
  .no-scrollbar { scrollbar-width: none; }
}
```

**v4:**
```css
@utility no-scrollbar {
  scrollbar-width: none;
}
```

### 13. Arbitrary Value Syntax for CSS Variables

**v3:** `bg-[--brand-color]`
**v4:** `bg-(--brand-color)`

---

## Migration Strategy

We're going **CSS-first** — the v4 native approach. No `@config` compatibility shim. The spaceui token system becomes a CSS file that consumers import. The JS preset (`tailwind-preset.ts`, `spacedrive-tailwind.cjs`) gets replaced.

### Why CSS-First

- The JS preset only exists to map CSS variables to Tailwind colors. In v4, `@theme` does this natively.
- CSS-first means no build step for tokens (no tsup, no `dist/index.js`).
- Consumers just `@import` a CSS file — works everywhere, no config files.
- The token CSS files (base.css, themes/*.css) already exist and are the source of truth.

---

## Part 1: spaceui Migration

### 1.1 Convert Token System to CSS-First

**Delete (no longer needed):**
- `packages/tokens/src/colors.ts` — the `<alpha-value>` JS helper
- `packages/tokens/src/tailwind-preset.ts` — the JS preset
- `packages/tokens/tsup.config.ts` — the build config (tokens become pure CSS)

**Create:** `packages/tokens/src/css/theme.css`

This is the new v4 theme file. It defines all colors as `--color-*` variables inside `@theme`, which auto-generates all Tailwind utilities.

```css
@theme {
  /* Remove all default Tailwind colors — we use our own */
  --color-*: initial;

  /* Accent */
  --color-accent: hsl(208, 100%, 57%);
  --color-accent-faint: hsl(208, 100%, 64%);
  --color-accent-deep: hsl(208, 100%, 47%);

  /* Text */
  --color-ink: hsl(235, 35%, 92%);
  --color-ink-dull: hsl(235, 10%, 70%);
  --color-ink-faint: hsl(235, 10%, 55%);

  /* App surfaces */
  --color-app: hsl(235, 15%, 13%);
  --color-app-box: hsl(235, 15%, 18%);
  --color-app-dark-box: hsl(235, 15%, 15%);
  --color-app-darker-box: hsl(235, 16%, 11%);
  --color-app-light-box: hsl(235, 15%, 34%);
  --color-app-overlay: hsl(235, 15%, 17%);
  --color-app-input: hsl(235, 15%, 20%);
  --color-app-focus: hsl(235, 15%, 10%);
  --color-app-line: hsl(235, 15%, 23%);
  --color-app-divider: hsl(235, 15%, 5%);
  --color-app-button: hsl(235, 15%, 23%);
  --color-app-selected: hsl(235, 15%, 24%);
  --color-app-selected-item: hsl(235, 15%, 18%);
  --color-app-hover: hsl(235, 15%, 21%);
  --color-app-active: hsl(235, 15%, 30%);
  --color-app-shade: hsl(235, 15%, 0%);
  --color-app-frame: hsl(235, 15%, 25%);
  --color-app-slider: hsl(235, 15%, 20%);
  --color-app-explorer-scrollbar: hsl(235, 20%, 25%);

  /* Sidebar */
  --color-sidebar: hsl(235, 15%, 7%);
  --color-sidebar-box: hsl(235, 15%, 16%);
  --color-sidebar-line: hsl(235, 15%, 23%);
  --color-sidebar-ink: hsl(235, 15%, 92%);
  --color-sidebar-ink-dull: hsl(235, 10%, 70%);
  --color-sidebar-ink-faint: hsl(235, 10%, 55%);
  --color-sidebar-divider: hsl(235, 15%, 17%);
  --color-sidebar-button: hsl(235, 15%, 18%);
  --color-sidebar-selected: hsl(235, 15%, 24%);
  --color-sidebar-shade: hsl(235, 15%, 23%);

  /* Menu */
  --color-menu: hsl(235, 15%, 10%);
  --color-menu-line: hsl(235, 15%, 14%);
  --color-menu-ink: hsl(235, 25%, 92%);
  --color-menu-faint: hsl(235, 5%, 80%);
  --color-menu-hover: hsl(235, 15%, 30%);
  --color-menu-selected: hsl(235, 5%, 30%);
  --color-menu-shade: hsl(235, 5%, 0%);

  /* Status */
  --color-status-success: hsl(142, 76%, 36%);
  --color-status-warning: hsl(38, 92%, 50%);
  --color-status-error: hsl(0, 84%, 60%);
  --color-status-info: hsl(208, 100%, 57%);

  /* Black/White */
  --color-black: hsl(0, 0%, 0%);
  --color-white: hsl(0, 0%, 100%);

  /* Border radius */
  --radius-window: 10px;
  --radius-lg: 8px;
  --radius-md: 6px;

  /* Font families */
  --font-sans: "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", "Menlo", "Monaco", monospace;
}
```

**Important:** The `--color-*: initial` at the top removes all default Tailwind colors (red, blue, green, etc.) so only our semantic colors exist. If you want to keep some defaults, remove that line.

### 1.2 Convert Theme Files

The theme files (`dark.css`, `midnight.css`, `noir.css`, etc.) currently use bare HSL triplets with CSS variable references to `--dark-hue`:

```css
/* Current v3 format */
.midnight-theme {
  --dark-hue: 240;
  --color-app: var(--dark-hue), 25%, 8%;
}
```

Convert to full `hsl()` values. Since themes override the base values, they must use the same format — but they go OUTSIDE `@theme` because they're runtime overrides via CSS classes, not static theme definitions:

```css
/* v4 format — CSS class overrides */
.midnight-theme {
  --color-app: hsl(240, 25%, 8%);
  --color-app-box: hsl(240, 20%, 12%);
  --color-app-line: hsl(240, 20%, 16%);
  /* ... all other overrides with hue 240 baked in */
}
```

**This means removing the `--dark-hue` indirection.** Each theme file must have the hue hardcoded into every value. This is more verbose but eliminates the CSS variable nesting that caused issues.

**Files to convert:**
- `packages/tokens/src/css/themes/dark.css`
- `packages/tokens/src/css/themes/light.css`
- `packages/tokens/src/css/themes/midnight.css`
- `packages/tokens/src/css/themes/noir.css`
- `packages/tokens/src/css/themes/slate.css`
- `packages/tokens/src/css/themes/nord.css`
- `packages/tokens/src/css/themes/mocha.css`

### 1.3 Update base.css

**Current:**
```css
@import "./themes/dark.css";

:root {
  --dark-hue: 235;
  --color-accent: 208, 100%, 57%;
  /* ... bare triplets ... */
}
```

**New:** `base.css` becomes the entry point consumers import. It imports `theme.css` (for `@theme` definitions) and the default theme:

```css
@import "./themes/dark.css";
```

The `:root` variables are no longer needed because `@theme` in `theme.css` handles the defaults.

### 1.4 Consumer Pattern

Any app consuming spaceui tokens does this in their main CSS:

```css
@import "tailwindcss";
@import "@spacedrive/tokens/theme";       /* @theme block — generates utilities */
@import "@spacedrive/tokens/css";         /* base + default theme variables */
@import "@spacedrive/tokens/css/themes/midnight";  /* optional theme override */

@custom-variant dark (&:where(.dark, .dark *));
```

That's it. No `tailwind.config.js`. No JS preset. No build step for tokens.

### 1.5 Update package.json Exports

**`packages/tokens/package.json` exports:**

```json
{
  "exports": {
    "./theme": "./src/css/theme.css",
    "./css": "./src/css/base.css",
    "./css/themes/dark": "./src/css/themes/dark.css",
    "./css/themes/midnight": "./src/css/themes/midnight.css"
  }
}
```

Add a `"./theme"` export pointing to the new `theme.css` file.

### 1.6 Update Dependencies

**`packages/tokens/package.json`:**
- Remove `tailwindcss` from devDependencies and peerDependencies (tokens are now pure CSS)
- Remove `tsup` (no JS build needed)
- Remove all Tailwind plugins from dependencies (`@headlessui/tailwindcss`, `@tailwindcss/forms`, `@tailwindcss/typography`, `tailwindcss-animate`, `tailwindcss-radix`) — plugins are loaded by consumers, not the token package

**`packages/primitives/package.json`:**
- Update `tailwindcss: ^3.4.0` → `^4.1.0` in devDependencies and peerDependencies

### 1.7 Update Root tailwind.config.ts

**Delete** `tailwind.config.ts` at root. Replace with a root CSS file for Storybook/dev that imports the tokens:

The storybook preview already imports `packages/tokens/src/css/base.css`. Update it to also import `theme.css`.

### 1.8 Update Storybook

**`.storybook/preview.ts`:**
```ts
import '../packages/tokens/src/css/theme.css';
import '../packages/tokens/src/css/base.css';
```

**`.storybook/main.ts`:** If using Vite, add the Tailwind Vite plugin:
```ts
viteFinal: async (config) => {
  const tailwindcss = (await import('@tailwindcss/vite')).default;
  config.plugins = [...(config.plugins || []), tailwindcss()];
  return config;
}
```

### 1.9 Update Showcase Example

**`examples/showcase/src/index.css`:**
```css
@import "tailwindcss";
@import "@spacedrive/tokens/theme";
@import "@spacedrive/tokens/css";

@custom-variant dark (&:where(.dark, .dark *));
```

**`examples/showcase/vite.config.ts`:**
```ts
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

**`examples/showcase/package.json`:**
- Remove: `tailwindcss`, `autoprefixer`, `postcss`
- Add: `tailwindcss: ^4.1.0`, `@tailwindcss/vite: ^4.1.0`

Delete `postcss.config.js` if it exists (Vite plugin handles everything).

### 1.10 Handle Plugins

The plugins that were in the preset (`@tailwindcss/forms`, `@tailwindcss/typography`, `@headlessui/tailwindcss`, `tailwindcss-animate`, `tailwindcss-radix`) move to **each consumer's CSS** via `@plugin`:

```css
@plugin "@tailwindcss/typography";
@plugin "@tailwindcss/forms";
```

Check each plugin's v4 compatibility:
- `@tailwindcss/forms` — has v4 support, use latest version
- `@tailwindcss/typography` — has v4 support, use latest version
- `@headlessui/tailwindcss` — check if v4-compatible, may need update
- `tailwindcss-animate` — likely compatible, test
- `tailwindcss-radix` — check compatibility, test

**Note:** None of these plugins were actually loaded in the current preset (the `plugins: []` array is empty in `tailwind-preset.ts`). They're only loaded in `spacedrive-tailwind.cjs` for the spacedrive app. So for spaceui itself, no plugin changes are needed.

---

## Part 2: spacedrive App Migration

### 2.1 Convert SCSS to CSS

**CRITICAL:** `packages/ui/style/style.scss` must become `packages/ui/style/style.css`.

The SCSS file uses:
- `@use "sass:meta"` and `@include meta.load-css(...)` — replace with `@import`
- `@tailwind base/components/utilities/variants` — replace with `@import "tailwindcss"`
- `@layer utilities { ... }` — replace with `@utility` blocks
- `@apply` in a `.top-bar-blur` class — still works in v4

**Converted `style.css`:**
```css
@import "tailwindcss";
@import "@spacedrive/tokens/theme";
@import "@spacedrive/tokens/css";
@import "@spacedrive/tokens/css/themes/light";
@import "@spacedrive/tokens/css/themes/midnight";
@import "@spacedrive/tokens/css/themes/noir";
@import "@spacedrive/tokens/css/themes/slate";
@import "@spacedrive/tokens/css/themes/nord";
@import "@spacedrive/tokens/css/themes/mocha";

@plugin "@tailwindcss/forms";
@plugin "tailwindcss-animate";
@plugin "@headlessui/tailwindcss";
@plugin "tailwindcss-radix";
@plugin "@tailwindcss/typography";

@custom-variant dark (&:where(.dark, .dark *));

@utility no-scrollbar {
  &::-webkit-scrollbar { display: none; }
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.backdrop-blur { backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); }
.navbar-blur { backdrop-filter: blur(28px); -webkit-backdrop-filter: blur(28px); }
.top-bar-blur {
  @apply border-app-line/50;
  backdrop-filter: saturate(120%) blur(18px);
}

/* ... other custom styles from style.scss ... */
```

### 2.2 Delete JS Config Files

**Delete:**
- `packages/ui/tailwind.config.js`
- `apps/tauri/tailwind.config.cjs`
- `packages/ui/postcss.config.js`

The CSS file handles everything now.

### 2.3 Replace spacedrive-tailwind.cjs

**Delete:** `spaceui/packages/tokens/spacedrive-tailwind.cjs`

This was the factory function that generated platform-specific Tailwind configs. It's no longer needed. All configuration is in CSS.

The custom values it defined (custom font sizes, screens, transition timing functions, the `primary` and `gray` color scales) need to move into the `@theme` block in `theme.css` or into each app's CSS:

```css
@theme {
  /* Custom font sizes from spacedrive-tailwind.cjs */
  --text-tiny: 0.70rem;
  --text-xs: 0.75rem;
  --text-sm: 0.80rem;

  /* Custom breakpoints */
  --breakpoint-xs: 475px;
  --breakpoint-sm: 650px;
  --breakpoint-md: 868px;

  /* Custom easing (only include what's actually used) */
  --ease-in-out-cubic: cubic-bezier(0.65, 0, 0.35, 1);
}
```

### 2.4 Update Vite Config (Tauri)

If the Tauri app uses Vite, add the Tailwind Vite plugin:

```ts
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
});
```

Remove PostCSS config file — the Vite plugin handles it.

### 2.5 Update Package Dependencies

**`packages/ui/package.json`:**
- Remove: `tailwindcss: ^3.4.1`, `autoprefixer`, `postcss`, `sass`/`sass-loader` (if present)
- Add: `tailwindcss: ^4.1.0`, `@tailwindcss/vite: ^4.1.0`
- Update plugins to v4-compatible versions

### 2.6 Add @source for spaceui Components

Since spaceui components live in `node_modules`, v4's auto-detection won't scan them. Add `@source` directives:

```css
@source "../node_modules/@spacedrive/primitives/src";
@source "../node_modules/@spacedrive/ai/src";
@source "../node_modules/@spacedrive/explorer/src";
@source "../node_modules/@spacedrive/forms/src";
```

### 2.7 Mobile App (React Native + NativeWind)

**Hold on this.** NativeWind has its own Tailwind integration and may not support v4 yet. Check NativeWind's current v4 support status before migrating the mobile app. The mobile app can stay on v3 temporarily if needed — it's a separate build.

---

## Part 3: spacedrive-web Migration

### 3.1 This is Already v4

The marketing site already uses `@import "tailwindcss"`, `@tailwindcss/postcss`, and Tailwind v4. It just needs the token system wired up properly.

### 3.2 Update styles.css

```css
@import "tailwindcss";
@import "@fontsource/space-grotesk/300.css";
@import "@fontsource/space-grotesk/400.css";
@import "@fontsource/space-grotesk/500.css";
@import "@fontsource/space-grotesk/600.css";
@import "@fontsource/space-grotesk/700.css";
@import "@spacedrive/tokens/theme";
@import "@spacedrive/tokens/css";
@import "@spacedrive/tokens/css/themes/midnight";

@theme {
  --font-sans: "Space Grotesk", system-ui, sans-serif;
}

/* ... rest of styles ... */
```

### 3.3 Delete Config Files

- Delete `tailwind.config.ts` (if it exists — it was created during the v3 attempt)
- Keep `postcss.config.mjs` with `@tailwindcss/postcss`

### 3.4 Add @source for spaceui

```css
@source "../node_modules/@spacedrive/primitives/src";
```

---

## Utility Renames to Search/Replace

Run these across the entire codebase (all three projects):

| Search | Replace | Notes |
|---|---|---|
| `shadow-sm` | `shadow-xs` | |
| `shadow"` (bare, as a class) | `shadow-sm"` | Careful — only bare `shadow` class |
| `rounded-sm` | `rounded-xs` | |
| `rounded"` (bare) | `rounded-sm"` | Only bare `rounded` class |
| `blur-sm` | `blur-xs` | |
| `ring"` (bare) | `ring-3"` | If you want to keep 3px ring |
| `outline-none` | `outline-hidden` | |
| `bg-gradient-to-` | `bg-linear-to-` | |

**Use the automated upgrade tool first:** `npx @tailwindcss/upgrade` — it handles most of these renames automatically. Run it in each project directory.

---

## Execution Order

1. **spaceui tokens** — convert color system to CSS-first (`theme.css`), convert theme files to full `hsl()` values, update exports
2. **spaceui packages** — update dependency versions, test storybook
3. **spacedrive-web** — wire up new token imports, verify borders work
4. **spacedrive app** — convert SCSS to CSS, delete JS configs, add Vite plugin, test
5. **spacedrive mobile** — evaluate NativeWind v4 support, migrate if possible, defer if not

---

## Verification Checklist

After migration, verify in each project:

- [ ] `bg-app`, `bg-app-box`, `bg-app-line` etc. all generate correct colors
- [ ] `border-app-line` produces dark borders, not white
- [ ] `text-ink`, `text-ink-dull`, `text-ink-faint` work
- [ ] Opacity modifiers work: `bg-app/50`, `border-accent/20`
- [ ] Dark mode / theme switching works
- [ ] All theme files (midnight, noir, slate, etc.) override correctly
- [ ] No missing utility classes in production builds
- [ ] Renamed utilities (`shadow-sm` → `shadow-xs` etc.) are updated
- [ ] Storybook renders all components correctly
- [ ] Desktop app (Tauri) builds and runs
- [ ] Marketing site builds and runs

---

## Files Changed Summary

### spaceui

| Action | File |
|---|---|
| CREATE | `packages/tokens/src/css/theme.css` |
| REWRITE | `packages/tokens/src/css/base.css` |
| REWRITE | `packages/tokens/src/css/themes/*.css` (7 files — bake in hue values) |
| DELETE | `packages/tokens/src/colors.ts` |
| DELETE | `packages/tokens/src/tailwind-preset.ts` |
| DELETE | `packages/tokens/tsup.config.ts` |
| DELETE | `packages/tokens/spacedrive-tailwind.cjs` |
| DELETE | `tailwind.config.ts` (root) |
| UPDATE | `packages/tokens/package.json` (exports, deps) |
| UPDATE | `packages/primitives/package.json` (tailwind version) |
| UPDATE | `.storybook/preview.ts` (imports) |
| UPDATE | `.storybook/main.ts` (vite plugin) |
| UPDATE | `examples/showcase/src/index.css` |
| UPDATE | `examples/showcase/vite.config.ts` |
| UPDATE | `examples/showcase/package.json` |

### spacedrive app

| Action | File |
|---|---|
| CREATE | `packages/ui/style/style.css` (from style.scss) |
| DELETE | `packages/ui/style/style.scss` |
| DELETE | `packages/ui/tailwind.config.js` |
| DELETE | `packages/ui/postcss.config.js` |
| DELETE | `apps/tauri/tailwind.config.cjs` |
| UPDATE | `packages/ui/package.json` (deps) |
| UPDATE | Vite config (add @tailwindcss/vite) |
| SEARCH/REPLACE | Renamed utilities across all `.tsx` files |

### spacedrive-web

| Action | File |
|---|---|
| UPDATE | `src/styles.css` (token imports) |
| DELETE | `tailwind.config.ts` (if exists) |
| KEEP | `postcss.config.mjs` (already v4) |
| KEEP | `package.json` (already v4 deps) |
