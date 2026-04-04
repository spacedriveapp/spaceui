# @spacedrive/forms

Form field wrappers built on react-hook-form for SpaceUI.

## Installation

```bash
bun add @spacedrive/forms @spacedrive/primitives react-hook-form zod
# or
npm install @spacedrive/forms @spacedrive/primitives react-hook-form zod
```

Peer dependencies:
- `react` ^18.0.0 || ^19.0.0
- `react-dom` ^18.0.0 || ^19.0.0
- `react-hook-form` ^7.0.0
- `zod` ^3.0.0

## Usage

### Basic Form

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, InputField, SelectField, CheckboxField } from '@spacedrive/forms';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  role: z.enum(['admin', 'user']),
  newsletter: z.boolean().default(false),
});

type FormData = z.infer<typeof schema>;

function MyForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: 'user',
      newsletter: false,
    },
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InputField
          name="name"
          label="Full Name"
          placeholder="John Doe"
        />
        
        <InputField
          name="email"
          label="Email"
          type="email"
          placeholder="john@example.com"
        />
        
        <SelectField
          name="role"
          label="Role"
          options={[
            { value: 'admin', label: 'Administrator' },
            { value: 'user', label: 'User' },
          ]}
        />
        
        <CheckboxField
          name="newsletter"
          label="Subscribe to newsletter"
        />
        
        <button type="submit">Submit</button>
      </form>
    </Form>
  );
}
```

## Components

### Form

The root form provider that wraps react-hook-form's FormProvider:

```tsx
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    {/* Fields */}
  </form>
</Form>
```

### InputField

Text input with label, placeholder, and error handling:

```tsx
<InputField
  name="username"
  label="Username"
  description="Your public display name"
  placeholder="johndoe"
  type="text"  // text, email, password, etc.
/>
```

### TextAreaField

Multi-line text input:

```tsx
<TextAreaField
  name="bio"
  label="Biography"
  placeholder="Tell us about yourself..."
  rows={4}
/>
```

### SelectField

Dropdown select with options:

```tsx
<SelectField
  name="country"
  label="Country"
  placeholder="Select a country"
  options={[
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
  ]}
/>
```

### CheckboxField

Single checkbox with label:

```tsx
<CheckboxField
  name="agree"
  label="I agree to the terms"
  description="You must agree to continue"
/>
```

### RadioGroupField

Radio button group:

```tsx
<RadioGroupField
  name="plan"
  label="Subscription Plan"
  options={[
    { value: 'free', label: 'Free' },
    { value: 'pro', label: 'Pro ($10/month)' },
    { value: 'enterprise', label: 'Enterprise ($50/month)' },
  ]}
/>
```

### SwitchField

Toggle switch:

```tsx
<SwitchField
  name="notifications"
  label="Enable notifications"
  description="Receive push notifications"
/>
```

## Features

- **Automatic validation** - Zod schema integration
- **Error messages** - Displays validation errors
- **Accessible** - Proper labels and ARIA attributes
- **Type-safe** - Full TypeScript support
- **Composable** - Works with react-hook-form's API

## Advanced Usage

### Custom Validation

```tsx
import { z } from 'zod';

const schema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});
```

### Dynamic Fields

```tsx
import { useFieldArray } from 'react-hook-form';

function DynamicForm() {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  return (
    <>
      {fields.map((field, index) => (
        <InputField
          key={field.id}
          name={`items.${index}.name`}
          label={`Item ${index + 1}`}
        />
      ))}
      <button type="button" onClick={() => append({ name: '' })}>
        Add Item
      </button>
    </>
  );
}
```

### Manual Error Display

```tsx
import { FormMessage } from '@spacedrive/forms';

// Inside a custom component
<FormMessage>
  Custom error message here
</FormMessage>
```

## Styling

Form fields automatically use SpaceUI's semantic colors:

- Labels: `text-ink`
- Descriptions: `text-ink-dull`
- Errors: `text-status-error`
- Inputs: `border-app-line bg-app-box`

No additional styling needed - works out of the box with your Tailwind + SpaceUI setup.

## API Reference

### Form Components

All field components accept:

| Prop | Type | Description |
|------|------|-------------|
| `name` | `string` | Field name (required) |
| `label` | `string` | Field label |
| `description` | `string` | Help text below field |
| `disabled` | `boolean` | Disable the field |

### SelectField Options

```typescript
type SelectOption = {
  value: string;
  label: string;
};
```

### RadioGroupField Options

```typescript
type RadioOption = {
  value: string;
  label: string;
};
```

## License

MIT © Spacedrive
