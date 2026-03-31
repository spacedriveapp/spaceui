"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import clsx from "clsx";
import { type PropsWithChildren, type ReactNode } from "react";

export const Kbd = ({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) => (
	<kbd
		className={clsx(
			"flex h-4.5 items-center justify-center rounded-md border border-app-selected bg-app-selected/50 px-1.5 py-0.5 text-[10px] text-ink",
			className,
		)}
	>
		{children}
	</kbd>
);

export interface TooltipProps
	extends PropsWithChildren,
		Pick<TooltipPrimitive.TooltipProps, "disableHoverableContent">,
		Pick<
			TooltipPrimitive.TooltipContentProps,
			"alignOffset" | "sideOffset" | "align"
		> {
	label: ReactNode;
	position?: "top" | "right" | "bottom" | "left";
	className?: string;
	tooltipClassName?: string;
	labelClassName?: string;
	asChild?: boolean;
	keybinds?: Array<string>;
}

const separateKeybinds = (
	keybinds: TooltipProps["keybinds"],
): TooltipProps["keybinds"] => {
	if (!keybinds) return;
	const arr = [];
	for (const i of keybinds) {
		if (i.length >= 2) {
			arr.push(i);
			continue;
		}
		for (const j of i) {
			arr.push(j);
		}
	}
	return arr;
};

export const Tooltip = ({ position = "bottom", ...props }: TooltipProps) => {
	return (
		<TooltipPrimitive.Root
			disableHoverableContent={props.disableHoverableContent}
		>
			<TooltipPrimitive.Trigger asChild>
				{props.asChild ? (
					props.children
				) : (
					<span className={props.className}>{props.children}</span>
				)}
			</TooltipPrimitive.Trigger>
			<TooltipPrimitive.Portal>
				<TooltipPrimitive.Content
					side={position}
					align={props.align}
					sideOffset={props.sideOffset}
					alignOffset={props.alignOffset}
					className={clsx(
						"TooltipContent z-[101] m-2 mt-1 flex max-w-[200px] select-text items-center gap-2 break-words rounded border border-app-line bg-app-box px-2 py-1 text-center text-xs text-ink",
						props.tooltipClassName,
						!props.label && "hidden",
					)}
				>
					<div className={props.labelClassName}>{props.label}</div>
					{props.keybinds && (
						<div className="flex items-center justify-center gap-1">
							{separateKeybinds(props.keybinds)?.map((k) => (
								<Kbd key={k.toString()}>
									<p>{k}</p>
								</Kbd>
							))}
						</div>
					)}
				</TooltipPrimitive.Content>
			</TooltipPrimitive.Portal>
		</TooltipPrimitive.Root>
	);
};

export const TooltipProvider = TooltipPrimitive.Provider;
export const TooltipRoot = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;
export const TooltipPortal = TooltipPrimitive.Portal;

export const TooltipContent = ({
	className,
	sideOffset = 4,
	...props
}: TooltipPrimitive.TooltipContentProps) => (
	<TooltipPrimitive.Content
		sideOffset={sideOffset}
		className={clsx(
			"z-50 overflow-hidden rounded-md border border-app-line bg-app-box px-3 py-1.5 text-sm text-ink shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
			className,
		)}
		{...props}
	/>
);

TooltipContent.displayName = "TooltipContent";
