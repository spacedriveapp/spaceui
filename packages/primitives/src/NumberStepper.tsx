import {clsx} from "clsx";
import {forwardRef} from "react";
import {Minus, Plus} from "@phosphor-icons/react";

export interface NumberStepperProps {
	value: number;
	onChange: (value: number) => void;
	min?: number;
	max?: number;
	step?: number;
	allowFloat?: boolean;
	disabled?: boolean;
	className?: string;
	showProgress?: boolean;
	label?: string;
	description?: string;
	suffix?: string;
}

const NumberStepper = forwardRef<HTMLDivElement, NumberStepperProps>(
	(
		{
			value,
			onChange,
			min = 0,
			max = 100,
			step = 1,
			allowFloat = false,
			disabled = false,
			className,
			showProgress = false,
			label,
			description,
			suffix,
		},
		ref,
	) => {
		const handleDecrement = () => {
			const newValue = allowFloat
				? Math.max(min, value - step)
				: Math.max(min, Math.floor(value - step));
			onChange(newValue);
		};

		const handleIncrement = () => {
			const newValue = allowFloat
				? Math.min(max, value + step)
				: Math.min(max, Math.ceil(value + step));
			onChange(newValue);
		};

		const progress = ((value - min) / (max - min)) * 100;

		return (
			<div ref={ref} className={clsx("flex flex-col gap-1", className)}>
				{(label || description) && (
					<div className="flex flex-col gap-0.5">
						{label && <span className="text-sm font-medium text-ink">{label}</span>}
						{description && <span className="text-xs text-ink-faint">{description}</span>}
					</div>
				)}
				<div className="flex w-fit items-center bg-app-dark-box border border-app-line rounded-lg p-1 gap-2">
					<button
						type="button"
						onClick={handleDecrement}
						disabled={disabled || value <= min}
						className={clsx(
							"flex h-8 w-8 items-center justify-center rounded-md border border-app-line bg-app-box",
							"hover:bg-app-hover disabled:opacity-50 disabled:cursor-not-allowed",
							"focus:outline-none focus:ring-2 focus:ring-accent",
						)}
					>
						<Minus className="size-4 text-ink" />
					</button>
					<span className="min-w-[3rem] text-center text-sm font-medium text-ink">
						{allowFloat ? value.toFixed(1) : value}{suffix}
					</span>
					<button
						type="button"
						onClick={handleIncrement}
						disabled={disabled || value >= max}
						className={clsx(
							"flex h-8 w-8 items-center justify-center rounded-md border border-app-line bg-app-box",
							"hover:bg-app-hover disabled:opacity-50 disabled:cursor-not-allowed",
							"focus:outline-none focus:ring-2 focus:ring-accent",
						)}
					>
						<Plus className="size-4 text-ink" />
					</button>
				</div>
				{showProgress && (
					<div className="h-1 w-full overflow-hidden rounded-full bg-app-line">
						<div
							className="h-full bg-accent transition-all duration-200"
							style={{width: `${progress}%`}}
						/>
					</div>
				)}
			</div>
		);
	},
);

NumberStepper.displayName = "NumberStepper";

export {NumberStepper};
