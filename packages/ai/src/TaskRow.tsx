import { DotsThree } from "@phosphor-icons/react";
import { DropdownMenu } from "@spacedrive/primitives";
import clsx from "clsx";

import { TaskPriorityIcon } from "./TaskPriorityIcon";
import { TaskStatusIcon } from "./TaskStatusIcon";
import type { Task, TaskStatus } from "./types";
import { TASK_STATUS_LABEL, TASK_STATUS_ORDER } from "./types";

export interface TaskRowProps {
	task: Task;
	onClick?: (task: Task) => void;
	isActive?: boolean;
	resolveAgentName?: (agentId: string) => string;
	onStatusChange?: (task: Task, status: TaskStatus) => void;
	onDelete?: (task: Task) => void;
	className?: string;
}

export function TaskRow({
	task,
	onClick,
	isActive,
	resolveAgentName,
	onStatusChange,
	onDelete,
	className,
}: TaskRowProps) {
	const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
	const assigneeName = resolveAgentName?.(task.assigned_agent_id) ?? task.assigned_agent_id;
	const hasActions = onStatusChange || onDelete;
	const isRowInteractive = typeof onClick === "function";
	const handleRowKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.repeat) return;
		if (e.key === "Enter") {
			e.preventDefault();
			onClick?.(task);
		}
	};
	const handleRowKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.repeat) return;
		if (e.key === " ") {
			e.preventDefault();
			onClick?.(task);
		}
	};

	return (
		<div
			role={isRowInteractive ? "button" : undefined}
			tabIndex={isRowInteractive ? 0 : undefined}
			onClick={isRowInteractive ? () => onClick(task) : undefined}
			onKeyDown={isRowInteractive ? handleRowKeyDown : undefined}
			onKeyUp={isRowInteractive ? handleRowKeyUp : undefined}
			className={clsx(
				"task-row group grid w-full items-center border-b border-app-line/40 text-left transition-colors",
				"hover:bg-app-hover/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
				isActive
					? "bg-app-selected/50"
					: "bg-transparent",
				className,
			)}
			style={{
				gridTemplateColumns: "20px 18px 72px 1fr 56px 80px 28px",
				height: 36,
				paddingLeft: 12,
				paddingRight: 8,
				gap: 8,
			}}
		>
			<TaskStatusIcon status={task.status} />
			<TaskPriorityIcon priority={task.priority} />

			<span className="truncate font-mono text-xs text-ink-faint">
				SPC-{task.task_number}
			</span>

			<span className="min-w-0 truncate text-sm text-ink">
				{task.title}
			</span>

			<span className="text-right text-xs text-ink-faint">
				{task.subtasks.length > 0
					? `${completedSubtasks}/${task.subtasks.length}`
					: ""}
			</span>

			<span className="truncate text-right text-xs text-ink-dull">
				{assigneeName}
			</span>

			<span className="flex items-center justify-center">
				{hasActions ? (
					<DropdownMenu.Root>
						<DropdownMenu.Trigger asChild>
							<button
								type="button"
								aria-label="Task Actions"
								onClick={(e) => e.stopPropagation()}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") e.stopPropagation();
								}}
								className="flex size-5 items-center justify-center rounded opacity-0 transition-opacity hover:bg-app-hover group-hover:opacity-100"
							>
								<DotsThree size={16} weight="bold" className="text-ink-dull" />
							</button>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content align="end" sideOffset={4}>
							{onStatusChange &&
								TASK_STATUS_ORDER.filter((s) => s !== task.status).map((s) => (
									<DropdownMenu.Item
										key={s}
										onClick={(e: React.MouseEvent) => {
											e.stopPropagation();
											onStatusChange(task, s);
										}}
									>
										<TaskStatusIcon status={s} size={14} />
										<span className="ml-2">{TASK_STATUS_LABEL[s]}</span>
									</DropdownMenu.Item>
								))}
							{onStatusChange && onDelete && <DropdownMenu.Separator />}
							{onDelete && (
								<DropdownMenu.Item
									onClick={(e: React.MouseEvent) => {
										e.stopPropagation();
										onDelete(task);
									}}
									className="text-red-400"
								>
									Delete
								</DropdownMenu.Item>
							)}
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				) : null}
			</span>
		</div>
	);
}
