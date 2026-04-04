import { CheckBox as Checkbox } from '@spacedrive/primitives';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './Form';

export interface CheckboxFieldProps {
  name: string;
  label?: string;
  description?: string;
  disabled?: boolean;
}

function CheckboxField({ name, label, description, disabled }: CheckboxFieldProps) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
          <FormControl>
            <Checkbox
              checked={field.value}
              onChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            {label && <FormLabel>{label}</FormLabel>}
            {description && <FormDescription>{description}</FormDescription>}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export { CheckboxField };
