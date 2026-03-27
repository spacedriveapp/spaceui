import clsx from "clsx";
import {Children, cloneElement, isValidElement} from "react";

interface CircleButtonGroupProps {
	children: React.ReactNode;
	className?: string;
}

export function CircleButtonGroup({
	children,
	className,
}: CircleButtonGroupProps) {
	const childArray = Children.toArray(children);

	return (
		<div
			className={clsx(
				"flex h-8 items-center rounded-full",
				"border border-app-line/50 backdrop-blur-xl",
				"overflow-hidden bg-app-overlay/80",
				className,
			)}
		>
			{childArray.map((child, index) => {
				if (!isValidElement(child)) return child;

				return (
					<div key={index} className="relative flex items-center">
						{cloneElement(child as React.ReactElement<any>, {
							className: clsx(
								(child as any).props.className,
								"!rounded-none !border-0 !backdrop-blur-none !bg-transparent",
								"hover:!bg-app-box",
							),
						})}
						{index < childArray.length - 1 && (
							<div className="h-5 w-px bg-sidebar-line/30" />
						)}
					</div>
				);
			})}
		</div>
	);
}

export type {CircleButtonGroupProps};
