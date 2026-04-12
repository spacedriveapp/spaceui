"use client";

import {cva, cx, type VariantProps} from "class-variance-authority";
import {forwardRef} from "react";

export type ButtonBaseProps = VariantProps<typeof buttonStyles>;

export type ButtonProps = ButtonBaseProps &
	React.ButtonHTMLAttributes<HTMLButtonElement> & {
		href?: undefined;
		/** Alias for `disabled` */
		loading?: boolean;
	};

export type LinkButtonProps = ButtonBaseProps &
	React.AnchorHTMLAttributes<HTMLAnchorElement> & {
		href?: string;
		/** Alias for `disabled` (applies disabled styling via className) */
		loading?: boolean;
	};

type Button = {
	(props: ButtonProps): React.ReactElement;
	(props: LinkButtonProps): React.ReactElement;
};

const hasHref = (
	props: ButtonProps | LinkButtonProps,
): props is LinkButtonProps => "href" in props;

export const buttonStyles = cva(
	[
		"inline-flex cursor-default items-center justify-center gap-1.5 border font-medium tracking-wide outline-none transition-colors duration-100",
		"disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-70",
		"cursor-pointer ring-offset-app-box focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
	],
	{
		variants: {
			size: {
				icon: "!p-1",
				lg: "text-md px-3 py-1.5 font-medium",
				md: "px-2.5 py-1.5 text-sm font-medium",
				sm: "px-2 py-0.5 text-sm font-medium",
				xs: "px-1.5 py-0.5 text-xs font-normal",
			},
			variant: {
				default: [
					"bg-transparent hover:bg-app-hover active:bg-app-selected",
					"border border-app-line/80 hover:border-app-line active:border-app-line",
				],
				subtle: [
					"border-transparent hover:border-app-line/50 active:border-app-line active:bg-app-box/30",
				],
				outline: [
					"border-sidebar-line/60 hover:border-sidebar-line active:border-sidebar-line/30",
				],
				dotted: [
					"rounded border border-dashed border-sidebar-line/70 text-center text-xs font-medium text-ink-faint transition hover:border-sidebar-line hover:bg-sidebar-selected/5",
				],
				gray: [
					"bg-app-button hover:bg-app-hover focus:bg-app-selected text-ink",
					"border border-app-line/50 hover:border-app-line/70 focus:ring-1 focus:ring-accent",
				],
				accent: [
					"border-accent bg-accent text-white shadow-md shadow-app-shade/10 hover:brightness-110 focus:outline-none",
					"focus:ring-1 focus:ring-accent focus:ring-offset-2 focus:ring-offset-app-selected",
				],
				colored: [
					"text-white shadow-sm hover:bg-opacity-90 active:bg-opacity-100",
				],
				bare: "",
			},
			rounding: {
				none: "rounded-none",
				left: "rounded-l-md rounded-r-none",
				right: "rounded-l-none rounded-r-md",
				both: "rounded-xl",
				full: "rounded-full",
			},
		},
		defaultVariants: {
			size: "sm",
			variant: "default",
			rounding: "both",
		},
	},
);

export const Button = forwardRef<
	HTMLButtonElement | HTMLAnchorElement,
	ButtonProps | LinkButtonProps
>(({className, loading, ...props}, ref) => {
	if (loading && !hasHref(props))
		(props as ButtonProps).disabled = true;
	className = cx(buttonStyles(props), loading && "pointer-events-none opacity-70", className);
	return hasHref(props) ? (
		<a
			{...props}
			ref={ref as any}
			className={cx(className, "inline-block no-underline")}
		/>
	) : (
		<button
			type="button"
			{...(props as ButtonProps)}
			ref={ref as any}
			className={className}
		/>
	);
});

Button.displayName = "Button";

export {buttonStyles as buttonVariants};
