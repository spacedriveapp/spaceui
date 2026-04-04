import { Input } from "@spacedrive/primitives";
import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";

export interface RenameInputProps {
	/** Current name (without extension) */
	name: string;
	/** File extension (e.g. "txt"). If provided, shown as read-only suffix */
	extension?: string;
	/** Called with the full new name (including extension) on save */
	onSave: (newName: string) => Promise<void>;
	/** Called when rename is cancelled (Escape or blur) */
	onCancel: () => void;
	className?: string;
}

/**
 * Inline name editing component.
 *
 * - Auto-focuses and selects text on mount
 * - Only edits the name portion (extension shown as read-only)
 * - Enter saves, Escape cancels, blur cancels (macOS Finder behavior)
 */
export function RenameInput({
	name,
	extension,
	onSave,
	onCancel,
	className,
}: RenameInputProps) {
	const hasExtension = extension && extension.length > 0;

	const [value, setValue] = useState(name);
	const [isSaving, setIsSaving] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
		}
	}, []);

	const handleSave = useCallback(async () => {
		if (isSaving) return;

		const trimmedValue = value.trim();

		if (!trimmedValue) {
			onCancel();
			return;
		}

		const fullNewName = hasExtension
			? `${trimmedValue}.${extension}`
			: trimmedValue;
		const currentFullName = hasExtension
			? `${name}.${extension}`
			: name;

		if (fullNewName === currentFullName) {
			onCancel();
			return;
		}

		setIsSaving(true);
		try {
			await onSave(fullNewName);
		} catch {
			setIsSaving(false);
		}
	}, [value, isSaving, hasExtension, extension, name, onSave, onCancel]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Enter") {
				e.preventDefault();
				e.stopPropagation();
				handleSave();
			} else if (e.key === "Escape") {
				e.preventDefault();
				e.stopPropagation();
				onCancel();
			}
		},
		[handleSave, onCancel],
	);

	const handleBlur = useCallback(() => {
		if (!isSaving) {
			onCancel();
		}
	}, [isSaving, onCancel]);

	return (
		<div className={clsx("inline-flex items-center", className)}>
			<Input
				ref={inputRef}
				value={value}
				onChange={(e) => setValue(e.target.value)}
				onKeyDown={handleKeyDown}
				onBlur={handleBlur}
				variant="transparent"
				size="xs"
				disabled={isSaving}
				className={clsx(
					"min-w-[60px] !h-auto !py-0.5 !px-1 text-center",
					isSaving && "opacity-50",
				)}
				inputElementClassName="text-center"
			/>
			{hasExtension && (
				<span className="text-sm text-ink-dull">.{extension}</span>
			)}
		</div>
	);
}
