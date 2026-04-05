import { Check, X } from "@phosphor-icons/react";
import { Button, Select, SelectOption } from "@spacedrive/primitives";
import clsx from "clsx";

import { Markdown } from "./Markdown";
import { TaskPriorityIcon } from "./TaskPriorityIcon";
import { TaskStatusIcon } from "./TaskStatusIcon";
import type { Task, TaskStatus } from "./types";
import { TASK_PRIORITY_LABEL, TASK_STATUS_LABEL, TASK_STATUS_ORDER } from "./types";

export interface TaskDetailProps {
	task: Task;
	resolveAgentName?: (agentId: string) => string;
	onStatusChange?: (task: Task, status: TaskStatus) => void;
	onSubtaskToggle?: (task: Task, index: number, completed: boolean) => void;
	onDelete?: (task: Task) => void;
	onClose?: () => void;
	className?: string;
}

function formatDate(iso: string) {
	return new Date(iso).toLocaleDateString(undefined, {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

export function TaskDetail({
	task,
	resolveAgentName,
	onStatusChange,
	onSubtaskToggle,
	onDelete,
	onClose,
	className,
}: TaskDetailProps) {
	const ownerName = resolveAgentName?.(task.owner_agent_id) ?? task.owner_agent_id;
	const assigneeName = resolveAgentName?.(task.assigned_agent_id) ?? task.assigned_agent_id;

	return (
		<div className={clsx("flex flex-col gap-5 p-4", className)}>
			{/* Header */}
			<div className="flex items-start gap-3">
				<div className="flex flex-1 items-center gap-2">
					<TaskStatusIcon status={task.status} />
					<TaskPriorityIcon priority={task.priority} />
					<span className="font-mono text-xs text-ink-faint">SPC-{task.task_number}</span>
				</div>
				{onClose && (
					<button
						type="button"
						onClick={onClose}
						className="shrink-0 rounded p-1 text-ink-dull hover:bg-app-hover hover:text-ink"
					>
						<X size={16} />
					</button>
				)}
			</div>
			<h2 className="text-lg font-medium text-ink">{task.title}</h2>

			{/* Properties */}
			<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
				{onStatusChange ? (
					<label className="flex items-center gap-2 text-ink-dull">
						Status
						<Select
							value={task.status}
							size="sm"
							onChange={(value) => onStatusChange(task, value as TaskStatus)}
						>
							{TASK_STATUS_ORDER.map((s) => (
								<SelectOption key={s} value={s}>
									{TASK_STATUS_LABEL[s]}
								</SelectOption>
							))}
						</Select>
					</label>
				) : (
					<span className="text-ink-dull">
						Status: <span className="text-ink">{TASK_STATUS_LABEL[task.status]}</span>
					</span>
				)}
				<span className="text-ink-dull">
					Priority:{" "}
					<span className="text-ink">{TASK_PRIORITY_LABEL[task.priority]}</span>
				</span>
				<span className="text-ink-dull">
					Owner: <span className="text-ink">{ownerName}</span>
				</span>
				<span className="text-ink-dull">
					Assigned: <span className="text-ink">{assigneeName}</span>
				</span>
			</div>

			{/* Subtasks */}
			{task.subtasks.length > 0 && (
				<div className="flex flex-col gap-1">
					<div className="mb-1 flex items-center justify-between">
						<h3 className="text-xs font-medium uppercase tracking-wide text-ink-dull">
							Subtasks
						</h3>
						<span className="text-xs text-ink-faint">
							{task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length}
						</span>
					</div>
					<div className="overflow-hidden rounded-md border border-app-line/60">
						{task.subtasks.map((subtask, i) => (
							<button
								key={i}
								type="button"
								onClick={() => onSubtaskToggle?.(task, i, !subtask.completed)}
								className={clsx(
									"flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors hover:bg-app-hover/50",
									i > 0 && "border-t border-app-line/40",
								)}
							>
								<span
									className={clsx(
										"flex size-4 shrink-0 items-center justify-center rounded border transition-colors",
										subtask.completed
											? "border-accent bg-accent"
											: "border-app-line bg-app-box",
									)}
								>
									{subtask.completed && (
										<Check size={10} weight="bold" className="text-white" />
									)}
								</span>
								<span
									className={clsx(
										"min-w-0 flex-1",
										subtask.completed
											? "text-ink-faint line-through"
											: "text-ink",
									)}
								>
									{subtask.title}
								</span>
							</button>
						))}
					</div>
				</div>
			)}

			{/* Description */}
			<div>
				{task.description ? (
					<Markdown content={task.description} className="prose-sm prose-p:my-1 prose-headings:text-sm prose-headings:mt-3 prose-headings:mb-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0" />
				) : (
					<p className="text-sm italic text-ink-faint">No description</p>
				)}
			</div>

			{/* Timestamps */}
			<div className="flex flex-col gap-1 text-xs text-ink-faint">
				<span>Created {formatDate(task.created_at)}</span>
				<span>Updated {formatDate(task.updated_at)}</span>
				{task.completed_at && <span>Completed {formatDate(task.completed_at)}</span>}
			</div>

			{/* Actions */}
			{(onStatusChange || onDelete) && (
				<div className="flex flex-wrap gap-2">
					{onStatusChange && task.status === "pending_approval" && (
						<Button
							variant="accent"
							size="sm"
							onClick={() => onStatusChange(task, "ready")}
						>
							Approve
						</Button>
					)}
					{onStatusChange && task.status === "backlog" && (
						<Button
							variant="accent"
							size="sm"
							onClick={() => onStatusChange(task, "in_progress")}
						>
							Execute
						</Button>
					)}
					{onStatusChange &&
						(task.status === "in_progress" || task.status === "ready") && (
							<Button
								variant="accent"
								size="sm"
								onClick={() => onStatusChange(task, "done")}
							>
								Mark Done
							</Button>
						)}
					{onStatusChange && task.status === "done" && (
						<Button
							variant="outline"
							size="sm"
							onClick={() => onStatusChange(task, "ready")}
						>
							Reopen
						</Button>
					)}
					{onDelete && (
						<Button
							variant="outline"
							size="sm"
							className="text-red-400 hover:text-red-300"
							onClick={() => onDelete(task)}
						>
							Delete
						</Button>
					)}
				</div>
			)}
		</div>
	);
}
