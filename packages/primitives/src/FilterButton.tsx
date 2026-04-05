import { clsx } from 'clsx';
import { forwardRef } from 'react';

export interface FilterButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  label?: string;
}

const FilterButton = forwardRef<HTMLButtonElement, FilterButtonProps>(
  ({ className, active, label, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={clsx(
          'inline-flex items-center justify-center rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
          active
            ? 'bg-accent text-white'
            : 'bg-app-box text-ink-dull hover:bg-app-hover hover:text-ink',
          className
        )}
        {...props}
      >
        {label ?? children}
      </button>
    );
  }
);

FilterButton.displayName = 'FilterButton';

export { FilterButton };
