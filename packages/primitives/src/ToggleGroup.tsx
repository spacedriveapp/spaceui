import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { clsx } from 'clsx';
import { forwardRef } from 'react';

export interface ToggleOption {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  title?: string;
  className?: string;
}

export interface ToggleGroupProps {
  options: ToggleOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
  itemClassName?: string;
}

const ToggleGroup = forwardRef<React.ElementRef<typeof ToggleGroupPrimitive.Root>, ToggleGroupProps>(
  ({ options, value, onChange, className, disabled, itemClassName }, ref) => {
    return (
      <ToggleGroupPrimitive.Root
        ref={ref}
        type="single"
        value={value}
        onValueChange={(val) => val && onChange(val)}
        disabled={disabled}
        className={clsx(
          'inline-flex items-center rounded-md border border-app-line bg-app-box p-1',
          className
        )}
      >
        {options.map((option) => (
          <ToggleGroupPrimitive.Item
            key={option.value}
            value={option.value}
            title={option.title}
            className={clsx(
              'inline-flex items-center gap-1.5 rounded-sm px-3 py-1 text-sm font-medium',
              'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
              'data-[state=on]:bg-app data-[state=on]:text-ink text-ink-dull hover:text-ink',
              disabled && 'cursor-not-allowed opacity-50',
              itemClassName,
              option.className,
            )}
          >
            {option.icon && <option.icon className="size-4" />}
            {option.label}
          </ToggleGroupPrimitive.Item>
        ))}
      </ToggleGroupPrimitive.Root>
    );
  }
);

ToggleGroup.displayName = 'ToggleGroup';

export { ToggleGroup };
