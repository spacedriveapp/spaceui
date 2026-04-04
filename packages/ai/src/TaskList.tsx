import { CaretRight } from "@phosphor-icons/react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@spacedrive/primitives";
import clsx from "clsx";
import { useMemo } from "react";

import { TaskRow } from "./TaskRow";
import { TaskStatusIcon } from "./TaskStatusIcon";
import type { Task, TaskStatus } from "./types";
import { TASK_STATUS_LABEL, TASK_STATUS_ORDER } from "./types";

export interface TaskListProps {
	tasks: Task[];
	groups?: TaskStatus[];
	collapsedGroups?: Set<TaskStatus>;
	onToggleGroup?: (status: TaskStatus) => void;
	activeTaskId?: string;
	onTaskClick: (task: Task) => void;
	onStatusChange?: (task: Task, status: TaskStatus) => void;
	onDelete?: (task: Task) => void;
	resolveAgentName?: (agentId: string) => string;
	className?: string;
}

const COL_GRID = "20px 18px 72px 1fr 56px 80px 28px";
const GRID_STYLE = {
	gridTemplateColumns: COL_GRID,
	paddingLeft: 12,
	paddingRight: 8,
	gap: 8,
} as const;

export function TaskList({
	tasks,
	groups = TASK_STATUS_ORDER,
	collapsedGroups,
	onToggleGroup,
	activeTaskId,
	onTaskClick,
	onStatusChange,
	onDelete,
	resolveAgentName,
	className,
}: TaskListProps) {
	const grouped = useMemo(() => {
		const map = new Map<TaskStatus, Task[]>();
		for (const status of groups) map.set(status, []);
		for (const task of tasks) {
			const bucket = map.get(task.status);
			if (bucket) bucket.push(task);
		}
		return map;
	}, [tasks, groups]);

	return (
		<div className={clsx("flex flex-col", className)}>
			{/* Column header */}
			<div
				className="grid items-center border-b border-app-line bg-app-box/40 text-[11px] font-medium uppercase tracking-wider text-ink-faint"
				style={{ ...GRID_STYLE, height: 28 }}
			>
				<span />
				<span />
				<span>ID</span>
				<span>Title</span>
				<span className="text-right">Subs</span>
				<span className="text-right">Assignee</span>
				<span />
			</div>

			{/* Groups */}
			{groups.map((status) => {
				const items = grouped.get(status) ?? [];
				const isOpen = !collapsedGroups?.has(status);

				return (
					<Collapsible
						key={status}
						open={isOpen}
						onOpenChange={() => onToggleGroup?.(status)}
					>
						<CollapsibleTrigger
							className="grid w-full items-center border-b border-app-line/40 bg-app-box/20 text-xs font-medium text-ink-dull hover:bg-app-hover/40"
							style={{ ...GRID_STYLE, height: 30 }}
						>
							<span className="flex items-center justify-center">
								<CaretRight
									size={10}
									weight="bold"
									className={clsx(
										"shrink-0 transition-transform",
										isOpen && "rotate-90",
									)}
								/>
							</span>
							<span className="flex items-center justify-center">
								<TaskStatusIcon status={status} size={12} />
							</span>
							<span className="col-span-5 flex items-center gap-1.5 text-left">
								{TASK_STATUS_LABEL[status]}
								<span className="text-ink-faint">({items.length})</span>
							</span>
						</CollapsibleTrigger>

						<CollapsibleContent>
							{items.length > 0 ? (
								items.map((task) => (
									<TaskRow
										key={task.id}
										task={task}
										isActive={task.id === activeTaskId}
										onClick={onTaskClick}
										onStatusChange={onStatusChange}
										onDelete={onDelete}
										resolveAgentName={resolveAgentName}
									/>
								))
							) : (
								<div className="border-b border-app-line/40 px-3 py-2 text-xs italic text-ink-faint">
									No tasks
								</div>
							)}
						</CollapsibleContent>
					</Collapsible>
				);
			})}
		</div>
	);
}
