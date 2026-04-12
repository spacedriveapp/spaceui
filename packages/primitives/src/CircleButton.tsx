"use client";

import {cva, type VariantProps} from "class-variance-authority";
import clsx from "clsx";
import {forwardRef} from "react";

export const circleButtonStyles = cva(
	[
		"flex items-center justify-center",
		"backdrop-blur-xl transition-[background-color,border-color,color,transform]",
		"border border-app-line/50",
		"rounded-full",
		"active:scale-95",
	],
	{
		variants: {
			variant: {
				default:
					"bg-app-overlay/80 text-sidebar-inkDull hover:bg-app-box hover:text-sidebar-ink",
				active: "bg-app-overlay text-sidebar-ink",
				accent: "border-accent/30 bg-accent/20 text-accent",
				solid:
					"border-app-line bg-app-box text-ink-dull hover:bg-app-hover hover:text-ink",
			},
			size: {
				sm: "h-7 w-7",
				md: "h-8 w-8",
				lg: "h-9 w-9",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "md",
		},
	},
);

export interface CircleButtonProps
	extends
		Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size">,
		VariantProps<typeof circleButtonStyles> {
	icon?: React.ElementType;
	/** @deprecated Use variant="active" or variant="accent" instead */
	active?: boolean;
	/** @deprecated Use variant="accent" instead */
	activeAccent?: boolean;
}

export const CircleButton = forwardRef<HTMLButtonElement, CircleButtonProps>(
	(
		{
			icon: Icon,
			active,
			activeAccent,
			variant,
			size,
			className,
			children,
			...props
		},
		ref,
	) => {
		// Resolve legacy active/activeAccent props to variant
		const resolvedVariant =
			variant ??
			(active && activeAccent ? "accent" : active ? "active" : "default");

		return (
			<button
				ref={ref}
				className={clsx(
					circleButtonStyles({
						variant: resolvedVariant,
						size,
					}),
					children && "w-auto gap-2 px-3",
					className,
				)}
				{...props}
			>
				{Icon && <Icon className="size-[18px]" weight="bold" />}
				{children && <span className="text-xs font-medium">{children}</span>}
			</button>
		);
	},
);

CircleButton.displayName = "CircleButton";
