"use client";

import clsx from "clsx";
import { FileThumb, type FileThumbProps } from "./FileThumb";

export interface GridItemTag {
	color: string;
	name: string;
}

export interface GridItemProps {
	/** File/folder display name */
	name: string;
	/** File extension (shown appended to name) */
	extension?: string | null;
	/** File size formatted as string (e.g., "1.2 MB") */
	sizeText?: string | null;
	/** Whether this item is currently selected */
	selected?: boolean;
	/** Tags to display as colored dots below the name */
	tags?: GridItemTag[];
	/** Size of the thumbnail area in pixels */
	thumbSize?: number;
	/** Props passed through to FileThumb (icon source accepts URL string or StaticImageData) */
	thumb: Pick<FileThumbProps, "iconSrc" | "thumbnailSrc" | "beardedIconSrc" | "frameClassName">;
	/** Volume capacity bar (optional, for volume items) */
	volumeBar?: React.ReactNode;
	/** Event handlers */
	onClick?: (e: React.MouseEvent) => void;
	onDoubleClick?: (e: React.MouseEvent) => void;
	onContextMenu?: (e: React.MouseEvent) => void;
	className?: string;
}

export function GridItem({
	name,
	extension,
	sizeText,
	selected = false,
	tags,
	thumbSize = 80,
	thumb,
	volumeBar,
	onClick,
	onDoubleClick,
	onContextMenu,
	className,
}: GridItemProps) {
	const displayName = extension ? `${name}.${extension}` : name;

	return (
		<button
			type="button"
			onClick={onClick}
			onDoubleClick={onDoubleClick}
			onContextMenu={onContextMenu}
			className={clsx(
				"cursor-default border-0 bg-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
				"flex flex-col items-center gap-2 p-1 rounded-lg",
				className,
			)}
		>
			{/* Thumbnail container */}
			<div
				className={clsx(
					"rounded-lg p-2",
					selected ? "bg-app-box" : "bg-transparent",
				)}
			>
				<FileThumb
					{...thumb}
					size={thumbSize}
				/>
			</div>

			{/* Name + metadata */}
			<div className="w-full flex flex-col items-center">
				<div
					className={clsx(
						"text-sm truncate px-2 py-0.5 rounded-md inline-block max-w-full",
						selected ? "bg-accent text-white" : "text-ink",
					)}
				>
					{displayName}
				</div>

				{/* Volume capacity bar */}
				{volumeBar}

				{/* File size */}
				{sizeText && !volumeBar && (
					<div className="text-xs text-ink-dull mt-0.5">
						{sizeText}
					</div>
				)}

				{/* Tag dots */}
				{tags && tags.length > 0 && (
					<div
						className="flex items-center gap-1 mt-1"
						title={tags.map((t) => t.name).join(", ")}
					>
						{tags.slice(0, 3).map((tag) => (
							<div
								key={tag.name}
								className="size-2 rounded-full"
								style={{ backgroundColor: tag.color }}
								title={tag.name}
							/>
						))}
						{tags.length > 3 && (
							<span className="text-[10px] text-ink-faint font-medium">
								+{tags.length - 3}
							</span>
						)}
					</div>
				)}
			</div>
		</button>
	);
}
