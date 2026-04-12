"use client";

import {Check} from "@phosphor-icons/react";
import * as RS from "@radix-ui/react-select";
import {cva, type VariantProps} from "class-variance-authority";
import clsx from "clsx";
import {forwardRef, type PropsWithChildren} from "react";

const ChevronDouble = (props: React.SVGProps<SVGSVGElement>) => (
	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M6.29289 14.2929C6.68342 13.9024 7.31658 13.9024 7.70711 14.2929L12 18.5858L16.2929 14.2929C16.6834 13.9024 17.3166 13.9024 17.7071 14.2929C18.0976 14.6834 18.0976 15.3166 17.7071 15.7071L12.7071 20.7071C12.3166 21.0976 11.6834 21.0976 11.2929 20.7071L6.29289 15.7071C5.90237 15.3166 5.90237 14.6834 6.29289 14.2929Z"
			fill="currentColor"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M6.29289 9.70711C6.68342 10.0976 7.31658 10.0976 7.70711 9.70711L12 5.41421L16.2929 9.70711C16.6834 10.0976 17.3166 10.0976 17.7071 9.70711C18.0976 9.31658 18.0976 8.68342 17.7071 8.29289L12.7071 3.29289C12.3166 2.90237 11.6834 2.90237 11.2929 3.29289L6.29289 8.29289C5.90237 8.68342 5.90237 9.31658 6.29289 9.70711Z"
			fill="currentColor"
		/>
	</svg>
);

export const selectStyles = cva(
	[
		"flex items-center justify-between whitespace-nowrap rounded-md border py-0.5 pl-3 pr-[10px] text-sm",
		"shadow-sm outline-none transition-[background-color,border-color,box-shadow] focus:ring-2",
		"text-ink radix-placeholder:text-ink-faint",
	],
	{
		variants: {
			variant: {
				default: ["bg-app-input", "border-app-line"],
			},
			size: {
				sm: "h-[25px] text-xs font-normal",
				md: "h-[34px]",
				lg: "h-[38px]",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "sm",
		},
	},
);

export interface SelectProps<
	TValue extends string = string,
> extends VariantProps<typeof selectStyles> {
	value: TValue;
	onChange: (value: TValue) => void;
	placeholder?: string;
	className?: string;
	disabled?: boolean;
	containerClassName?: string;
}

export const Select = forwardRef(
	<TValue extends string = string>(
		props: PropsWithChildren<SelectProps<TValue>>,
		ref: React.ForwardedRef<HTMLDivElement>,
	) => (
		<div className={props.containerClassName} ref={ref}>
			<RS.Root
				defaultValue={props.value}
				value={props.value}
				onValueChange={props.onChange}
				disabled={props.disabled}
			>
				<RS.Trigger
					className={selectStyles({
						size: props.size,
						className: props.className,
					})}
				>
					<span className="truncate">
						<RS.Value placeholder={props.placeholder} />
					</span>
					<RS.Icon className="ml-2">
						<ChevronDouble className="text-ink-dull" />
					</RS.Icon>
				</RS.Trigger>

				<RS.Portal>
					<RS.Content className="z-[100] rounded-md border border-app-line bg-app-box shadow-2xl shadow-app-shade/20">
						<RS.Viewport className="p-1">{props.children}</RS.Viewport>
					</RS.Content>
				</RS.Portal>
			</RS.Root>
		</div>
	),
) as <TValue extends string = string>(
	props: PropsWithChildren<SelectProps<TValue>> & {
		ref?: React.ForwardedRef<HTMLDivElement>;
	},
) => React.ReactElement;

export function SelectOption(
	props: PropsWithChildren<{value: string; default?: boolean}>,
) {
	return (
		<RS.Item
			value={props.value}
			defaultChecked={props.default}
			className={clsx(
				"relative flex h-6 cursor-pointer select-none items-center rounded pl-6 pr-3",
				"text-sm text-ink radix-highlighted:text-white",
				"focus:outline-none radix-disabled:opacity-50 radix-highlighted:bg-accent",
			)}
		>
			<RS.ItemText>{props.children}</RS.ItemText>
			<RS.ItemIndicator className="absolute left-1 inline-flex items-center">
				<Check className="size-4" />
			</RS.ItemIndicator>
		</RS.Item>
	);
}

export const SelectRoot = RS.Root;
export const SelectGroup = RS.Group;
export const SelectValue = RS.Value;

export const SelectTrigger = ({
	className,
	children,
	...props
}: RS.SelectTriggerProps) => (
	<RS.Trigger
		className={clsx(
			"flex h-8 w-full items-center justify-between rounded-md border border-app-line bg-app-dark-box px-3 py-1.5 text-sm transition-colors placeholder:text-ink-faint focus:border-accent/50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
			className,
		)}
		{...props}
	>
		{children}
		<RS.Icon asChild>
			<ChevronDouble className="size-4 opacity-50" />
		</RS.Icon>
	</RS.Trigger>
);

SelectTrigger.displayName = "SelectTrigger";

export const SelectScrollUpButton = ({
	className,
	...props
}: RS.SelectScrollUpButtonProps) => (
	<RS.ScrollUpButton
		className={clsx(
			"flex cursor-default items-center justify-center py-1",
			className,
		)}
		{...props}
	>
		<ChevronDouble className="size-4 rotate-180" />
	</RS.ScrollUpButton>
);

SelectScrollUpButton.displayName = "SelectScrollUpButton";

export const SelectScrollDownButton = ({
	className,
	...props
}: RS.SelectScrollDownButtonProps) => (
	<RS.ScrollDownButton
		className={clsx(
			"flex cursor-default items-center justify-center py-1",
			className,
		)}
		{...props}
	>
		<ChevronDouble className="size-4" />
	</RS.ScrollDownButton>
);

SelectScrollDownButton.displayName = "SelectScrollDownButton";

export const SelectContent = ({
	className,
	children,
	position = "popper",
	...props
}: RS.SelectContentProps) => (
	<RS.Portal>
		<RS.Content
			className={clsx(
				"relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-app-line bg-app-box text-ink shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
				position === "popper" &&
					"data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
				className,
			)}
			position={position}
			{...props}
		>
			<SelectScrollUpButton />
			<RS.Viewport
				className={clsx(
					"p-1",
					position === "popper" &&
						"h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
				)}
			>
				{children}
			</RS.Viewport>
			<SelectScrollDownButton />
		</RS.Content>
	</RS.Portal>
);

SelectContent.displayName = "SelectContent";

export const SelectLabel = ({className, ...props}: RS.SelectLabelProps) => (
	<RS.Label
		className={clsx(
			"py-1.5 pl-8 pr-2 text-sm font-semibold text-ink-dull",
			className,
		)}
		{...props}
	/>
);

SelectLabel.displayName = "SelectLabel";

export const SelectItem = ({
	className,
	children,
	...props
}: RS.SelectItemProps) => (
	<RS.Item
		className={clsx(
			"relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-app-hover focus:text-ink data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
			className,
		)}
		{...props}
	>
		<span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
			<RS.ItemIndicator>
				<Check className="size-4" />
			</RS.ItemIndicator>
		</span>
		<RS.ItemText>{children}</RS.ItemText>
	</RS.Item>
);

SelectItem.displayName = "SelectItem";

export const SelectSeparator = ({
	className,
	...props
}: RS.SelectSeparatorProps) => (
	<RS.Separator
		className={clsx("-mx-1 my-1 h-px bg-app-divider", className)}
		{...props}
	/>
);

SelectSeparator.displayName = "SelectSeparator";
