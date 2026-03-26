import { clsx } from 'clsx';
import { forwardRef } from 'react';
import { ProfileAvatar } from './ProfileAvatar';
import { Badge } from '@spaceui/primitives';
import type { TaskInfo } from './types';

interface TaskCardProps {
  task: TaskInfo;
  onClick?: () => void;
  className?: string;
}

const TaskCard = forwardRef<HTMLDivElement, TaskCardProps>(
  ({ task, onClick, className }, ref) => {
    const priorityColors: Record<string, string> = {
      low: 'bg-accent/10 text-accent',
      medium: 'bg-status-warning/10 text-status-warning',
      high: 'bg-status-error/10 text-status-error',
    };

    const statusColors: Record<string, string> = {
      pending_approval: 'bg-ink-faint/10 text-ink-faint',
      backlog: 'bg-ink-faint/10 text-ink-faint',
      ready: 'bg-accent/10 text-accent',
      in_progress: 'bg-status-warning/10 text-status-warning',
      done: 'bg-status-success/10 text-status-success',
    };

    return (
      <div
        ref={ref}
        onClick={onClick}
        className={clsx(
          'rounded-lg border border-app-line bg-app p-3',
          'hover:border-accent/50 cursor-pointer transition-colors',
          className
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <Badge variant="outline" className={priorityColors[task.priority] || ''}>
            {task.priority}
          </Badge>
          <Badge variant="outline" className={statusColors[task.status] || ''}>
            {task.status.replace('_', ' ')}
          </Badge>
        </div>

        <h4 className="mt-2 font-medium text-ink">{task.title}</h4>

        {task.assignees.length > 0 && (
          <div className="mt-3 flex items-center -space-x-1">
            {task.assignees.map((assignee: string, i: number) => (
              <ProfileAvatar
                key={i}
                name={assignee}
                seed={assignee}
                size="sm"
                className="border-2 border-app"
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);

TaskCard.displayName = 'TaskCard';

export { TaskCard };
export type { TaskCardProps };
