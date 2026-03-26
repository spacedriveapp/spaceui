import { clsx } from 'clsx';
import { forwardRef } from 'react';
import { TagPill } from './TagPill';
import { Card, CardContent, CardHeader, CardTitle, Divider } from '@spaceui/primitives';
import type { FileInfo, TagInfo } from './types';

interface InspectorProps {
  file: FileInfo;
  tags?: TagInfo[];
  onTagRemove?: (tagId: string) => void;
  onTagAdd?: (tagId: string) => void;
  className?: string;
}

const Inspector = forwardRef<HTMLDivElement, InspectorProps>(
  ({ file, tags = [], onTagRemove, onTagAdd: _onTagAdd, className }, ref) => {
    const formatSize = (bytes: number): string => {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (date: Date): string => {
      return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date);
    };

    const metadataItems = [
      { label: 'Name', value: file.name },
      { label: 'Kind', value: file.kind },
      { label: 'Size', value: file.isDirectory ? '--' : formatSize(file.size) },
      { label: 'Created', value: formatDate(file.createdAt) },
      { label: 'Modified', value: formatDate(file.modifiedAt) },
      { label: 'Path', value: file.path },
    ];

    if (file.metadata) {
      Object.entries(file.metadata).forEach(([key, value]) => {
        if (typeof value === 'string' || typeof value === 'number') {
          metadataItems.push({ label: key, value: String(value) });
        }
      });
    }

    return (
      <Card ref={ref} className={clsx('h-full', className)}>
        <CardHeader>
          <CardTitle className="text-base">{file.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <TagPill
                  key={tag.id}
                  tag={tag}
                  onRemove={onTagRemove ? () => onTagRemove(tag.id) : undefined}
                />
              ))}
            </div>
          )}

          <Divider />

          <dl className="space-y-2">
            {metadataItems.map((item) => (
              <div key={item.label} className="flex flex-col">
                <dt className="text-xs text-ink-faint">{item.label}</dt>
                <dd className="text-sm text-ink break-all">{item.value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    );
  }
);

Inspector.displayName = 'Inspector';

export { Inspector };
export type { InspectorProps };
