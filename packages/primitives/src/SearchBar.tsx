"use client";

import {MagnifyingGlass, X} from "@phosphor-icons/react";
import clsx from "clsx";
import {forwardRef, useState} from "react";

interface SearchBarProps extends Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	"value" | "onChange"
> {
	value?: string;
	onChange?: (value: string) => void;
	onClear?: () => void;
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
	(
		{value, onChange, onClear, className, placeholder = "Search...", ...props},
		ref,
	) => {
		const [internalValue, setInternalValue] = useState("");
		const currentValue = value !== undefined ? value : internalValue;

		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = e.target.value;
			if (onChange) {
				onChange(newValue);
			} else {
				setInternalValue(newValue);
			}
		};

		const handleClear = () => {
			if (onChange) {
				onChange("");
			} else {
				setInternalValue("");
			}
			onClear?.();
		};

		return (
			<div
				className={clsx(
					"flex h-8 items-center gap-2 px-3",
					"rounded-full backdrop-blur-xl",
					"border border-app-line/30 bg-app-overlay/80 hover:bg-app-box",
					"transition-colors focus-within:bg-sidebar-box/30",
					className,
				)}
			>
				<MagnifyingGlass
					className="size-[18px] flex-shrink-0 text-ink-faint"
					weight="bold"
				/>
				<input
					ref={ref}
					type="text"
					value={currentValue}
					onChange={handleChange}
					placeholder={placeholder}
					className={clsx(
						"min-w-0 flex-1 border-0 bg-transparent p-0 outline-none",
						"text-xs font-medium text-sidebar-ink placeholder:text-sidebar-inkFaint",
						"focus:border-0 focus:outline-none focus:ring-0",
					)}
					{...props}
				/>
				{currentValue && (
					<button
						type="button"
						onClick={handleClear}
						aria-label="Clear Search"
						className="flex-shrink-0 rounded-full p-0.5 transition-colors hover:bg-sidebar-selected/40"
					>
						<X className="size-3 text-sidebar-inkDull" weight="bold" />
					</button>
				)}
			</div>
		);
	},
);

SearchBar.displayName = "SearchBar";
