"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import clsx from "clsx";

export const Root = ({
	className,
	...props
}: TabsPrimitive.TabsProps) => (
	<TabsPrimitive.Root className={clsx("flex flex-col", className)} {...props} />
);

export const Content = ({
	className,
	...props
}: TabsPrimitive.TabsContentProps) => (
	<TabsPrimitive.Content className={clsx("outline-none", className)} {...props} />
);

export const List = ({
	className,
	...props
}: TabsPrimitive.TabsListProps) => (
	<TabsPrimitive.List
		className={clsx(
			"flex flex-row items-center space-x-1 border-b border-app-line/70 p-2",
			className,
		)}
		{...props}
	/>
);

export const Trigger = ({
	className,
	...props
}: TabsPrimitive.TabsTriggerProps) => (
	<TabsPrimitive.Trigger
		className={clsx(
			"rounded-full px-2 py-0.5 text-sm font-medium radix-state-active:bg-app-selected",
			className,
		)}
		{...props}
	/>
);
