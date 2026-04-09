# @spacedrive/tokens

Design tokens for SpaceUI.
This package is CSS-first for Tailwind v4, with optional raw color exports for programmatic consumers.

## Installation

```bash
bun add @spacedrive/tokens
# or
npm install @spacedrive/tokens
```

## Usage

### Theme Entry Layer

```css
/* In your global CSS entrypoint */
@import '@spacedrive/tokens/theme';
```

### CSS Import

```css
/* In your base CSS file */
@import '@spacedrive/tokens/css';
```

### Programmatic Access

```typescript
import colors from '@spacedrive/tokens/raw-colors';

// Access color values
console.log(colors.accent.DEFAULT); // "200, 100%, 60%"
console.log(colors.ink.dull);       // "0, 0%, 70%"
```

## Color System

### Semantic Colors

All colors use semantic names rather than literal colors:

- **accent** - Primary brand color (blue in dark mode)
- **ink** - Text colors (white → gray scale)
- **app** - App backgrounds and surfaces
- **sidebar** - Sidebar-specific colors
- **menu** - Dropdown/menu colors
- **status** - Success, warning, error states

### Color Variants

Each color has variants:
- `DEFAULT` - Base color
- `faint` - Lighter variant
- `dull` - Muted variant
- `deep` - Darker variant

Example:
```css
/* Accent colors */
accent           /* Primary blue */
accent-faint     /* Light blue */
accent-deep      /* Dark blue */

/* Text colors */
ink              /* Primary text (white in dark) */
ink-dull         /* Secondary text */
ink-faint        /* Tertiary text */
```

### CSS Custom Properties

Colors are exposed as CSS custom properties:

```css
--color-accent: 200, 100%, 60%;
--color-accent-faint: 200, 100%, 90%;
--color-ink: 0, 0%, 100%;
--color-ink-dull: 0, 0%, 70%;
/* etc. */
```

**Note:** Values are bare HSL numbers (not wrapped in `hsl()`) for Tailwind alpha support.

## Tailwind Classes

With the preset installed, use semantic classes directly:

```tsx
<div className="bg-app text-ink">
  <button className="bg-accent text-white hover:bg-accent-deep">
    Click me
  </button>
  <p className="text-ink-dull">
    Secondary text
  </p>
</div>
```

### Opacity Modifiers

Works with Tailwind's opacity syntax:

```tsx
<div className="bg-accent/10">    {/* 10% opacity */}
<div className="bg-sidebar/65">    {/* 65% opacity */}
```

## Themes

### Dark Theme (Default)

```css
@import '@spacedrive/tokens/css/themes/dark';
```

### Light Theme

```css
@import '@spacedrive/tokens/css/themes/light';
```

Or toggle via class:

```html
<html class="dark">
  <!-- Dark mode -->
</html>

<html class="light">
  <!-- Light mode -->
</html>
```

## API

### `raw-colors`

An object containing all color definitions:

```typescript
{
  accent: { DEFAULT: string, faint: string, deep: string },
  ink: { DEFAULT: string, dull: string, faint: string },
  app: { DEFAULT: string, box: string, line: string, hover: string, selected: string },
  sidebar: { DEFAULT: string, box: string, line: string, ink: string, inkDull: string, ... },
  menu: { DEFAULT: string, line: string, hover: string, ink: string },
  status: { success: string, warning: string, error: string, info: string }
}
```

## Design Principles

1. **Semantic naming** - Use purpose-based names, not literal colors
2. **Theme-agnostic** - Components work in both dark and light modes
3. **HSL format** - Bare HSL values for Tailwind alpha support
4. **Consistent scale** - Predictable variants (faint, dull, deep)

## License

MIT © Spacedrive
