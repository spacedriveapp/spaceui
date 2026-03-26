import { clsx } from 'clsx';
import { forwardRef } from 'react';

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots';
}

const Loader = forwardRef<HTMLDivElement, LoaderProps>(
  ({ size = 'md', variant = 'spinner', className, ...props }, ref) => {
    const sizeClasses = {
      sm: 'size-4',
      md: 'size-6',
      lg: 'size-8',
    };

    if (variant === 'dots') {
      return (
        <div ref={ref} className={clsx('flex items-center gap-1', className)} {...props}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={clsx(
                'animate-bounce rounded-full bg-accent',
                size === 'sm' ? 'size-1.5' : size === 'md' ? 'size-2' : 'size-3'
              )}
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      );
    }

    return (
      <div ref={ref} className={clsx('inline-block', className)} {...props}>
        <span
          className={clsx(
            'inline-block animate-spin rounded-full border-2 border-accent border-t-transparent',
            sizeClasses[size]
          )}
        />
      </div>
    );
  }
);

Loader.displayName = 'Loader';

export { Loader };
