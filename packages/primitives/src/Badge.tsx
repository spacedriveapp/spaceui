import {clsx} from "clsx";
import {type VariantProps, cva} from "class-variance-authority";

const badgeVariants = cva(
	"inline-flex items-center rounded-full border font-medium transition-colors",
	{
		variants: {
			variant: {
				default: "border border-app-line bg-app-button text-ink-dull",
				secondary: "border-transparent bg-app-box text-ink-dull",
				outline: "border-app-line text-ink-dull",
				accent: "border-transparent bg-accent/10 text-accent",
				success: "border-transparent bg-status-success/10 text-status-success",
				warning: "border-transparent bg-status-warning/10 text-status-warning",
				error: "border-transparent bg-status-error/10 text-status-error",
				destructive: "border-transparent bg-status-error/10 text-status-error",
				info: "border-transparent bg-status-info/10 text-status-info",
			},
			size: {
				sm: "px-1.5 py-px text-[9px]",
				default: "px-2 py-0.5 text-xs",
				md: "px-2.5 py-1 text-xs",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export interface BadgeProps
	extends
		React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof badgeVariants> {}

function Badge({className, variant, size, ...props}: BadgeProps) {
	return (
		<div
			className={clsx(badgeVariants({variant, size}), className)}
			{...props}
		/>
	);
}

export {Badge, badgeVariants};
