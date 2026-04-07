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
				blue: "border-transparent bg-blue-500/10 text-blue-400",
				green: "border-transparent bg-green-500/10 text-green-400",
				red: "border-transparent bg-red-500/10 text-red-400",
				amber: "border-transparent bg-amber-500/10 text-amber-400",
				violet: "border-transparent bg-violet-500/10 text-violet-400",
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
