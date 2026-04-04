"use client";

import {Check} from "@phosphor-icons/react";
import {
	Popover,
	usePopover,
	SelectPill,
	SearchBar,
	OptionList,
	OptionListItem,
	type SelectPillProps,
} from "@spacedrive/primitives";
import clsx from "clsx";
import {forwardRef, useMemo, useState} from "react";

import type {ModelOption} from "./types";

export interface ModelSelectorProps {
	/** Available models */
	models: ModelOption[];
	/** Currently selected model ID */
	value: string;
	/** Called when a model is selected */
	onChange: (value: string) => void;
	/** Placeholder when nothing selected */
	placeholder?: string;
	/** Search placeholder */
	searchPlaceholder?: string;
	/** SelectPill variant */
	variant?: SelectPillProps["variant"];
	/** SelectPill size */
	size?: SelectPillProps["size"];
	/** Controlled popover (optional) */
	popover?: ReturnType<typeof usePopover>;
	/** Additional trigger className */
	className?: string;
	/** Disabled state */
	disabled?: boolean;
}

export const ModelSelector = forwardRef<HTMLButtonElement, ModelSelectorProps>(
	(
		{
			models,
			value,
			onChange,
			placeholder = "Select model...",
			searchPlaceholder = "Search models...",
			variant,
			size,
			popover: externalPopover,
			className,
			disabled,
		},
		ref,
	) => {
		const internalPopover = usePopover();
		const popover = externalPopover ?? internalPopover;
		const [search, setSearch] = useState("");

		const selectedModel = models.find((m) => m.id === value);

		const grouped = useMemo(() => {
			const q = search.toLowerCase();
			const filtered = search.trim()
				? models.filter(
						(m) =>
							m.name.toLowerCase().includes(q) ||
							m.provider.toLowerCase().includes(q),
					)
				: models;

			return filtered.reduce(
				(acc, model) => {
					if (!acc[model.provider]) acc[model.provider] = [];
					acc[model.provider].push(model);
					return acc;
				},
				{} as Record<string, ModelOption[]>,
			);
		}, [models, search]);

		return (
			<Popover.Root
				open={popover.open}
				onOpenChange={(open) => {
					popover.setOpen(open);
					if (!open) setSearch("");
				}}
			>
				<Popover.Trigger asChild>
					<SelectPill
						ref={ref}
						variant={variant}
						size={size}
						disabled={disabled}
						className={clsx("w-full", className)}
					>
						{selectedModel?.name ?? placeholder}
					</SelectPill>
				</Popover.Trigger>
				<Popover.Content align="end" sideOffset={8} style={{width: 280}}>
					{/* Search */}
					<SearchBar
						value={search}
						onChange={setSearch}
						placeholder={searchPlaceholder}
						autoFocus
						className="mb-1.5"
					/>

					{/* Grouped results */}
					<div className="max-h-[280px] overflow-y-auto">
						{Object.entries(grouped).map(([provider, providerModels]) => (
							<div key={provider}>
								<div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink-faint">
									{provider}
								</div>
								<OptionList>
									{providerModels.map((model) => (
										<OptionListItem
											key={model.id}
											selected={model.id === value}
											onClick={() => {
												onChange(model.id);
												popover.setOpen(false);
												setSearch("");
											}}
										>
											<div className="flex w-full items-center justify-between">
												<div>
													<div>{model.name}</div>
													{model.context_window && (
														<div className="text-[10px] text-ink-faint">
															{model.context_window.toLocaleString()} tokens
														</div>
													)}
												</div>
												{model.id === value && (
													<Check
														className="size-3.5 text-accent"
														weight="bold"
													/>
												)}
											</div>
										</OptionListItem>
									))}
								</OptionList>
							</div>
						))}
						{Object.keys(grouped).length === 0 && (
							<div className="px-3 py-3 text-center text-xs text-ink-faint">
								No models found
							</div>
						)}
					</div>
				</Popover.Content>
			</Popover.Root>
		);
	},
);

ModelSelector.displayName = "ModelSelector";
