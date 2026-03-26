import { clsx } from 'clsx';
import { forwardRef, useState } from 'react';
import { KindIcon } from './KindIcon';
import type { FileInfo } from './types';

interface FileThumbProps {
  file: FileInfo;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'size-8',
  md: 'size-12',
  lg: 'size-16',
};

const FileThumb = forwardRef<HTMLDivElement, FileThumbProps>(
  ({ file, size = 'md', className }, ref) => {
    const [imageError, setImageError] = useState(false);
    const isImage = file.kind === 'image';
    const showThumbnail = isImage && file.thumbnailUrl && !imageError;

    return (
      <div
        ref={ref}
        className={clsx(
          'relative flex items-center justify-center rounded-md overflow-hidden',
          sizeClasses[size],
          'bg-app-box',
          className
        )}
      >
        {showThumbnail ? (
          <img
            src={file.thumbnailUrl}
            alt={file.name}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : file.isDirectory ? (
          <div className="flex items-center justify-center h-full w-full">
            <KindIcon kind="unknown" size={size} className="text-accent" />
          </div>
        ) : (
          <KindIcon kind={file.kind} size={size} />
        )}
      </div>
    );
  }
);

FileThumb.displayName = 'FileThumb';

export { FileThumb };
export type { FileThumbProps };
