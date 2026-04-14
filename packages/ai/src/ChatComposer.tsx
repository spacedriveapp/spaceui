"use client";

import {Microphone, Sparkle} from "@phosphor-icons/react";
import {
	CircleButton,
	OptionList,
	OptionListItem,
	Popover,
	SelectPill,
	usePopover,
} from "@spacedrive/primitives";
import {AnimatePresence, motion} from "framer-motion";
import {type ReactNode} from "react";

import {ModelSelector} from "./ModelSelector";
import type {ModelOption} from "./types";

export interface ChatComposerProps {
	/** Current draft text */
	draft: string;
	/** Called when draft changes */
	onDraftChange: (value: string) => void;
	/** Called when user hits send (Enter or send button) */
	onSend: () => void;
	/** Placeholder for the textarea */
	placeholder?: string;
	/** Show an optional heading above the composer */
	heading?: ReactNode;
	/** Disable the composer — draft can still change, but send/voice are blocked */
	isSending?: boolean;
	/** Project selector config — omit to hide */
	projectSelector?: {
		value: string;
		options: string[];
		onChange: (project: string) => void;
		popover: ReturnType<typeof usePopover>;
	};
	/** Model selector config — omit to hide */
	modelSelector?: {
		value: string;
		options: ModelOption[];
		onChange: (model: string) => void;
	};
	/** Voice button handler — omit to hide */
	onOpenVoice?: () => void;
	/** Optional content rendered at the far right of the toolbar (before send) */
	toolbarExtra?: ReactNode;
}

/**
 * Generic chat composer with an expanding textarea, optional project pill,
 * model selector, voice button, and an animated send button.
 */
export function ChatComposer({
	draft,
	onDraftChange,
	onSend,
	placeholder = "Ask something...",
	heading,
	isSending = false,
	projectSelector,
	modelSelector,
	onOpenVoice,
	toolbarExtra,
}: ChatComposerProps) {
	const canSend = !isSending && draft.trim().length > 0;

	return (
		<>
			{heading && (
				<div className="text-ink-dull mb-3 flex items-center gap-2 px-1 text-xs font-medium">
					<span className="text-accent inline-flex size-3.5 shrink-0">
						<Sparkle size="100%" weight="fill" />
					</span>
					{heading}
				</div>
			)}

			<div className="border-app-line bg-app-box/70 rounded-[24px] border p-4 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-2xl">
				<textarea
					value={draft}
					onChange={(event) => onDraftChange(event.target.value)}
					onKeyDown={(event) => {
						if (event.key === "Enter" && !event.shiftKey) {
							event.preventDefault();
							onSend();
						}
					}}
					placeholder={placeholder}
					rows={2}
					className="text-ink placeholder:text-ink-faint block w-full resize-none rounded-md border-0 bg-transparent text-sm leading-6 outline-none focus:border-0 focus:outline-none focus:ring-0"
				/>

				<div className="mt-4 flex items-center justify-between gap-3">
					{projectSelector ? (
						<div className="w-[210px]">
							<Popover.Root
								open={projectSelector.popover.open}
								onOpenChange={projectSelector.popover.setOpen}
							>
								<Popover.Trigger asChild>
									<SelectPill className="w-full">
										{projectSelector.value}
									</SelectPill>
								</Popover.Trigger>
								<Popover.Content align="start" sideOffset={8}>
									<OptionList>
										{projectSelector.options.map((option) => (
											<OptionListItem
												key={option}
												selected={option === projectSelector.value}
												onClick={() => {
													projectSelector.onChange(option);
													projectSelector.popover.setOpen(false);
												}}
											>
												{option}
											</OptionListItem>
										))}
									</OptionList>
								</Popover.Content>
							</Popover.Root>
						</div>
					) : (
						<div />
					)}

					<motion.div layout className="flex items-center gap-2">
						{modelSelector && (
							<div className="w-[180px]">
								<ModelSelector
									models={modelSelector.options}
									value={modelSelector.value}
									onChange={modelSelector.onChange}
								/>
							</div>
						)}

						{toolbarExtra}

						{onOpenVoice && (
							<CircleButton
								icon={Microphone}
								onClick={onOpenVoice}
								aria-label="Open Voice Input"
							/>
						)}

						<AnimatePresence initial={false}>
							{canSend ? (
								<motion.div
									key="send-wrap"
									layout
									initial={{width: 0, opacity: 0, x: 12}}
									animate={{width: 76, opacity: 1, x: 0}}
									exit={{width: 0, opacity: 0, x: 12}}
									transition={{duration: 0.18, ease: "easeOut"}}
									className="overflow-hidden"
								>
									<button
										onClick={onSend}
										className="border-app-line bg-accent hover:bg-accent-faint flex h-9 w-[76px] items-center justify-center rounded-full border px-4 text-xs font-medium text-white"
									>
										<span className="whitespace-nowrap">Send</span>
									</button>
								</motion.div>
							) : null}
						</AnimatePresence>
					</motion.div>
				</div>
			</div>
		</>
	);
}
