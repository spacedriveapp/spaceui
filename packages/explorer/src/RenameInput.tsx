import { clsx } from 'clsx';
import { forwardRef, useState, useRef, useEffect } from 'react';
import { Check, X } from '@phosphor-icons/react';
import { Button } from '@spaceui/primitives';

interface RenameInputProps {
  initialValue: string;
  onRename: (newName: string) => void;
  onCancel: () => void;
  className?: string;
}

const RenameInput = forwardRef<HTMLFormElement, RenameInputProps>(
  ({ initialValue, onRename, onCancel, className }, ref) => {
    const [value, setValue] = useState(initialValue);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (value.trim() && value !== initialValue) {
        onRename(value.trim());
      } else {
        onCancel();
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    return (
      <form
        ref={ref}
        onSubmit={handleSubmit}
        className={clsx('flex items-center gap-1', className)}
      >
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-0 rounded-md border border-accent bg-app-box px-2 py-1 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
        <Button type="submit" size="icon" className="size-7 shrink-0">
          <Check className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7 shrink-0"
          onClick={onCancel}
        >
          <X className="size-4" />
        </Button>
      </form>
    );
  }
);

RenameInput.displayName = 'RenameInput';

export { RenameInput };
export type { RenameInputProps };
