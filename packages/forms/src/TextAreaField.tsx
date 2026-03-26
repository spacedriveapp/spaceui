import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './Form';

export interface TextAreaFieldProps {
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
}

function TextAreaField({ name, label, description, placeholder, disabled, rows = 4 }: TextAreaFieldProps) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-app-line bg-app-box px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent disabled:cursor-not-allowed disabled:opacity-50"
              placeholder={placeholder}
              disabled={disabled}
              rows={rows}
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

export { TextAreaField };
