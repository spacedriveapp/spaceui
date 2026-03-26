import { clsx } from 'clsx';
import { forwardRef, useState, useCallback, useEffect } from 'react';

interface ResizablePanelGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'horizontal' | 'vertical';
}

const ResizablePanelGroup = forwardRef<HTMLDivElement, ResizablePanelGroupProps>(
  ({ direction = 'horizontal', className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'flex',
          direction === 'horizontal' ? 'flex-row' : 'flex-col',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ResizablePanelGroup.displayName = 'ResizablePanelGroup';

interface ResizablePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  resizable?: boolean;
  onResize?: (size: number) => void;
}

const ResizablePanel = forwardRef<HTMLDivElement, ResizablePanelProps>(
  ({ defaultSize = 50, minSize = 10, maxSize = 90, resizable = true, onResize, className, children, ...props }, ref) => {
    const [size, setSize] = useState(defaultSize);
    const [isDragging, setIsDragging] = useState(false);

    const handleMouseDown = useCallback(() => {
      if (!resizable) return;
      setIsDragging(true);
    }, [resizable]);

    useEffect(() => {
      if (!isDragging) return;

      const handleMouseMove = (e: MouseEvent) => {
        const parent = (e.target as HTMLElement).closest('[data-resizable-group]') as HTMLElement | null;
        if (!parent) return;
        
        const rect = parent.getBoundingClientRect();
        const isHorizontal = parent.classList.contains('flex-row');
        
        let newSize: number;
        if (isHorizontal) {
          newSize = ((e.clientX - rect.left) / rect.width) * 100;
        } else {
          newSize = ((e.clientY - rect.top) / rect.height) * 100;
        }
        
        newSize = Math.max(minSize, Math.min(maxSize, newSize));
        setSize(newSize);
        onResize?.(newSize);
      };

      const handleMouseUp = () => {
        setIsDragging(false);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }, [isDragging, minSize, maxSize, onResize]);

    return (
      <div
        ref={ref}
        data-resizable-panel
        className={clsx('relative flex', className)}
        style={{ flex: `0 0 ${size}%` }}
        {...props}
      >
        {children}
        {resizable && (
          <div
            className={clsx(
              'absolute z-10 bg-accent/0 hover:bg-accent/50 transition-colors',
              'right-0 top-0 bottom-0 w-1 cursor-col-resize',
              isDragging && 'bg-accent'
            )}
            onMouseDown={handleMouseDown}
          />
        )}
      </div>
    );
  }
);

ResizablePanel.displayName = 'ResizablePanel';

export { ResizablePanelGroup, ResizablePanel };
