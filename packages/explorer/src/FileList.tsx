import { clsx } from 'clsx';
import { forwardRef, Suspense } from 'react';
import { FileRow } from './FileRow';
import type { FileInfo, SortField, SortDirection } from './types';

interface FileListProps {
  files: FileInfo[];
  selectedIds: Set<string>;
  onFileClick: (file: FileInfo, event: React.MouseEvent) => void;
  onFileDoubleClick: (file: FileInfo) => void;
  sort?: { field: SortField; direction: SortDirection };
  onSort?: (field: SortField) => void;
  className?: string;
}

const FileListContent = forwardRef<HTMLDivElement, FileListProps>(
  ({ files, selectedIds, onFileClick, onFileDoubleClick, sort, onSort, className }, ref) => {
    const headers: { field: SortField; label: string; className?: string }[] = [
      { field: 'name', label: 'Name' },
      { field: 'size', label: 'Size', className: 'hidden md:block w-20 text-right' },
      { field: 'modifiedAt', label: 'Modified', className: 'hidden md:block w-32' },
      { field: 'kind', label: 'Kind', className: 'hidden md:block w-16 text-right' },
    ];

    return (
      <div ref={ref} className={clsx('w-full', className)}>
        <div className="flex items-center gap-3 px-3 py-2 border-b border-app-line text-xs font-medium text-ink-dull uppercase">
          {headers.map((header) => (
            <button
              key={header.field}
              onClick={() => onSort?.(header.field)}
              className={clsx(
                'flex items-center gap-1 hover:text-ink transition-colors',
                header.className,
                header.field === 'name' && 'flex-1 text-left'
              )}
            >
              {header.label}
              {sort?.field === header.field && (
                <span className="text-accent">
                  {sort.direction === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="divide-y divide-app-line/50">
          {files.map((file) => (
            <FileRow
              key={file.id}
              file={file}
              selected={selectedIds.has(file.id)}
              onClick={() => onFileClick(file, {} as unknown as React.MouseEvent)}
              onDoubleClick={() => onFileDoubleClick(file)}
            />
          ))}
        </div>
      </div>
    );
  }
);

FileListContent.displayName = 'FileListContent';

const FileList = forwardRef<HTMLDivElement, FileListProps>((props, ref) => {
  return (
    <Suspense fallback={<div className="animate-pulse bg-app-box rounded-lg h-64" />}>
      <FileListContent ref={ref} {...props} />
    </Suspense>
  );
});

FileList.displayName = 'FileList';

export { FileList };
export type { FileListProps };
