import { clsx } from 'clsx';
import { forwardRef, useState } from 'react';
import { CaretDown, CaretRight, Copy, X, Terminal } from '@phosphor-icons/react';
import { Card, CardContent, Badge, Button } from '@spaceui/primitives';
import { ToolCall } from './ToolCall';
import type { ToolCallPair, TranscriptStep, TaskInfo } from './types';
import { pairTranscriptSteps } from './types';

interface InlineWorkerCardProps {
  task: TaskInfo;
  transcript: TranscriptStep[];
  onCopyLogs?: () => void;
  onCancel?: () => void;
  className?: string;
}

const InlineWorkerCard = forwardRef<HTMLDivElement, InlineWorkerCardProps>(
  ({ task, transcript, onCopyLogs, onCancel, className }, ref) => {
    const [expanded, setExpanded] = useState(false);
    const [expandedTools, setExpandedTools] = useState<Set<string>>(new Set());

    const pairs = pairTranscriptSteps(transcript);
    const toolCallCount = transcript.filter(t => t.type === 'action').length;

    const toggleTool = (id: string) => {
      const newSet = new Set(expandedTools);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      setExpandedTools(newSet);
    };

    const statusColors: Record<string, string> = {
      pending: 'bg-accent/10 text-accent',
      running: 'bg-accent/10 text-accent',
      completed: 'bg-status-success/10 text-status-success',
      failed: 'bg-status-error/10 text-status-error',
    };

    return (
      <Card ref={ref} className={clsx('overflow-hidden', className)}>
        <CardContent className="p-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex w-full items-center justify-between text-left"
          >
            <div className="flex items-center gap-2">
              {expanded ? (
                <CaretDown className="size-4 text-ink-dull" />
              ) : (
                <CaretRight className="size-4 text-ink-dull" />
              )}
              <span className="font-medium text-ink">{task.title}</span>
              <Badge variant="outline" className={statusColors[task.status] || ''}>
                {task.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-ink-dull">
              <Terminal className="size-3.5" />
              <span>{toolCallCount} tool calls</span>
            </div>
          </button>

          {expanded && (
            <div className="mt-3 space-y-2 border-t border-app-line pt-3">
              {pairs.map(([action, result], _index) => {
                if (!action) return null;
                
                const toolCall: ToolCallPair = {
                  id: action.call_id,
                  name: action.name,
                  argsRaw: JSON.stringify(action.content),
                  args: action.content.reduce((acc, item) => ({ ...acc, [item.name]: item.args }), {}),
                  resultRaw: result?.text || null,
                  result: result ? { text: result.text } : null,
                  status: result ? (result.text.includes('error') ? 'error' : 'completed') : 'running',
                };

                return (
                  <ToolCall
                    key={action.call_id}
                    toolCall={toolCall}
                    expanded={expandedTools.has(action.call_id)}
                    onToggle={() => toggleTool(action.call_id)}
                  />
                );
              })}

              <div className="flex items-center justify-end gap-2 pt-2">
                {onCopyLogs && (
                  <Button variant="ghost" size="sm" onClick={onCopyLogs}>
                    <Copy className="mr-1 size-3.5" />
                    Copy logs
                  </Button>
                )}
                {onCancel && task.status === 'running' && (
                  <Button variant="ghost" size="sm" onClick={onCancel}>
                    <X className="mr-1 size-3.5" />
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
);

InlineWorkerCard.displayName = 'InlineWorkerCard';

export { InlineWorkerCard };
