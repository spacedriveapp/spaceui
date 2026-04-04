import { SelectRoot, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@spacedrive/primitives';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './Form';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldProps {
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  options: SelectOption[];
  disabled?: boolean;
}

function SelectField({ name, label, description, placeholder, options, disabled }: SelectFieldProps) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <SelectRoot onValueChange={field.onChange} defaultValue={field.value} disabled={disabled}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export { SelectField };
