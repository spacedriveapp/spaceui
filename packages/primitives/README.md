# @spacedrive/primitives

Primitive UI components built on Radix UI with Tailwind CSS styling.

## Installation

```bash
bun add @spacedrive/primitives @spacedrive/tokens
# or
npm install @spacedrive/primitives @spacedrive/tokens
```

Peer dependencies:
- `react` ^18.0.0 || ^19.0.0
- `react-dom` ^18.0.0 || ^19.0.0
- `tailwindcss` ^4.1.0

## Setup

1. **Configure your CSS entrypoint**
   ```css
   @import '@spacedrive/tokens/theme';
   ```

2. **Import CSS**
   ```css
   @import '@spacedrive/tokens/css';
   ```

## Usage

```tsx
import { Button, Card, Dialog, Input, Badge } from '@spacedrive/primitives';

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input placeholder="Enter your name" />
        <Button>Get Started</Button>
      </CardContent>
    </Card>
  );
}
```

## Components

### Interactive
- **Button** - Multiple variants (default, subtle, outline, dotted, gray, accent, colored, bare)
- **Input** - Form input with error states
- **Checkbox** - Accessible checkbox with Radix
- **Switch** - Toggle switch with 3 sizes
- **Slider** - Range slider with marks support
- **RadioGroup** - Radio button groups

### Overlay
- **Dialog** - Modal dialogs with animations
- **Popover** - Floating content panels
- **Tooltip** - Hover tooltips
- **DropdownMenu** - Contextual menus
- **ContextMenu** - Right-click menus

### Navigation
- **Tabs** - Tabbed interfaces
- **Select** - Dropdown selects
- **Dropdown** - Simple expanding dropdowns

### Display
- **Badge** - Status badges (6 variants, 2 sizes)
- **Card** - Container with header/content/footer
- **Banner** - Alert banners (5 variants)
- **Toast** - Notification toasts
- **Loader** - Loading spinners and dots
- **Divider** - Horizontal/vertical dividers
- **Typography** - Text components (6 heading, 3 body)
- **Shortcut** - Keyboard shortcut display

### Form
- **NumberStepper** - Increment/decrement with min/max
- **FilterButton** - Toggle buttons for filters
- **ToggleGroup** - Radio-like button groups
- **SearchBar** - Search inputs with icons

### Progress
- **ProgressBar** - Linear progress (with variants)
- **CircularProgress** - Circular/spinner progress

### Layout
- **Resizable** - Resizable panel groups
- **Collapsible** - Expand/collapse sections
- **TopBarButton** - Top bar navigation buttons

## Component API

All components follow consistent patterns:

### Variants with CVA

Components use `class-variance-authority` for variants:

```tsx
import { buttonVariants } from '@spacedrive/primitives';

// Use variants directly
<button className={buttonVariants({ variant: 'subtle', size: 'sm' })}>
  Small Subtle
</button>
```

### Ref Forwarding

All interactive components support ref forwarding:

```tsx
import { useRef } from 'react';
import { Button } from '@spacedrive/primitives';

function MyComponent() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  return <Button ref={buttonRef}>Click me</Button>;
}
```

### ClassName Composition

Components compose className with internal styles:

```tsx
<Button className="w-full mt-4">
  {/* Classes are merged: internal + "w-full mt-4" */}
</Button>
```

## Design Principles

1. **Accessible** - Built on Radix UI primitives
2. **Composable** - Small, focused components that compose
3. **Theme-agnostic** - Uses semantic color classes
4. **No business logic** - Purely presentational
5. **Type-safe** - Full TypeScript support

## Customization

### Overriding Styles

Use Tailwind classes to override:

```tsx
<Button 
  variant="default"
  className="bg-purple-500 hover:bg-purple-600"  {/* Override colors */}
>
  Custom Button
</Button>
```

### Creating Variants

Extend CVA variants:

```tsx
import { cva } from 'class-variance-authority';

const myButtonVariants = cva(
  'base-styles',
  {
    variants: {
      size: {
        xs: 'px-2 py-1 text-xs',
        xl: 'px-6 py-3 text-lg',
      }
    }
  }
);
```

## Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+

Requires CSS custom properties support.

## License

MIT © Spacedrive
