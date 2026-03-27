import {cva, type VariantProps} from "class-variance-authority";
import {clsx} from "clsx";
import {forwardRef} from "react";

export interface OptionListProps extends React.HTMLAttributes<HTMLDivElement> {}

const optionListItemStyles = cva(
	["w-full cursor-pointer text-left font-medium", "text-ink"],
	{
		variants: {
			size: {
				sm: "rounded-lg px-2.5 py-1 text-[11px]",
				md: "rounded-lg px-3 py-1.5 text-xs",
				lg: "rounded-lg px-3.5 py-2 text-sm",
			},
			selected: {
				true: "bg-app-selected text-ink",
				false: "hover:bg-app-hover hover:text-ink",
			},
		},
		defaultVariants: {
			size: "md",
			selected: false,
		},
	},
);

export interface OptionListItemProps
	extends
		Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size">,
		VariantProps<typeof optionListItemStyles> {}

const OptionList = forwardRef<HTMLDivElement, OptionListProps>(
	({className, ...props}, ref) => {
		return (
			<div ref={ref} className={clsx("space-y-0.5", className)} {...props} />
		);
	},
);

OptionList.displayName = "OptionList";

const OptionListItem = forwardRef<HTMLButtonElement, OptionListItemProps>(
	({className, selected, size, type = "button", ...props}, ref) => {
		return (
			<button
				ref={ref}
				type={type}
				className={clsx(
					optionListItemStyles({size, selected: !!selected}),
					className,
				)}
				{...props}
			/>
		);
	},
);

OptionListItem.displayName = "OptionListItem";

export {OptionList, OptionListItem, optionListItemStyles};
