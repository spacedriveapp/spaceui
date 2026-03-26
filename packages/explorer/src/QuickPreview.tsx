import { clsx } from 'clsx';
import { forwardRef, useCallback, useEffect, useState, Suspense } from 'react';
import { X, ArrowsOut, ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import { Button, Dialog, DialogContent, DialogTitle } from '@spaceui/primitives';
import type { FileInfo } from './types';

interface QuickPreviewProps {
  file: FileInfo;
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  className?: string;
}

const QuickPreview = forwardRef<HTMLDivElement, QuickPreviewProps>(
  ({ file, isOpen, onClose, onNext, onPrevious, className }, ref) => {
    const [scale, setScale] = useState(1);

    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
        if (e.key === 'ArrowRight' && onNext) onNext();
        if (e.key === 'ArrowLeft' && onPrevious) onPrevious();
      },
      [onClose, onNext, onPrevious]
    );

    useEffect(() => {
      if (isOpen) {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
      }
    }, [isOpen, handleKeyDown]);

    const renderPreview = () => {
      switch (file.kind) {
        case 'image':
          return (
            <div className="relative flex items-center justify-center h-full">
              {file.thumbnailUrl ? (
                <img
                  src={file.thumbnailUrl}
                  alt={file.name}
                  className="max-h-full max-w-full object-contain"
                  style={{ transform: `scale(${scale})` }}
                />
              ) : (
                <div className="text-ink-dull">No preview available</div>
              )}
            </div>
          );

        case 'video':
          return (
            <div className="flex items-center justify-center h-full">
              <video
                src={file.thumbnailUrl}
                controls
                className="max-h-full max-w-full"
              />
            </div>
          );

        case 'audio':
          return (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="text-6xl">🎵</div>
              <audio src={file.thumbnailUrl} controls className="w-full max-w-md" />
            </div>
          );

        default:
          return (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="text-6xl">📄</div>
              <p className="text-ink-dull">Preview not available for this file type</p>
            </div>
          );
      }
    };

    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] w-full h-full p-0 overflow-hidden bg-app/95">
          <div ref={ref} className={clsx('flex flex-col h-full', className)}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-app-line">
              <DialogTitle className="text-base">{file.name}</DialogTitle>
              <div className="flex items-center gap-2">
                {onPrevious && (
                  <Button variant="ghost" size="icon" onClick={onPrevious}>
                    <ArrowLeft className="size-4" />
                  </Button>
                )}
                {onNext && (
                  <Button variant="ghost" size="icon" onClick={onNext}>
                    <ArrowRight className="size-4" />
                  </Button>
                )}
                {file.kind === 'image' && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setScale((s) => Math.min(s + 0.5, 3))}
                  >
                    <ArrowsOut className="size-4" />
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="size-4" />
                </Button>
              </div>
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-auto p-4">
              <Suspense fallback={<div className="animate-pulse bg-app-box h-full rounded-lg" />}>
                {renderPreview()}
              </Suspense>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);

QuickPreview.displayName = 'QuickPreview';

export { QuickPreview };
export type { QuickPreviewProps };
