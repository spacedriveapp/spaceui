import { clsx } from 'clsx';
import { forwardRef } from 'react';
import { WifiHigh, WifiSlash, Spinner } from '@phosphor-icons/react';

interface ConnectionStatusProps {
  status: 'connected' | 'connecting' | 'offline' | 'error';
  className?: string;
  showLabel?: boolean;
}

const ConnectionStatus = forwardRef<HTMLDivElement, ConnectionStatusProps>(
  ({ status, className, showLabel = true }, ref) => {
    const config = {
      connected: {
        icon: WifiHigh,
        label: 'Connected',
        color: 'text-status-success',
        bgColor: 'bg-status-success/10',
        dotColor: 'bg-status-success',
      },
      connecting: {
        icon: Spinner,
        label: 'Connecting...',
        color: 'text-accent',
        bgColor: 'bg-accent/10',
        dotColor: 'bg-accent',
      },
      offline: {
        icon: WifiSlash,
        label: 'Offline',
        color: 'text-ink-faint',
        bgColor: 'bg-app-box',
        dotColor: 'bg-ink-faint',
      },
      error: {
        icon: WifiSlash,
        label: 'Connection Error',
        color: 'text-status-error',
        bgColor: 'bg-status-error/10',
        dotColor: 'bg-status-error',
      },
    };

    const { icon: Icon, label, color, bgColor, dotColor } = config[status];

    return (
      <div
        ref={ref}
        className={clsx(
          'inline-flex items-center gap-2 rounded-full px-3 py-1.5',
          bgColor,
          className
        )}
      >
        <span className={clsx('relative flex size-2', status === 'connecting' && 'animate-pulse')}>
          <span className={clsx('absolute inline-flex size-full rounded-full opacity-75', dotColor, status === 'connected' && 'animate-ping')}></span>
          <span className={clsx('relative inline-flex size-2 rounded-full', dotColor)}></span>
        </span>
        <Icon className={clsx('size-4', color, status === 'connecting' && 'animate-spin')} />
        {showLabel && <span className={clsx('text-xs font-medium', color)}>{label}</span>}
      </div>
    );
  }
);

ConnectionStatus.displayName = 'ConnectionStatus';

export { ConnectionStatus };
