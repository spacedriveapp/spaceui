"use client";

import clsx from "clsx";
import {forwardRef} from "react";
import {LayoutGroup, motion} from "framer-motion";

// ─── TabBar Container ────────────────────────────────────────────────────────

export interface TabBarProps extends React.HTMLAttributes<HTMLDivElement> {
	/** Unique layout group ID for framer-motion animation coordination */
	layoutId?: string;
	/** Element rendered after the tab list (e.g. a "new tab" button) */
	trailing?: React.ReactNode;
}

export const TabBar = forwardRef<HTMLDivElement, TabBarProps>(
	({layoutId = "tab-bar", trailing, className, children, ...props}, ref) => (
		<div
			ref={ref}
			className={clsx(
				"mx-2 flex h-9 shrink-0 items-center gap-1 rounded-full px-1",
				"bg-app-box/80 shadow-sm backdrop-blur-sm",
				className,
			)}
			{...props}
		>
			<LayoutGroup id={layoutId}>
				<div className="flex min-w-0 flex-1 items-center gap-1">
					{children}
				</div>
			</LayoutGroup>
			{trailing}
		</div>
	),
);

TabBar.displayName = "TabBar";

// ─── TabBarItem ──────────────────────────────────────────────────────────────

export interface TabBarItemProps
	extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
	/** Whether this tab is currently active */
	active?: boolean;
	/** Tab label */
	label: string;
	/** Called when the close button is clicked */
	onClose?: () => void;
	/** Show close button (default: true when onClose is provided) */
	closable?: boolean;
	/** Close button element — override to provide your own icon */
	closeIcon?: React.ReactNode;
}

export const TabBarItem = forwardRef<HTMLButtonElement, TabBarItemProps>(
	(
		{
			active,
			label,
			onClose,
			closable,
			closeIcon,
			className,
			...props
		},
		ref,
	) => {
		const showClose = closable ?? !!onClose;

		return (
			<div
				className={clsx(
					"group relative flex min-w-0 flex-1 items-center justify-center",
					className,
				)}
			>
				<button
					ref={ref}
					className={clsx(
						"relative flex w-full min-w-0 items-center justify-center rounded-full py-1.5 text-[13px]",
						active
							? "text-ink"
							: "text-ink-dull hover:text-ink hover:bg-app-hover/50",
					)}
					{...props}
				>
					{active && (
						<motion.div
							layoutId="activeTab"
							className="absolute inset-0 rounded-full bg-app-selected shadow-sm"
							initial={false}
							transition={{
								type: "spring",
								stiffness: 500,
								damping: 35,
							}}
						/>
					)}
					<span className="relative z-10 truncate px-6">{label}</span>
				</button>
				{showClose && active && (
					<button
						type="button"
						aria-label="Close tab"
						onClick={(e) => {
							e.stopPropagation();
							onClose?.();
						}}
						className="z-10 flex cursor-pointer items-center justify-center rounded-full opacity-60 transition-[background-color,opacity] hover:bg-app-hover hover:opacity-100"
						style={{ position: "absolute", left: 6, top: "50%", transform: "translateY(-50%)", width: 20, height: 20 }}
						title="Close tab"
					>
						{closeIcon ?? (
							<svg
								width="10"
								height="10"
								viewBox="0 0 10 10"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
							>
								<path d="M2 2l6 6M8 2l-6 6" />
							</svg>
						)}
					</button>
				)}
			</div>
		);
	},
);

TabBarItem.displayName = "TabBarItem";
