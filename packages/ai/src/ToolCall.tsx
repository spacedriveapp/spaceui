import { clsx } from 'clsx';
import { forwardRef } from 'react';
import { Terminal, CheckCircle, XCircle, Spinner } from '@phosphor-icons/react';
import type { ToolCallPair, ToolCallStatus } from './types';

interface ToolCallProps {
  toolCall: ToolCallPair;
  expanded?: boolean;
  onToggle?: () => void;
  className?: string;
}

const statusIcons: Record<ToolCallStatus, React.ComponentType<{ className?: string }>> = {
  running: Spinner,
  completed: CheckCircle,
  error: XCircle,
};

const statusColors: Record<ToolCallStatus, string> = {
  running: 'text-accent',
  completed: 'text-status-success',
  error: 'text-status-error',
};

const ToolCall = forwardRef<HTMLDivElement, ToolCallProps>(
  ({ toolCall, expanded = false, onToggle, className }, ref) => {
    const StatusIcon = statusIcons[toolCall.status];
    const statusColor = statusColors[toolCall.status];

    const formatArgs = (args: Record<string, unknown> | null): string => {
      if (!args) return '';
      return JSON.stringify(args, null, 2);
    };

    const formatResult = (result: Record<string, unknown> | null): string => {
      if (!result) return '';
      return JSON.stringify(result, null, 2);
    };

    return (
      <div
        ref={ref}
        className={clsx(
          'rounded-lg border border-app-line bg-app-box overflow-hidden',
          className
        )}
      >
        <button
          onClick={onToggle}
          className="flex w-full items-center justify-between p-3 text-left hover:bg-app-hover"
        >
          <div className="flex items-center gap-2">
            <StatusIcon className={clsx('size-4', statusColor)} />
            <span className="font-mono text-sm font-medium text-ink">
              {toolCall.name}
            </span>
          </div>
          <span className="text-xs text-ink-faint">{toolCall.status}</span>
        </button>
        
        {expanded && (
          <div className="border-t border-app-line p-3 space-y-3">
            {toolCall.args && (
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Terminal className="size-3.5 text-ink-dull" />
                  <span className="text-xs font-medium text-ink-dull">Arguments</span>
                </div>
                <pre className="rounded-md bg-app p-2 text-xs font-mono text-ink overflow-x-auto">
                  {formatArgs(toolCall.args)}
                </pre>
              </div>
            )}
            
            {toolCall.result && toolCall.status === 'completed' && (
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <CheckCircle className="size-3.5 text-status-success" />
                  <span className="text-xs font-medium text-ink-dull">Result</span>
                </div>
                <pre className="rounded-md bg-app p-2 text-xs font-mono text-ink overflow-x-auto">
                  {formatResult(toolCall.result)}
                </pre>
              </div>
            )}
            
            {toolCall.status === 'error' && (
              <div className="rounded-md bg-status-error/10 p-2 text-xs text-status-error">
                {toolCall.resultRaw || 'An error occurred'}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

ToolCall.displayName = 'ToolCall';

export { ToolCall };
