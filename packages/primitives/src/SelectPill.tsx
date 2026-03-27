"use client";

import {CaretDown} from "@phosphor-icons/react";
import {cva, type VariantProps} from "class-variance-authority";
import clsx from "clsx";
import {forwardRef} from "react";

const selectPillStyles = cva(
	["flex items-center gap-2 border font-medium transition-colors", "text-left"],
	{
		variants: {
			variant: {
				default: [
					"bg-app-overlay/80 border-app-line/50 text-ink-dull",
					"hover:bg-app-box hover:text-ink",
				],
				sidebar: [
					"border-sidebar-line/30 bg-sidebar-box/20 text-sidebar-inkDull backdrop-blur-xl",
					"hover:bg-sidebar-box/30 hover:text-sidebar-ink",
				],
				ghost: [
					"border-transparent bg-transparent text-ink-dull",
					"hover:bg-app-hover hover:text-ink",
				],
			},
			size: {
				sm: "h-7 rounded-full px-2.5 text-[11px]",
				md: "h-8 rounded-full px-3 text-xs",
				lg: "h-9 rounded-full px-3.5 text-sm",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "md",
		},
	},
);

export interface SelectPillProps
	extends
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof selectPillStyles> {
	/** Hide the caret icon */
	hideCaret?: boolean;
}

export const SelectPill = forwardRef<HTMLButtonElement, SelectPillProps>(
	({className, variant, size, hideCaret, children, ...props}, ref) => (
		<button
			ref={ref}
			type="button"
			className={clsx(selectPillStyles({variant, size}), className)}
			{...props}
		>
			<span className="flex-1 truncate text-left">{children}</span>
			{!hideCaret && <CaretDown className="size-3 shrink-0" weight="bold" />}
		</button>
	),
);

SelectPill.displayName = "SelectPill";

export {selectPillStyles};
