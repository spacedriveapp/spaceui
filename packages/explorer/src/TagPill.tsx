import clsx from "clsx";

export interface TagPillProps {
	color: string;
	children: React.ReactNode;
	size?: "xs" | "sm" | "md";
	onClick?: (e: React.MouseEvent) => void;
	onRemove?: (e: React.MouseEvent) => void;
	className?: string;
}

export function TagPill({
	color,
	children,
	size = "sm",
	onClick,
	onRemove,
	className,
}: TagPillProps) {
	return (
		<button
			onClick={onClick}
			className={clsx(
				"inline-flex items-center gap-1.5 rounded-full font-medium",
				size === "xs" && "px-1.5 py-0.5 text-[10px]",
				size === "sm" && "px-2 py-0.5 text-xs",
				size === "md" && "px-2.5 py-1 text-sm",
				(onClick || onRemove) && "transition-[filter] hover:brightness-110",
				className,
			)}
			style={{ backgroundColor: `${color}20`, color }}
		>
			<span
				className={clsx(
					"flex-shrink-0 rounded-full",
					size === "xs" && "size-1",
					size === "sm" && "size-1.5",
					size === "md" && "size-2",
				)}
				style={{ backgroundColor: color }}
			/>
			<span className="truncate">{children}</span>
			{onRemove && (
				<span
					onClick={(e) => {
						e.stopPropagation();
						onRemove(e);
					}}
					className="ml-0.5 transition-transform hover:scale-110"
				>
					×
				</span>
			)}
		</button>
	);
}
