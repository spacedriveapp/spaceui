import { useMemo, useState } from 'react';
import { clsx } from 'clsx';
import {
	CaretDown,
	CheckCircle,
	Copy,
	Stop,
	Wrench
} from '@phosphor-icons/react';
import {Grid} from 'react-loader-spinner';
import { AnimatePresence, motion } from 'framer-motion';
import { ToolCall } from './ToolCall';
import { Markdown } from './Markdown';
import type { TranscriptStep } from './types';
import { pairTranscriptSteps } from './types';

/** Collapse runs of 3+ spaces to 2, preventing Markdown 4-space code blocks. */
function stripExcessWhitespace(text: string): string {
	return text.replace(/ {3,}/g, '  ');
}

interface InlineWorkerCardProps {
	title: string;
	status: string;
	toolCallCount: number;
	liveStatus?: string | null;
	transcript: TranscriptStep[];
	isTranscriptLoading?: boolean;
	onCopyLogs?: () => void;
	onCancel?: () => void;
	className?: string;
}

function InlineWorkerCard({
	title,
	status,
	toolCallCount,
	liveStatus,
	transcript,
	isTranscriptLoading,
	onCopyLogs,
	onCancel,
	className,
}: InlineWorkerCardProps) {
	const [expanded, setExpanded] = useState(false);

	const items = useMemo(() => pairTranscriptSteps(transcript), [transcript]);

	const isRunning = status === 'running';
	const isDone = status === 'completed';

	return (
		<div className={clsx('group flex min-w-0 flex-col items-start', className)}>
			<div className="min-w-0 max-w-full overflow-hidden rounded-2xl border border-app-line/50 bg-app-box/30 backdrop-blur-sm">
				<button
					onClick={() => setExpanded((v) => !v)}
					className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-app-box/30"
				>
					<div className="mt-0.5 shrink-0">
						{isRunning ? (
							<Grid height={16} width={16} color="currentColor" ariaLabel="loading" wrapperClass="text-accent" />
						) : isDone ? (
							<div className="flex size-7 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
								<CheckCircle className="size-4" weight="fill" />
							</div>
						) : (
							<div className="flex size-7 items-center justify-center rounded-full bg-app-hover text-ink-dull">
								<Wrench className="size-4" weight="bold" />
							</div>
						)}
					</div>

					<div className="min-w-0 flex-1">
						<div className="flex items-center gap-2">
							<div className="line-clamp-2 min-w-0 flex-1 text-sm font-medium leading-5 text-ink">
								{title}
							</div>
							<span
								className={clsx(
									'rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em]',
									isRunning
										? 'bg-accent/12 text-accent'
										: isDone
											? 'bg-emerald-500/12 text-emerald-400'
											: 'bg-app-hover text-ink-dull'
								)}
							>
								{status}
							</span>
						</div>
						<div className="mt-1 flex items-center gap-2 text-xs text-ink-dull">
							<span>{toolCallCount} tool calls</span>
							{liveStatus ? (
								<span className="truncate text-ink-faint">{liveStatus}</span>
							) : null}
						</div>
					</div>

					<CaretDown
						className={clsx(
							'mt-1 size-4 shrink-0 text-ink-faint transition-transform',
							expanded ? 'rotate-180' : ''
						)}
						weight="bold"
					/>
				</button>

				<AnimatePresence initial={false}>
					{expanded ? (
						<motion.div
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: 'auto', opacity: 1 }}
							exit={{ height: 0, opacity: 0 }}
							transition={{ duration: 0.18, ease: 'easeOut' }}
							className="overflow-hidden"
						>
							<div className="flex flex-col gap-2 border-t border-app-line/30 px-4 py-3">
								{isTranscriptLoading ? (
									<div className="text-xs text-ink-faint">
										Loading worker transcript...
									</div>
								) : items.length > 0 ? (
									items.map((item, index) =>
										item.kind === 'tool' ? (
											<ToolCall key={item.pair.id} pair={item.pair} />
										) : (
											<Markdown
												key={`text-${index}`}
												content={stripExcessWhitespace(item.text)}
												className="text-xs text-ink-dull"
											/>
										)
									)
								) : (
									<div className="text-xs text-ink-faint">
										No tool calls yet.
									</div>
								)}
							</div>
						</motion.div>
					) : null}
				</AnimatePresence>
			</div>

			<div className="mt-2 flex opacity-0 transition-opacity duration-150 group-focus-within:opacity-100 group-hover:opacity-100">
				{onCopyLogs && (
					<button
						onClick={onCopyLogs}
						className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-ink-dull hover:bg-app-hover hover:text-ink"
						title="Copy logs"
					>
						<Copy className="size-3.5" />
						Copy
					</button>
				)}
				{onCancel && isRunning && (
					<button
						onClick={onCancel}
						className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-ink-dull hover:bg-app-hover hover:text-ink"
						title="Cancel"
					>
						<Stop className="size-3.5" />
						Cancel
					</button>
				)}
			</div>
		</div>
	);
}

export { InlineWorkerCard };
export type { InlineWorkerCardProps };
