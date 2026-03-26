import { clsx } from 'clsx';
import { forwardRef } from 'react';
import { FileThumb } from './FileThumb';
import { KindIcon } from './KindIcon';
import type { FileInfo } from './types';

interface FileRowProps {
  file: FileInfo;
  selected?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
  className?: string;
}

const formatSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const FileRow = forwardRef<HTMLDivElement, FileRowProps>(
  ({ file, selected, onClick, onDoubleClick, className }, ref) => {
    return (
      <div
        ref={ref}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        className={clsx(
          'flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer',
          'hover:bg-app-hover',
          selected && 'bg-app-selected',
          className
        )}
      >
        <FileThumb file={file} size="sm" />
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-ink truncate">{file.name}</p>
          <p className="text-xs text-ink-faint">
            {file.isDirectory ? '--' : formatSize(file.size)}
          </p>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs text-ink-dull">
          <span className="w-20 text-right">{formatSize(file.size)}</span>
          <span className="w-32">{formatDate(file.modifiedAt)}</span>
          <span className="w-16 flex items-center justify-end gap-1">
            <KindIcon kind={file.kind} size="sm" />
            {file.extension || file.kind}
          </span>
        </div>
      </div>
    );
  }
);

FileRow.displayName = 'FileRow';

export { FileRow };
export type { FileRowProps };
