import { RadioGroupRoot as RadioGroup, RadioGroupItem } from '@spacedrive/primitives';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './Form';

export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioGroupFieldProps {
  name: string;
  label?: string;
  description?: string;
  options: RadioOption[];
  disabled?: boolean;
}

function RadioGroupField({ name, label, description, options, disabled }: RadioGroupFieldProps) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-3">
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
              disabled={disabled}
            >
              {options.map((option) => (
                <FormItem key={option.value} className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value={option.value} />
                  </FormControl>
                  <FormLabel className="font-normal">{option.label}</FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export { RadioGroupField };
