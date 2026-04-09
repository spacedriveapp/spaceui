import { useState } from "react";
import {
	Badge,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Input,
	Select,
	SelectOption,
	TabsContent,
	TabsList,
	TabsRoot,
	TabsTrigger,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@spacedrive/primitives";
import { ChatComposer, Markdown, ModelSelector, ToolCall } from "@spacedrive/ai";
import { FileThumb, GridItem, RenameInput, TagPill } from "@spacedrive/explorer";
import { Form, InputField } from "@spacedrive/forms";
import { useForm } from "react-hook-form";

import type { ModelOption, ToolCallPair } from "@spacedrive/ai";

type DemoForm = {
	title: string;
};

const models: ModelOption[] = [
	{
		id: "gpt-5.4-mini",
		name: "GPT-5.4 Mini",
		provider: "OpenAI",
		context_window: 128000,
		capabilities: ["tools", "reasoning"],
	},
	{
		id: "gpt-5.4",
		name: "GPT-5.4",
		provider: "OpenAI",
		context_window: 256000,
		capabilities: ["tools", "reasoning"],
	},
];

const toolCall: ToolCallPair = {
	id: "1",
	name: "file_read",
	argsRaw: '{"path":"/tmp/demo.txt"}',
	args: { path: "/tmp/demo.txt" },
	resultRaw: '{"content":"Hello from SpaceUI showcase"}',
	result: { content: "Hello from SpaceUI showcase" },
	status: "completed",
	title: "Read demo file",
};

export default function App() {
	const [tab, setTab] = useState("primitives");
	const [selectValue, setSelectValue] = useState("alpha");
	const [draft, setDraft] = useState("");
	const [modelId, setModelId] = useState(models[0].id);
	const [renameValue, setRenameValue] = useState("release-notes");

	const form = useForm<DemoForm>({
		defaultValues: { title: "Ship SpaceUI cleanup packet" },
	});

	return (
		<TooltipProvider>
			<div className="mx-auto max-w-6xl space-y-6 p-8">
				<header className="space-y-2">
					<div className="flex items-center gap-3">
						<h1 className="text-3xl font-semibold text-ink">SpaceUI Showcase</h1>
						<Badge variant="default">live</Badge>
					</div>
					<p className="text-sm text-ink-dull">
						Examples wired to the current public exports.
					</p>
				</header>

				<TabsRoot value={tab} onValueChange={setTab}>
					<TabsList>
						<TabsTrigger value="primitives">Primitives</TabsTrigger>
						<TabsTrigger value="ai">AI</TabsTrigger>
						<TabsTrigger value="explorer">Explorer</TabsTrigger>
						<TabsTrigger value="forms">Forms</TabsTrigger>
					</TabsList>

					<TabsContent value="primitives" className="mt-4 space-y-4">
						<Card>
							<CardHeader>
								<CardTitle>Buttons</CardTitle>
								<CardDescription>Current variant contract</CardDescription>
							</CardHeader>
							<CardContent className="flex flex-wrap gap-2">
								<Button>Default</Button>
								<Button variant="subtle">Subtle</Button>
								<Button variant="outline">Outline</Button>
								<Button variant="dotted">Dotted</Button>
								<Button variant="gray">Gray</Button>
								<Button variant="accent">Accent</Button>
								<Button variant="colored" className="bg-status-info">
									Colored
								</Button>
								<Button variant="bare">Bare</Button>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Input + Select</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<Input placeholder="Search files..." />
								<Select value={selectValue} onChange={setSelectValue}>
									<SelectOption value="alpha">Alpha</SelectOption>
									<SelectOption value="beta">Beta</SelectOption>
									<SelectOption value="stable">Stable</SelectOption>
								</Select>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button size="xs" variant="outline">
											Hover for tooltip
										</Button>
									</TooltipTrigger>
									<TooltipContent>Tooltip is wired</TooltipContent>
								</Tooltip>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="ai" className="mt-4 space-y-4">
						<Card>
							<CardHeader>
								<CardTitle>ToolCall + Markdown</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<ToolCall toolCall={toolCall} expanded />
								<Markdown content={"## Markdown\n\n- list item\n- code\n\n`spaceui`"} />
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Composer + ModelSelector</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<ModelSelector
									models={models}
									value={modelId}
									onChange={setModelId}
								/>
								<ChatComposer
									draft={draft}
									onDraftChange={setDraft}
									onSend={() => setDraft("")}
									modelSelector={{
										value: modelId,
										options: models,
										onChange: setModelId,
									}}
									heading="Ask the agent"
								/>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="explorer" className="mt-4 space-y-4">
						<Card>
							<CardHeader>
								<CardTitle>TagPill + FileThumb</CardTitle>
							</CardHeader>
							<CardContent className="flex items-center gap-4">
								<TagPill color="#60a5fa">Important</TagPill>
								<FileThumb
									iconSrc="https://placehold.co/128x128/1f2937/ffffff.png?text=DOC"
									thumbnailSrc="https://placehold.co/128x128/0f172a/93c5fd.png?text=THUMB"
									size={72}
								/>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>GridItem + RenameInput</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="w-48">
									<GridItem
										name="release-notes"
										extension="md"
										sizeText="14 KB"
										tags={[{ name: "docs", color: "#22c55e" }]}
										thumb={{
											iconSrc:
												"https://placehold.co/128x128/0b1020/e2e8f0.png?text=MD",
										}}
									/>
								</div>
								<RenameInput
									name={renameValue}
									extension="md"
									onSave={async (newName) => {
										setRenameValue(newName.replace(/\.md$/, ""));
									}}
									onCancel={() => {}}
								/>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="forms" className="mt-4 space-y-4">
						<Card>
							<CardHeader>
								<CardTitle>Form Wrappers</CardTitle>
							</CardHeader>
							<CardContent>
								<Form {...form}>
									<form
										onSubmit={form.handleSubmit(() => {})}
										className="max-w-md space-y-3"
									>
										<InputField
											name="title"
											label="Task title"
											placeholder="Describe the task"
										/>
										<Button type="submit" variant="accent">
											Submit
										</Button>
									</form>
								</Form>
							</CardContent>
						</Card>
					</TabsContent>
				</TabsRoot>
			</div>
		</TooltipProvider>
	);
}
