# SpaceUI

A shared design system for Spacedrive and Spacebot applications.

## Overview

SpaceUI is a standalone repository that houses all shared UI components, design tokens, and styling utilities for the Spacedrive ecosystem. It enables consistent design across multiple applications while maintaining clean dependency boundaries.

## Package Structure

```
spaceui/
├── packages/
│   ├── tokens/         # @spacedrive/tokens - CSS design tokens + raw colors
│   ├── primitives/     # @spacedrive/primitives - Base UI components (40+)
│   ├── forms/          # @spacedrive/forms - react-hook-form wrappers
│   ├── ai/             # @spacedrive/ai - AI agent components (18)
│   └── explorer/       # @spacedrive/explorer - File management (14)
├── examples/
│   └── showcase/       # Interactive demo app
├── .storybook/         # Component documentation
└── scripts/            # Development utilities
```

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/spacedriveapp/spaceui.git
cd spaceui

# Install dependencies
bun install

# Build all packages
bun run build
```

### Development

```bash
# Start development mode with file watching
bun run dev

# Run the showcase app
bun run showcase

# Start Storybook
bun run storybook

# Build specific package
bun run watch primitives

# Type check
bun run typecheck

# Clean build artifacts
bun run clean
```

### Local Development with Linked Packages

```bash
# Link all packages for local development
bun run link

# Then in consuming app:
cd /path/to/spacedrive
bun link @spacedrive/primitives @spacedrive/tokens

# When done, unlink:
bun run unlink
```

## Using SpaceUI

### In a Spacedrive/Spacebot Application

```typescript
// Import raw semantic token values when needed
import colors from '@spacedrive/tokens/raw-colors';

// Import primitives
import { Button, Card, Dialog } from '@spacedrive/primitives';

// Import form fields
import { InputField, SelectField } from '@spacedrive/forms';

// Import AI components
import { ToolCall, ChatComposer, Markdown } from '@spacedrive/ai';

// Import explorer components
import { FileGrid, PathBar, Inspector } from '@spacedrive/explorer';
```

### Tailwind Configuration

```css
/* Tailwind v4 CSS entrypoint */
@import '@spacedrive/tokens/theme';
```

### CSS Setup

```css
/* In your app's base CSS */
@import '@spacedrive/tokens/css';
```

## Packages

### @spacedrive/tokens

Design tokens package with CSS entrypoints and raw semantic color values.

**Exports:**
- `@spacedrive/tokens/css` - Base token layer
- `@spacedrive/tokens/theme` - Theme variable layer
- `@spacedrive/tokens/raw-colors` - Programmatic semantic color map
- CSS files for dark/light themes

[Read more →](./packages/tokens/README.md)

### @spacedrive/primitives

Base UI components built on Radix UI primitives.

**Components:**
- **Interactive:** Button, Input, Checkbox, Switch, Slider, RadioGroup
- **Overlay:** Dialog, Popover, Tooltip, DropdownMenu, ContextMenu
- **Navigation:** Tabs, Select, Dropdown
- **Display:** Badge, Card, Banner, Toast, Loader, Divider, Typography, Shortcut
- **Form:** NumberStepper, FilterButton, ToggleGroup, SearchBar
- **Progress:** ProgressBar, CircularProgress
- **Layout:** Resizable panels, Collapsible, TopBarButton

[Read more →](./packages/primitives/README.md)

### @spacedrive/forms

Form field wrappers built on react-hook-form.

**Components:**
- Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage
- InputField, TextAreaField, SelectField, CheckboxField, RadioGroupField, SwitchField

[Read more →](./packages/forms/README.md)

### @spacedrive/ai

AI agent interaction components.

**Components:**
- `ToolCall` - Tool invocation display
- `Markdown` - Agent response renderer
- `InlineWorkerCard` - Worker task card with transcript
- `ChatComposer` - Message input with model selection
- `ModelSelect` - LLM model picker
- `ProfileAvatar` - Deterministic avatar from seed
- `AgentSelector` - Agent switching dropdown
- `ConnectionStatus` - Connection state indicator
- `TaskBoard`, `TaskCard` - Kanban task management
- `MemoryGraph`, `MemoryList` - Memory visualization and list
- `CronJobList` - Cron job management
- `AutonomyPanel` - Autonomy level control

[Read more →](./packages/ai/README.md)

### @spacedrive/explorer

File management and explorer components.

**Components:**
- `KindIcon` - File type icons
- `FileThumb` - File thumbnail renderer
- `TagPill` - Colored tag pill
- `RenameInput` - Inline rename field
- `FileRow` - Single row in list view
- `FileGrid` - Grid layout of files
- `FileList` - Table/list layout
- `PathBar` - Breadcrumb navigation
- `Inspector` - File metadata panel
- `InspectorPanel` - Collapsible inspector section
- `DragOverlay` - Drag and drop visual feedback
- `QuickPreview` - Spacebar preview modal

[Read more →](./packages/explorer/README.md)

## Development Workflow

### Running the Showcase App

The showcase app demonstrates all components:

```bash
bun run showcase
# Opens at http://localhost:19850
```

### Storybook

Component documentation with interactive stories:

```bash
cd .storybook
bun install
bun run dev
# Opens at http://localhost:6006
```

### Local Development

For local development with linked packages:

```bash
# In spaceui repo
bun run link

# In consuming app
cd spacedrive/apps/web
bun link @spacedrive/primitives
```

### Creating a Changeset

We use [Changesets](https://github.com/changesets/changesets) for versioning:

```bash
# Create a changeset
bun run changeset

# Select packages and describe changes
# This creates a .changeset/*.md file

# Version packages
bun run version-packages

# Publish to npm
bun run publish
```

## Migration Guide

See [SHARED-UI-STRATEGY.md](./SHARED-UI-STRATEGY.md) for the complete migration plan from existing Spacedrive and Spacebot UI codebases.

Quick start for migration:

1. **Phase 1** - Move `ToolCall.tsx` and `Markdown.tsx` to stop duplication
2. **Phase 2** - Migrate primitives (Button, Input, etc.)
3. **Phase 3** - Extract AI components
4. **Phase 4** - Build new shared components
5. **Phase 5** - Extract explorer components
6. **Phase 6** - Cleanup old code

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup and guidelines.

Quick contributing workflow:

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make your changes in the appropriate package
3. Add a changeset: `bun run changeset`
4. Run `bun run build` to ensure everything compiles
5. Run `bun run typecheck` to verify types
6. Commit your changes with a clear message
7. Push and create a pull request

## Scripts

| Script | Description |
|--------|-------------|
| `bun run build` | Build all packages |
| `bun run dev` | Watch mode for all packages |
| `bun run watch [package]` | Watch specific package |
| `bun run typecheck` | Type check all packages |
| `bun run clean` | Clean build artifacts |
| `bun run showcase` | Run demo app |
| `bun run link` | Link packages for local dev |
| `bun run unlink` | Unlink packages |
| `bun run changeset` | Create a changeset |
| `bun run version-packages` | Bump versions |
| `bun run publish` | Publish to npm |

## Resources

- [Design Strategy](./SHARED-UI-STRATEGY.md) - Migration plan & architecture
- [Contributing Guide](./CONTRIBUTING.md) - Development setup & guidelines
- [Package READMEs](./packages/) - Individual package documentation
- [Radix UI](https://www.radix-ui.com/) - Primitives we build on
- [Tailwind CSS](https://tailwindcss.com/) - Styling system

## License

MIT © Spacedrive
