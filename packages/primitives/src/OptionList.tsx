import {clsx} from "clsx";
import {forwardRef} from "react";

interface OptionListProps extends React.HTMLAttributes<HTMLDivElement> {}

interface OptionListItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	selected?: boolean;
}

const OptionList = forwardRef<HTMLDivElement, OptionListProps>(
	({className, ...props}, ref) => {
		return (
			<div ref={ref} className={clsx("space-y-1", className)} {...props} />
		);
	},
);

OptionList.displayName = "OptionList";

const OptionListItem = forwardRef<HTMLButtonElement, OptionListItemProps>(
	({className, selected, type = "button", ...props}, ref) => {
		return (
			<button
				ref={ref}
				type={type}
				className={clsx(
					"w-full cursor-pointer rounded-md px-3 py-2 text-left text-sm hover:bg-app-hover",
					selected && "bg-app-selected hover:bg-app-selected text-ink",
					className,
				)}
				{...props}
			/>
		);
	},
);

OptionListItem.displayName = "OptionListItem";

export {OptionList, OptionListItem};
export type {OptionListItemProps, OptionListProps};
