import { clsx } from 'clsx';
import { forwardRef, Suspense } from 'react';
import type { MemoryInfo } from './types';

interface MemoryGraphProps {
  memories: MemoryInfo[];
  onNodeClick?: (memory: MemoryInfo) => void;
  className?: string;
}

// Lazy loaded component for Sigma.js integration
const MemoryGraphContent = forwardRef<HTMLDivElement, MemoryGraphProps>(
  ({ memories, onNodeClick: _onNodeClick, className }, ref) => {
    // Placeholder for Sigma.js graph visualization
    // This would be implemented with @react-sigma/core in a real app
    return (
      <div
        ref={ref}
        className={clsx(
          'rounded-lg border border-app-line bg-app-box',
          'flex items-center justify-center',
          className
        )}
      >
        <div className="text-center">
          <p className="text-ink-dull">Graph visualization</p>
          <p className="text-xs text-ink-faint mt-1">
            {memories.length} memories loaded
          </p>
        </div>
      </div>
    );
  }
);

MemoryGraphContent.displayName = 'MemoryGraphContent';

const MemoryGraph = forwardRef<HTMLDivElement, MemoryGraphProps>((props, ref) => {
  return (
    <Suspense fallback={<div className="animate-pulse bg-app-box rounded-lg h-64" />}>
      <MemoryGraphContent ref={ref} {...props} />
    </Suspense>
  );
});

MemoryGraph.displayName = 'MemoryGraph';

export { MemoryGraph };
export type { MemoryGraphProps };
