import { clsx } from 'clsx';
import { File, Image, Video, FileAudio, FileArchive, FileCode, FileText, Question } from '@phosphor-icons/react';
import type { FileKind } from './types';

interface KindIconProps {
  kind: FileKind;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const kindIcons: Record<FileKind, React.ComponentType<{ className?: string }>> = {
  document: FileText,
  image: Image,
  video: Video,
  audio: FileAudio,
  archive: FileArchive,
  executable: File,
  code: FileCode,
  unknown: Question,
};

const kindColors: Record<FileKind, string> = {
  document: 'text-accent',
  image: 'text-status-warning',
  video: 'text-status-error',
  audio: 'text-accent',
  archive: 'text-ink-dull',
  executable: 'text-status-success',
  code: 'text-accent',
  unknown: 'text-ink-faint',
};

const sizeClasses = {
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-6',
};

const KindIcon = ({ kind, className, size = 'md' }: KindIconProps) => {
  const Icon = kindIcons[kind] || Question;

  return (
    <Icon
      className={clsx(sizeClasses[size], kindColors[kind], className)}
    />
  );
};

export { KindIcon };
export type { KindIconProps };
