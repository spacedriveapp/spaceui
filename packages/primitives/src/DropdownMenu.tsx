"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, CaretRight } from "@phosphor-icons/react";
import clsx from "clsx";
import { forwardRef } from "react";

const Root = DropdownMenuPrimitive.Root;
const Trigger = DropdownMenuPrimitive.Trigger;
const Group = DropdownMenuPrimitive.Group;
const Portal = DropdownMenuPrimitive.Portal;
const Sub = DropdownMenuPrimitive.Sub;
const RadioGroup = DropdownMenuPrimitive.RadioGroup;

const Content = forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
	<DropdownMenuPrimitive.Portal>
		<DropdownMenuPrimitive.Content
			ref={ref}
			sideOffset={sideOffset}
			className={clsx(
				"z-50 min-w-[8rem] overflow-hidden rounded-md p-1",
				"border border-menu-line bg-menu/95 backdrop-blur-lg",
				"text-sm text-menu-ink shadow-xl shadow-menu-shade/30",
				"animate-in fade-in-0 zoom-in-95",
				className,
			)}
			{...props}
		/>
	</DropdownMenuPrimitive.Portal>
));

Content.displayName = DropdownMenuPrimitive.Content.displayName;

const Item = forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
		inset?: boolean;
	}
>(({ className, inset, ...props }, ref) => (
	<DropdownMenuPrimitive.Item
		ref={ref}
		className={clsx(
			"relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
			"text-menu-ink transition-colors",
			"focus:bg-accent focus:text-white",
			"data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
			inset && "pl-8",
			className,
		)}
		{...props}
	/>
));

Item.displayName = DropdownMenuPrimitive.Item.displayName;

const CheckboxItem = forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
	<DropdownMenuPrimitive.CheckboxItem
		ref={ref}
		className={clsx(
			"relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
			"text-menu-ink transition-colors",
			"focus:bg-accent focus:text-white",
			"data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
			className,
		)}
		checked={checked}
		{...props}
	>
		<span className="absolute left-2 flex size-3.5 items-center justify-center">
			<DropdownMenuPrimitive.ItemIndicator>
				<Check weight="bold" className="size-4" />
			</DropdownMenuPrimitive.ItemIndicator>
		</span>
		{children}
	</DropdownMenuPrimitive.CheckboxItem>
));

CheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;

const RadioItem = forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
	<DropdownMenuPrimitive.RadioItem
		ref={ref}
		className={clsx(
			"relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
			"text-menu-ink transition-colors",
			"focus:bg-accent focus:text-white",
			"data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
			className,
		)}
		{...props}
	>
		<span className="absolute left-2 flex size-3.5 items-center justify-center">
			<DropdownMenuPrimitive.ItemIndicator>
				<div className="size-2 rounded-full bg-current" />
			</DropdownMenuPrimitive.ItemIndicator>
		</span>
		{children}
	</DropdownMenuPrimitive.RadioItem>
));

RadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const Label = forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.Label>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
		inset?: boolean;
	}
>(({ className, inset, ...props }, ref) => (
	<DropdownMenuPrimitive.Label
		ref={ref}
		className={clsx(
			"px-2 py-1.5 text-xs font-semibold text-menu-ink",
			inset && "pl-8",
			className,
		)}
		{...props}
	/>
));

Label.displayName = DropdownMenuPrimitive.Label.displayName;

const Separator = forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
	<DropdownMenuPrimitive.Separator
		ref={ref}
		className={clsx("mx-1 my-0.5 border-b border-menu-line", className)}
		{...props}
	/>
));

Separator.displayName = DropdownMenuPrimitive.Separator.displayName;

const SubTrigger = forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
		inset?: boolean;
	}
>(({ className, inset, children, ...props }, ref) => (
	<DropdownMenuPrimitive.SubTrigger
		ref={ref}
		className={clsx(
			"flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
			"text-menu-ink focus:bg-accent focus:text-white",
			"data-[state=open]:bg-accent data-[state=open]:text-white",
			inset && "pl-8",
			className,
		)}
		{...props}
	>
		{children}
		<CaretRight weight="fill" size={12} className="ml-auto" />
	</DropdownMenuPrimitive.SubTrigger>
));

SubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;

const SubContent = forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
	<DropdownMenuPrimitive.SubContent
		ref={ref}
		className={clsx(
			"z-50 min-w-[8rem] overflow-hidden rounded-md p-1",
			"border border-menu-line bg-menu/95 backdrop-blur-lg",
			"text-sm text-menu-ink shadow-xl shadow-menu-shade/30",
			"animate-in fade-in-0 zoom-in-95",
			className,
		)}
		{...props}
	/>
));

SubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;

export const DropdownMenu = {
	Root,
	Trigger,
	Content,
	Item,
	CheckboxItem,
	RadioItem,
	Label,
	Separator,
	Group,
	Portal,
	Sub,
	SubTrigger,
	SubContent,
	RadioGroup,
};

// Named exports
export {
	Root as DropdownMenuRoot,
	Trigger as DropdownMenuTrigger,
	Content as DropdownMenuContent,
	Item as DropdownMenuItem,
	CheckboxItem as DropdownMenuCheckboxItem,
	RadioItem as DropdownMenuRadioItem,
	Label as DropdownMenuLabel,
	Separator as DropdownMenuSeparator,
	Group as DropdownMenuGroup,
	Portal as DropdownMenuPortal,
	Sub as DropdownMenuSub,
	SubTrigger as DropdownMenuSubTrigger,
	SubContent as DropdownMenuSubContent,
	RadioGroup as DropdownMenuRadioGroup,
};
