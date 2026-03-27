"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import clsx from "clsx";
import { forwardRef, useState } from "react";

/** Convenience hook for controlled popover state */
export function usePopover() {
	const [open, setOpen] = useState(false);
	return { open, setOpen };
}

const Root = PopoverPrimitive.Root;
const Trigger = PopoverPrimitive.Trigger;
const Anchor = PopoverPrimitive.Anchor;
const Close = PopoverPrimitive.Close;
const Portal = PopoverPrimitive.Portal;

const Content = forwardRef<
	React.ElementRef<typeof PopoverPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, sideOffset = 8, ...props }, ref) => (
	<PopoverPrimitive.Portal>
		<PopoverPrimitive.Content
			ref={ref}
			sideOffset={sideOffset}
			onOpenAutoFocus={(event) => event.preventDefault()}
			onCloseAutoFocus={(event) => event.preventDefault()}
			className={clsx(
				"flex flex-col",
				"z-[9999] min-w-44",
				"cursor-default select-none rounded-lg",
				"text-left text-sm text-ink",
				"bg-app-overlay",
				"border border-app-line",
				"shadow-2xl",
				"radix-state-closed:animate-out radix-state-closed:fade-out-0",
				className,
			)}
			{...props}
		/>
	</PopoverPrimitive.Portal>
));

Content.displayName = PopoverPrimitive.Content.displayName;

export const Popover = {
	Root,
	Trigger,
	Content,
	Anchor,
	Close,
	Portal,
};

// Named exports for direct imports
export {
	Root as PopoverRoot,
	Trigger as PopoverTrigger,
	Content as PopoverContent,
	Anchor as PopoverAnchor,
	Close as PopoverClose,
	Portal as PopoverPortal,
};
