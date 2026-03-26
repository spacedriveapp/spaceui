import { clsx } from 'clsx';
import { forwardRef, useState } from 'react';
import { Plus, Play, Pause, Trash, Clock, CheckCircle, ClockCounterClockwise } from '@phosphor-icons/react';
import { Card, CardContent, Button, Badge, Switch } from '@spaceui/primitives';
import type { CronJobInfo } from './types';

interface CronJobListProps {
  jobs: CronJobInfo[];
  onCreateJob?: () => void;
  onToggleJob?: (jobId: string, enabled: boolean) => void;
  onDeleteJob?: (jobId: string) => void;
  onRunJob?: (jobId: string) => void;
  className?: string;
}

const CronJobList = forwardRef<HTMLDivElement, CronJobListProps>(
  ({ jobs, onCreateJob, onToggleJob, onDeleteJob, onRunJob, className }, ref) => {
    const [expandedJob, setExpandedJob] = useState<string | null>(null);

    const statusIcons: Record<string, React.ComponentType<{ className?: string }>> = {
      active: Play,
      paused: Pause,
      completed: CheckCircle,
    };

    const statusColors: Record<string, string> = {
      active: 'bg-status-success/10 text-status-success',
      paused: 'bg-status-warning/10 text-status-warning',
      completed: 'bg-accent/10 text-accent',
    };

    return (
      <div ref={ref} className={clsx('space-y-4', className)}>
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-ink">Cron Jobs</h3>
          {onCreateJob && (
            <Button onClick={onCreateJob} size="sm">
              <Plus className="mr-1 size-4" />
              New Job
            </Button>
          )}
        </div>

        <div className="space-y-2">
          {jobs.map((job) => {
            const StatusIcon = statusIcons[job.status] || Play;
            const isExpanded = expandedJob === job.id;

            return (
              <Card
                key={job.id}
                className={clsx(
                  'transition-colors',
                  isExpanded && 'border-accent/30'
                )}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <StatusIcon
                        className={clsx(
                          'size-5',
                          job.status === 'active' ? 'text-status-success' : 'text-ink-dull'
                        )}
                      />
                      <div>
                        <p className="font-medium text-ink">{job.name}</p>
                        <p className="text-xs text-ink-faint font-mono">{job.schedule}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={statusColors[job.status] || ''}>
                        {job.status}
                      </Badge>

                      {onToggleJob && (
                        <Switch
                          checked={job.status === 'active'}
                          onCheckedChange={(checked) => onToggleJob(job.id, checked)}
                        />
                      )}

                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => setExpandedJob(isExpanded ? null : job.id)}
                      >
                         <ClockCounterClockwise className="size-4" />
                      </Button>

                      {onRunJob && job.status === 'active' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          onClick={() => onRunJob(job.id)}
                        >
                          <Play className="size-4" />
                        </Button>
                      )}

                      {onDeleteJob && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 text-status-error hover:text-status-error"
                          onClick={() => onDeleteJob(job.id)}
                        >
                          <Trash className="size-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-app-line space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="size-4 text-ink-dull" />
                        <span className="text-ink-dull">Last run:</span>
                        <span className="text-ink">
                          {job.last_run ? new Date(job.last_run).toLocaleString() : 'Never'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="size-4 text-ink-dull" />
                        <span className="text-ink-dull">Next run:</span>
                        <span className="text-ink">
                          {job.next_run ? new Date(job.next_run).toLocaleString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {jobs.length === 0 && (
          <div className="text-center py-8 rounded-lg border border-dashed border-app-line">
            <p className="text-ink-dull">No cron jobs configured</p>
            {onCreateJob && (
              <Button onClick={onCreateJob} variant="outline" className="mt-2">
                <Plus className="mr-1 size-4" />
                Create your first job
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }
);

CronJobList.displayName = 'CronJobList';

export { CronJobList };
export type { CronJobListProps };
