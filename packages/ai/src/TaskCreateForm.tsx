import { Button, Select, SelectOption } from "@spacedrive/primitives";
import clsx from "clsx";
import { useCallback, useId, useState } from "react";

import type { TaskPriority } from "./types";
import { TASK_PRIORITY_LABEL } from "./types";

export interface TaskCreateFormData {
	title: string;
	description: string;
	priority: TaskPriority;
}

export interface TaskCreateFormProps {
	onSubmit: (data: TaskCreateFormData) => void;
	onCancel?: () => void;
	defaultPriority?: TaskPriority;
	isSubmitting?: boolean;
	className?: string;
}

const PRIORITIES: TaskPriority[] = ["critical", "high", "medium", "low"];

export function TaskCreateForm({
	onSubmit,
	onCancel,
	defaultPriority = "medium",
	isSubmitting,
	className,
}: TaskCreateFormProps) {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [priority, setPriority] = useState<TaskPriority>(defaultPriority);
	const titleInputId = useId();
	const descriptionInputId = useId();

	const canSubmit = title.trim().length > 0 && !isSubmitting;

	const handleSubmit = useCallback(() => {
		if (!canSubmit) return;
		onSubmit({ title: title.trim(), description: description.trim(), priority });
		setTitle("");
		setDescription("");
		setPriority(defaultPriority);
	}, [canSubmit, onSubmit, title, description, priority, defaultPriority]);

	return (
		<div className={clsx("flex flex-col gap-2", className)}>
			<div className="flex items-center gap-2">
				<label htmlFor={titleInputId} className="sr-only">
					Task Title
				</label>
				<input
					id={titleInputId}
					type="text"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") handleSubmit();
						if (e.key === "Escape") onCancel?.();
					}}
					placeholder="Task title..."
					className="min-w-0 flex-1 rounded-md bg-transparent px-2 py-1.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
					disabled={isSubmitting}
					autoFocus
				/>
				<Select
					value={priority}
					size="sm"
					onChange={(value) => setPriority(value as TaskPriority)}
					disabled={isSubmitting}
				>
					{PRIORITIES.map((p) => (
						<SelectOption key={p} value={p}>
							{TASK_PRIORITY_LABEL[p]}
						</SelectOption>
					))}
				</Select>
				<Button
					variant="accent"
					size="sm"
					disabled={!canSubmit}
					onClick={handleSubmit}
				>
					Create
				</Button>
			</div>
			<label htmlFor={descriptionInputId} className="sr-only">
				Description
			</label>
			<textarea
				id={descriptionInputId}
				value={description}
				onChange={(e) => setDescription(e.target.value)}
				placeholder="Description (optional)"
				rows={2}
				className="w-full resize-none rounded-md bg-transparent px-2 py-1.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
				disabled={isSubmitting}
			/>
		</div>
	);
}
