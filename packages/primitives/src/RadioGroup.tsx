"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import clsx from "clsx";
import { forwardRef } from "react";

export type RootProps = RadioGroupPrimitive.RadioGroupProps;

export const Root = forwardRef<HTMLDivElement, RootProps>(
	({ children, className, ...props }, ref) => {
		return (
			<RadioGroupPrimitive.Root {...props} ref={ref}>
				<div className={clsx("space-y-3", className)}>{children}</div>
			</RadioGroupPrimitive.Root>
		);
	},
);

Root.displayName = "RadioGroupRoot";

export type ItemProps = RadioGroupPrimitive.RadioGroupItemProps;

export const Item = ({ children, ...props }: ItemProps) => {
	return (
		<div
			className={clsx(
				"flex max-w-sm space-x-2 rounded-md border border-app-line bg-app-box/50 px-4 py-3",
				props.disabled && "opacity-30",
			)}
		>
			<RadioGroupPrimitive.Item
				id={"radio" + props.value}
				className={clsx(
					"peer relative mr-1 mt-1 size-4 shrink-0 rounded-full border border-app-line",
					"radix-state-checked:bg-accent",
					"radix-state-unchecked:bg-app-input",
					"focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring focus-visible:ring-accent focus-visible:ring-opacity-75 focus-visible:ring-offset-2",
				)}
				{...props}
			>
				<RadioGroupPrimitive.Indicator className="leading-0 absolute inset-0 flex items-center justify-center">
					<div className="size-1.5 rounded-full bg-white" />
				</RadioGroupPrimitive.Indicator>
			</RadioGroupPrimitive.Item>
			<label htmlFor={"radio" + props.value}>{children}</label>
		</div>
	);
};
