import {useState} from 'react';
import {clsx} from 'clsx';
import {CaretDown, GitBranch} from '@phosphor-icons/react';
import {Grid} from 'react-loader-spinner';
import {Markdown} from './Markdown';

interface InlineBranchCardProps {
	description: string;
	completedAt: string | null;
	conclusion?: string | null;
	className?: string;
}

function InlineBranchCard({
	description,
	completedAt,
	conclusion,
	className,
}: InlineBranchCardProps) {
	const [expanded, setExpanded] = useState(false);
	const isRunning = !completedAt;

	return (
		<div className={clsx('group flex min-w-0 flex-col items-start', className)}>
			<div className="min-w-0 max-w-full overflow-hidden rounded-2xl border border-app-line/50 bg-app-box/30 backdrop-blur-sm">
				<button
					type="button"
					onClick={() => setExpanded((v) => !v)}
					className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-app-box/30"
				>
					<div className="mt-0.5 shrink-0">
						{isRunning ? (
							<Grid height={16} width={16} color="currentColor" ariaLabel="loading" wrapperClass="text-accent" />
						) : (
							<div className="flex size-7 items-center justify-center rounded-full bg-accent/15 text-accent">
								<GitBranch className="size-4" weight="bold" />
							</div>
						)}
					</div>
					<div className="min-w-0 flex-1">
						<div className="flex items-center gap-2">
							<div className="line-clamp-2 min-w-0 flex-1 text-sm font-medium leading-5 text-ink">
								{description}
							</div>
							<span
								className={clsx(
									'rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em]',
									isRunning
										? 'bg-accent/12 text-accent'
										: 'bg-emerald-500/12 text-emerald-400',
								)}
							>
								{isRunning ? 'thinking' : 'done'}
							</span>
						</div>
					</div>
					{conclusion && (
						<CaretDown
							className={clsx(
								'mt-1 size-4 shrink-0 text-ink-faint transition-transform',
								expanded ? 'rotate-180' : '',
							)}
							weight="bold"
						/>
					)}
				</button>
				{expanded && conclusion && (
					<div className="border-t border-app-line/30 px-4 py-3">
						<Markdown content={conclusion} className="text-xs text-ink-dull" />
					</div>
				)}
			</div>
		</div>
	);
}

export {InlineBranchCard};
export type {InlineBranchCardProps};
