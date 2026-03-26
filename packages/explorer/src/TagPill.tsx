import { clsx } from 'clsx';
import { forwardRef } from 'react';
import { X } from '@phosphor-icons/react';
import type { TagInfo } from './types';

interface TagPillProps {
  tag: TagInfo;
  onRemove?: () => void;
  className?: string;
}

const TagPill = forwardRef<HTMLSpanElement, TagPillProps>(
  ({ tag, onRemove, className }, ref) => {
    return (
      <span
        ref={ref}
        className={clsx(
          'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
          'bg-app-box border border-app-line',
          className
        )}
        style={{ borderColor: tag.color, color: tag.color }}
      >
        {tag.name}
        {onRemove && (
          <button
            onClick={onRemove}
            className="ml-1 rounded-full hover:bg-app-hover p-0.5"
          >
            <X className="size-3" />
          </button>
        )}
      </span>
    );
  }
);

TagPill.displayName = 'TagPill';

export { TagPill };
export type { TagPillProps };
