import { Switch } from '@spacedrive/primitives';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './Form';

export interface SwitchFieldProps {
  name: string;
  label?: string;
  description?: string;
  disabled?: boolean;
}

function SwitchField({ name, label, description, disabled }: SwitchFieldProps) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between">
          <div className="space-y-0.5">
            {label && <FormLabel>{label}</FormLabel>}
            {description && <FormDescription>{description}</FormDescription>}
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export { SwitchField };
