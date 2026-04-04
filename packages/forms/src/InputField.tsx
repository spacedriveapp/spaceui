import { Input } from '@spacedrive/primitives';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './Form';

export interface InputFieldProps {
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
}

function InputField({ name, label, description, placeholder, type = 'text', disabled }: InputFieldProps) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input
              placeholder={placeholder}
              type={type}
              disabled={disabled}
              {...field}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export { InputField };
