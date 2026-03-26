import { clsx } from 'clsx';
import { forwardRef } from 'react';
import { FileThumb } from './FileThumb';
import { Badge } from '@spaceui/primitives';
import type { FileInfo } from './types';

interface DragOverlayProps {
  files: FileInfo[];
  className?: string;
}

const DragOverlay = forwardRef<HTMLDivElement, DragOverlayProps>(
  ({ files, className }, ref) => {
    const count = files.length;
    const displayFiles = files.slice(0, 3);
    const remaining = Math.max(0, count - 3);

    return (
      <div
        ref={ref}
        className={clsx(
          'pointer-events-none flex items-center gap-2 rounded-lg',
          'border border-accent bg-app-box/90 p-2 shadow-xl backdrop-blur-sm',
          className
        )}
      >
        <div className="flex items-center -space-x-2">
          {displayFiles.map((file, index) => (
            <div
              key={file.id}
              className="relative"
              style={{ zIndex: displayFiles.length - index }}
            >
              <FileThumb
                file={file}
                size="sm"
                className="border-2 border-app-box shadow-sm"
              />
            </div>
          ))}
        </div>

        {remaining > 0 && (
          <Badge variant="default" className="ml-1">
            +{remaining}
          </Badge>
        )}

        <span className="text-sm font-medium text-ink">
          {count} {count === 1 ? 'item' : 'items'}
        </span>
      </div>
    );
  }
);

DragOverlay.displayName = 'DragOverlay';

export { DragOverlay };
export type { DragOverlayProps };
