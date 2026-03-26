import { clsx } from 'clsx';
import { forwardRef } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@spaceui/primitives';
import { CaretDown } from '@phosphor-icons/react';

interface InspectorPanelProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

const InspectorPanel = forwardRef<HTMLDivElement, InspectorPanelProps>(
  ({ title, children, defaultOpen = true, className }, ref) => {
    return (
      <div ref={ref} className={clsx('border-b border-app-line last:border-b-0', className)}>
        <Collapsible defaultOpen={defaultOpen}>
          <CollapsibleTrigger className="flex w-full items-center justify-between p-3 text-sm font-medium text-ink hover:bg-app-hover">
            {title}
            <CaretDown className="size-4 text-ink-dull data-[state=closed]:rotate-[-90deg]" />
          </CollapsibleTrigger>
          <CollapsibleContent className="px-3 pb-3">
            {children}
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  }
);

InspectorPanel.displayName = 'InspectorPanel';

export { InspectorPanel };
export type { InspectorPanelProps };
