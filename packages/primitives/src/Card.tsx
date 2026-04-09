import {clsx} from "clsx";
import {forwardRef} from "react";

type CardVariant = "default" | "dark";

const variantStyles: Record<CardVariant, string> = {
	default: "bg-app-box",
	dark: "bg-app",
};

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
	variant?: CardVariant;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
	({className, variant = "default", ...props}, ref) => (
		<div
			ref={ref}
			className={clsx(
				"rounded-2xl border border-app-line text-ink shadow-sm",
				variantStyles[variant],
				className,
			)}
			{...props}
		/>
	),
);

Card.displayName = "Card";

const CardHeader = forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => (
	<div
		ref={ref}
		className={clsx("flex flex-col space-y-1.5 p-6", className)}
		{...props}
	/>
));

CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLHeadingElement>
>(({className, ...props}, ref) => (
	<h3
		ref={ref}
		className={clsx(
			"text-2xl font-semibold leading-none tracking-tight text-ink",
			className,
		)}
		{...props}
	/>
));

CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({className, ...props}, ref) => (
	<p
		ref={ref}
		className={clsx("text-sm text-ink-dull", className)}
		{...props}
	/>
));

CardDescription.displayName = "CardDescription";

const CardContent = forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => (
	<div ref={ref} className={clsx("p-6 pt-0", className)} {...props} />
));

CardContent.displayName = "CardContent";

const CardFooter = forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => (
	<div
		ref={ref}
		className={clsx("flex items-center p-6 pt-0", className)}
		{...props}
	/>
));

CardFooter.displayName = "CardFooter";

export {Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent};
