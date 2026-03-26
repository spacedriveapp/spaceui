import { clsx } from 'clsx';
import { forwardRef, Suspense } from 'react';
import { FileThumb } from './FileThumb';
import { Checkbox } from '@spaceui/primitives';
import type { FileInfo } from './types';

interface FileGridProps {
  files: FileInfo[];
  selectedIds: Set<string>;
  onFileClick: (file: FileInfo, event: React.MouseEvent) => void;
  onFileDoubleClick: (file: FileInfo) => void;
  className?: string;
}

const FileGridContent = forwardRef<HTMLDivElement, FileGridProps>(
  ({ files, selectedIds, onFileClick, onFileDoubleClick, className }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2',
          className
        )}
      >
        {files.map((file) => {
          const isSelected = selectedIds.has(file.id);

          return (
            <div
              key={file.id}
              onClick={(e) => onFileClick(file, e)}
              onDoubleClick={() => onFileDoubleClick(file)}
              className={clsx(
                'group relative flex flex-col items-center p-3 rounded-lg cursor-pointer',
                'hover:bg-app-hover',
                isSelected && 'bg-app-selected'
              )}
            >
              <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Checkbox checked={isSelected} />
              </div>

              <FileThumb file={file} size="lg" className="mb-2" />

              <p className="text-xs text-center text-ink line-clamp-2 break-all">
                {file.name}
              </p>
            </div>
          );
        })}
      </div>
    );
  }
);

FileGridContent.displayName = 'FileGridContent';

const FileGrid = forwardRef<HTMLDivElement, FileGridProps>((props, ref) => {
  return (
    <Suspense fallback={<div className="animate-pulse bg-app-box rounded-lg h-64" />}>
      <FileGridContent ref={ref} {...props} />
    </Suspense>
  );
});

FileGrid.displayName = 'FileGrid';

export { FileGrid };
export type { FileGridProps };
