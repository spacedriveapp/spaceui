"use client";

export const Divider = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={`bg-app-line/60 my-1 h-[1px] w-full ${className ?? ""}`}
		{...props}
	/>
);
