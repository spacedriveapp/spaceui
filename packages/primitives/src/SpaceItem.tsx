"use client";

import { forwardRef } from "react";
import clsx from "clsx";

export interface SpaceItemProps {
	/** Phosphor icon component, image URL string, or any React element type */
	icon?: React.ElementType | string;
	/** Display label */
	label: string;
	/** Active/selected state */
	active?: boolean;
	/** Colored dot instead of icon (e.g., tag color) */
	color?: string;
	/** Custom icon element (overrides icon prop — use for thumbnails, composed icons, etc.) */
	iconElement?: React.ReactNode;
	/** Right-side content (badge, count, indicator) */
	right?: React.ReactNode;
	onClick?: (e?: React.MouseEvent) => void;
	onContextMenu?: (e: React.MouseEvent) => void;
	className?: string;
}

export const SpaceItem = forwardRef<HTMLButtonElement, SpaceItemProps>(
	function SpaceItem(
		{
			icon,
			label,
			active,
			color,
			iconElement,
			right,
			onClick,
			onContextMenu,
			className,
		},
		ref,
	) {
		const isImageUrl = typeof icon === "string";
		const Icon = isImageUrl ? null : icon;

		return (
			<button
				ref={ref}
				onClick={onClick}
				onContextMenu={onContextMenu}
				className={clsx(
					"flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition-colors relative cursor-default",
					active
						? "bg-sidebar-selected/30 text-sidebar-ink"
						: "text-sidebar-inkDull",
					className,
				)}
			>
				{iconElement ? (
					iconElement
				) : color ? (
					<span
						className="size-4 shrink-0 rounded-full"
						style={{ backgroundColor: color }}
					/>
				) : isImageUrl ? (
					<img src={icon} alt="" width={16} height={16} className="size-4 shrink-0" />
				) : (
					Icon && (
						<span className="shrink-0">
							<Icon size={16} weight="bold" />
						</span>
					)
				)}
				<span className="flex-1 truncate text-left">{label}</span>
				{right}
			</button>
		);
	},
);
