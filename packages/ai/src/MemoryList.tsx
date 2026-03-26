import { clsx } from 'clsx';
import { forwardRef, useState } from 'react';
import { MagnifyingGlass, Funnel, Trash, Pencil } from '@phosphor-icons/react';
import { Card, CardContent, Badge, Button, Input } from '@spaceui/primitives';
import type { MemoryInfo } from './types';

interface MemoryListProps {
  memories: MemoryInfo[];
  onMemoryClick?: (memory: MemoryInfo) => void;
  onMemoryDelete?: (memory: MemoryInfo) => void;
  onMemoryEdit?: (memory: MemoryInfo) => void;
  className?: string;
}

const MemoryList = forwardRef<HTMLDivElement, MemoryListProps>(
  ({ memories, onMemoryClick, onMemoryDelete, onMemoryEdit, className }, ref) => {
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState<string | null>(null);

    const memoryTypes = Array.from(new Set(memories.map((m) => m.type)));

    const filteredMemories = memories.filter((memory) => {
      const matchesSearch = memory.content.toLowerCase().includes(search.toLowerCase());
      const matchesType = !typeFilter || memory.type === typeFilter;
      return matchesSearch && matchesType;
    });

    const typeColors: Record<string, string> = {
      conversation: 'bg-accent/10 text-accent',
      observation: 'bg-status-success/10 text-status-success',
      reflection: 'bg-status-warning/10 text-status-warning',
    };

    return (
      <div ref={ref} className={clsx('space-y-4', className)}>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <MagnifyingGlass className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-faint" />
            <Input
              placeholder="Search memories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant={typeFilter ? 'default' : 'outline'}
            size="icon"
            onClick={() => setTypeFilter(null)}
          >
            <Funnel className="size-4" />
          </Button>
        </div>

        {typeFilter && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-ink-dull">Filter:</span>
            <Badge>{typeFilter}</Badge>
            <button
              onClick={() => setTypeFilter(null)}
              className="text-xs text-accent hover:underline"
            >
              Clear
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-1">
          {memoryTypes.map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(typeFilter === type ? null : type)}
              className={clsx(
                'px-2 py-1 rounded-md text-xs capitalize',
                typeFilter === type
                  ? 'bg-accent text-white'
                  : 'bg-app-box text-ink-dull hover:text-ink'
              )}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {filteredMemories.map((memory) => (
            <Card
              key={memory.id}
              className="cursor-pointer hover:border-accent/30 transition-colors"
              onClick={() => onMemoryClick?.(memory)}
            >
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant="outline"
                        className={typeColors[memory.type] || 'bg-app-box text-ink-dull'}
                      >
                        {memory.type}
                      </Badge>
                      {memory.source && (
                        <span className="text-xs text-ink-faint">{memory.source}</span>
                      )}
                    </div>
                    <p className="text-sm text-ink line-clamp-3">{memory.content}</p>
                    {memory.edges && memory.edges.length > 0 && (
                      <p className="mt-1 text-xs text-ink-faint">
                        {memory.edges.length} connections
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {onMemoryEdit && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          onMemoryEdit(memory);
                        }}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                    )}
                    {onMemoryDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-status-error hover:text-status-error"
                        onClick={(e) => {
                          e.stopPropagation();
                          onMemoryDelete(memory);
                        }}
                      >
                        <Trash className="size-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMemories.length === 0 && (
          <div className="text-center py-8">
            <p className="text-ink-dull">No memories found</p>
          </div>
        )}
      </div>
    );
  }
);

MemoryList.displayName = 'MemoryList';

export { MemoryList };
export type { MemoryListProps };
