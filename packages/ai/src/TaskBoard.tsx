import { clsx } from 'clsx';
import { forwardRef } from 'react';
import type { TaskInfo } from './types';

interface TaskBoardProps {
  tasks: TaskInfo[];
  onTaskMove?: (taskId: string, newStatus: string) => void;
  onTaskClick?: (task: TaskInfo) => void;
  className?: string;
}

const TaskBoard = forwardRef<HTMLDivElement, TaskBoardProps>(
  ({ tasks, onTaskMove: _onTaskMove, onTaskClick, className }, ref) => {
    const columns = ['pending_approval', 'backlog', 'ready', 'in_progress', 'done'];

    const tasksByStatus = columns.reduce((acc, status) => {
      acc[status] = tasks.filter((t) => t.status === status);
      return acc;
    }, {} as Record<string, TaskInfo[]>);

    return (
      <div
        ref={ref}
        className={clsx('flex gap-4 overflow-x-auto pb-4', className)}
      >
        {columns.map((status) => (
          <div
            key={status}
            className="flex-shrink-0 w-72 rounded-lg border border-app-line bg-app-box"
          >
            <div className="p-3 border-b border-app-line">
              <h3 className="font-medium text-ink capitalize">
                {status.replace('_', ' ')}
              </h3>
              <span className="text-xs text-ink-faint">
                {tasksByStatus[status]?.length || 0} tasks
              </span>
            </div>
            <div className="p-2 space-y-2">
              {tasksByStatus[status]?.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onTaskClick?.(task)}
                  className="p-3 rounded-md bg-app hover:bg-app-hover cursor-pointer"
                >
                  <p className="font-medium text-sm text-ink">{task.title}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs text-ink-faint capitalize">
                      {task.priority} priority
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
);

TaskBoard.displayName = 'TaskBoard';

export { TaskBoard };
export type { TaskBoardProps };
