import { clsx } from 'clsx';
import { forwardRef, useState } from 'react';
import { Check, MagnifyingGlass, Brain, Wrench } from '@phosphor-icons/react';
import { Popover, PopoverContent, PopoverTrigger, Button, Badge } from '@spaceui/primitives';
import type { ModelOption } from './types';

interface ModelSelectProps {
  models: ModelOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const ModelSelect = forwardRef<HTMLButtonElement, ModelSelectProps>(
  ({ models, value, onChange, placeholder = 'Select model...', disabled, className }, ref) => {
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);

    const selectedModel = models.find((m) => m.id === value);

    const groupedModels = models.reduce((acc, model) => {
      if (!acc[model.provider]) {
        acc[model.provider] = [];
      }
      acc[model.provider].push(model);
      return acc;
    }, {} as Record<string, ModelOption[]>);

    const filteredModels = Object.entries(groupedModels).reduce((acc, [provider, providerModels]) => {
      const filtered = providerModels.filter(
        (m) =>
          m.name.toLowerCase().includes(search.toLowerCase()) ||
          m.provider.toLowerCase().includes(search.toLowerCase())
      );
      if (filtered.length > 0) {
        acc[provider] = filtered;
      }
      return acc;
    }, {} as Record<string, ModelOption[]>);

    const handleSelect = (modelId: string) => {
      onChange(modelId);
      setOpen(false);
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={clsx('w-full justify-between', className)}
            disabled={disabled}
          >
            {selectedModel ? (
              <span className="flex items-center gap-2">
                <span className="truncate">{selectedModel.name}</span>
                {selectedModel.capabilities?.includes('reasoning') && (
                  <Brain className="size-3 text-accent" />
                )}
                {selectedModel.capabilities?.includes('tools') && (
                  <Wrench className="size-3 text-accent" />
                )}
              </span>
            ) : (
              <span className="text-ink-faint">{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <div className="flex items-center border-b border-menu-line px-3 py-2">
            <MagnifyingGlass className="mr-2 size-4 text-ink-faint" />
            <input
              placeholder="Search models..."
              className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="max-h-[300px] overflow-auto py-1">
            {Object.entries(filteredModels).map(([provider, providerModels]) => (
              <div key={provider}>
                <div className="px-3 py-1.5 text-xs font-semibold text-ink-dull">
                  {provider}
                </div>
                {providerModels.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => handleSelect(model.id)}
                    className={clsx(
                      'flex w-full items-center justify-between px-3 py-2 text-sm',
                      'hover:bg-menu-hover',
                      value === model.id && 'bg-menu-hover'
                    )}
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-ink">{model.name}</span>
                      {model.context_window && (
                        <span className="text-xs text-ink-faint">
                          {model.context_window.toLocaleString()} tokens
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {model.capabilities?.includes('reasoning') && (
                        <Badge variant="outline" className="text-[10px] px-1 py-0">
                          <Brain className="size-3 mr-1" />
                          Reasoning
                        </Badge>
                      )}
                      {model.capabilities?.includes('tools') && (
                        <Badge variant="outline" className="text-[10px] px-1 py-0">
                          <Wrench className="size-3 mr-1" />
                          Tools
                        </Badge>
                      )}
                      {value === model.id && <Check className="ml-2 size-4 text-accent" />}
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);

ModelSelect.displayName = 'ModelSelect';

export { ModelSelect };
