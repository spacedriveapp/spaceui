"use client";

import { useState } from "react";
import clsx from "clsx";

/** An icon source — either a URL string or an object with a .src property (e.g., Next.js StaticImageData) */
export type IconSource = string | { src: string };

/** Resolve an IconSource to a URL string */
function resolveIconSrc(src: IconSource): string {
	return typeof src === "string" ? src : src.src;
}

export interface FileThumbProps {
	/** Kind icon (e.g., Document, Folder PNG). Accepts URL string or StaticImageData. */
	iconSrc: IconSource;
	/** Optional thumbnail image (photo, video poster, etc.). Accepts URL string or StaticImageData. */
	thumbnailSrc?: IconSource | null;
	/** Optional extension badge overlay (bearded icon SVG URL) */
	beardedIconSrc?: string | null;
	/** Size in pixels (width and height) */
	size?: number;
	/** Scale factor for fallback icon relative to size (0-1, default 1) */
	iconScale?: number;
	/** Custom frame class for the thumbnail image (border, radius, bg) */
	frameClassName?: string;
	className?: string;
}

export function FileThumb({
	iconSrc,
	thumbnailSrc,
	beardedIconSrc,
	size = 100,
	iconScale = 1,
	frameClassName,
	className,
}: FileThumbProps) {
	const [thumbLoaded, setThumbLoaded] = useState(false);
	const [thumbError, setThumbError] = useState(false);

	const resolvedIcon = resolveIconSrc(iconSrc);
	const resolvedThumb = thumbnailSrc ? resolveIconSrc(thumbnailSrc) : null;

	const iconSize = size * iconScale;

	// Below 60px, show only bearded icon at full size; above, show as overlay at 40%
	const isSmallIcon = size < 60;
	const badgeSize = isSmallIcon ? iconSize : iconSize * 0.4;

	// Scale border radius with size (8% of size, clamped between 2px and 8px)
	const borderRadius = Math.min(8, Math.max(2, size * 0.08));

	return (
		<div
			className={clsx(
				"relative pointer-events-none flex shrink-0 grow-0 items-center justify-center",
				className,
			)}
			style={{
				width: size,
				height: size,
				minWidth: size,
				minHeight: size,
				maxWidth: size,
				maxHeight: size,
			}}
		>
			{/* Base kind icon — always rendered first (instant), thumbnail loads over it */}
			{/* Hide document icon if small and showing bearded badge */}
			{!(isSmallIcon && beardedIconSrc) && (
				<img
					src={resolvedIcon}
					alt=""
					className={clsx(
						"object-contain transition-opacity",
						thumbLoaded && resolvedThumb && "opacity-0",
					)}
					style={{
						width: iconSize,
						height: iconSize,
						maxWidth: "100%",
						maxHeight: "100%",
					}}
				/>
			)}

			{/* Thumbnail image (loads over the icon) */}
			{resolvedThumb && !thumbError && (
				<img
					src={resolvedThumb}
					alt=""
					className={clsx(
						"absolute inset-0 m-auto max-h-full max-w-full object-contain transition-opacity",
						frameClassName || "border border-app-line/50 bg-app-box/30",
						!thumbLoaded && "opacity-0",
					)}
					style={frameClassName ? undefined : { borderRadius: `${borderRadius}px` }}
					onLoad={() => setThumbLoaded(true)}
					onError={() => setThumbError(true)}
				/>
			)}

			{/* Bearded icon badge overlay */}
			{beardedIconSrc && (
				<img
					src={beardedIconSrc}
					alt=""
					className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2"
					style={{
						width: badgeSize,
						height: badgeSize,
					}}
				/>
			)}
		</div>
	);
}
