import { clsx } from 'clsx';
import { forwardRef } from 'react';
import { X } from '@phosphor-icons/react';

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning';
  onDismiss?: () => void;
}

const Toast = forwardRef<HTMLDivElement, ToastProps>(
  ({ title, description, variant = 'default', onDismiss, className, children, ...props }, ref) => {
    const variantClasses = {
      default: 'border-app-line bg-app-box',
      success: 'border-status-success/20 bg-status-success/10',
      error: 'border-status-error/20 bg-status-error/10',
      warning: 'border-status-warning/20 bg-status-warning/10',
    };

    return (
      <div
        ref={ref}
        className={clsx(
          'relative flex w-full items-start gap-3 rounded-lg border p-4 shadow-lg',
          variantClasses[variant],
          className
        )}
        {...props}
      >
        <div className="flex-1 min-w-0">
          {title && <p className="text-sm font-medium text-ink">{title}</p>}
          {description && <p className="mt-1 text-sm text-ink-dull">{description}</p>}
          {children}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="shrink-0 rounded-md p-1 text-ink-dull hover:bg-app-hover hover:text-ink"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
    );
  }
);

Toast.displayName = 'Toast';

export { Toast };
