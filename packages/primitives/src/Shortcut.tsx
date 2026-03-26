import { clsx } from 'clsx';
import { forwardRef } from 'react';

export interface ShortcutProps extends React.HTMLAttributes<HTMLSpanElement> {
  keys: string[];
  variant?: 'default' | 'small';
}

const Shortcut = forwardRef<HTMLSpanElement, ShortcutProps>(
  ({ keys, variant = 'default', className, ...props }, ref) => {
    const sizeClasses = {
      default: 'px-1.5 py-0.5 text-xs',
      small: 'px-1 py-0.5 text-[10px]',
    };

    return (
      <span ref={ref} className={clsx('inline-flex items-center gap-0.5', className)} {...props}>
        {keys.map((key, i) => (
          <kbd
            key={i}
            className={clsx(
              'rounded border border-app-line bg-app-box font-mono text-ink-dull',
              sizeClasses[variant]
            )}
          >
            {key}
          </kbd>
        ))}
      </span>
    );
  }
);

Shortcut.displayName = 'Shortcut';

export { Shortcut };
