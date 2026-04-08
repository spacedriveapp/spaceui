import {useState} from "react";
import {clsx} from "clsx";
import type {ToolCallPair, ToolCallStatus} from "./types";

// ---------------------------------------------------------------------------
// Tool-specific rendering
// ---------------------------------------------------------------------------

interface ToolRenderer {
	summary(pair: ToolCallPair): string | null;
	argsView?(pair: ToolCallPair): React.ReactNode | null;
	resultView?(pair: ToolCallPair): React.ReactNode | null;
}

const toolRenderers: Record<string, ToolRenderer> = {
	browser_launch: {
		summary(pair) {
			const headless = pair.args?.headless;
			return headless === false ? "Launch browser (visible)" : "Launch browser";
		},
		resultView(pair) {
			if (!pair.resultRaw) return null;
			return <ResultLine text="Browser session started" />;
		},
	},

	browser_navigate: {
		summary(pair) {
			const url = pair.args?.url;
			return url ? truncate(String(url), 60) : null;
		},
		resultView(pair) {
			if (!pair.result) return <ResultText text={pair.resultRaw} />;
			const title = pair.result.title as string | undefined;
			const url = pair.result.url as string | undefined;
			return (
				<div className="flex flex-col gap-1 px-3 py-2">
					{title && (
						<p className="text-[11px] text-ink-dull">
							<span className="text-ink-faint">Title: </span>
							{title}
						</p>
					)}
					{url && (
						<p className="font-mono text-[11px] text-ink-faint">
							{truncate(url, 80)}
						</p>
					)}
				</div>
			);
		},
	},

	browser_snapshot: {
		summary(pair) {
			if (!pair.resultRaw) return "Taking snapshot...";
			const matches = pair.resultRaw.match(/\[\d+\]/g);
			const count = matches?.length ?? 0;
			return count > 0
				? `${count} interactive element${count !== 1 ? "s" : ""}`
				: "Page snapshot";
		},
		resultView(pair) {
			if (!pair.resultRaw) return null;
			return <CollapsiblePre text={pair.resultRaw} maxLines={20} />;
		},
	},

	browser_click: {
		summary(pair) {
			const index = pair.args?.index;
			return index !== undefined ? `Click element [${index}]` : "Click";
		},
		resultView(pair) {
			if (!pair.resultRaw) return null;
			return <ResultLine text={pair.resultRaw} />;
		},
	},

	browser_type: {
		summary(pair) {
			const index = pair.args?.index;
			const hasSecret = pair.args?.secret !== undefined;
			const text = pair.args?.text;
			if (hasSecret) {
				return index !== undefined
					? `Type secret into [${index}]`
					: "Type secret";
			}
			if (text) {
				const display = truncate(String(text), 30);
				return index !== undefined
					? `Type "${display}" into [${index}]`
					: `Type "${display}"`;
			}
			return index !== undefined ? `Type into [${index}]` : "Type";
		},
		resultView(pair) {
			if (!pair.resultRaw) return null;
			return <ResultLine text={pair.resultRaw} />;
		},
	},

	browser_press_key: {
		summary(pair) {
			const key = pair.args?.key;
			return key ? `Press ${key}` : "Press key";
		},
		resultView(pair) {
			if (!pair.resultRaw) return null;
			return <ResultLine text={pair.resultRaw} />;
		},
	},

	browser_screenshot: {
		summary() {
			return "Capture screenshot";
		},
		resultView(pair) {
			if (!pair.resultRaw) return null;
			if (pair.result?.base64) {
				const mimeType = (pair.result.mime_type as string) ?? "image/png";
				return (
					<div className="px-3 py-2">
						<img
							src={`data:${mimeType};base64,${pair.result.base64}`}
							alt="Browser screenshot"
							className="max-h-60 rounded border border-app-line/30 object-contain"
						/>
					</div>
				);
			}
			return <ResultLine text={truncate(pair.resultRaw, 100)} />;
		},
	},

	browser_evaluate: {
		summary(pair) {
			const expression = pair.args?.expression;
			return expression ? truncate(String(expression), 50) : "Evaluate JS";
		},
		argsView(pair) {
			const expression = pair.args?.expression;
			if (!expression) return null;
			return (
				<div className="border-b border-app-line/20 px-3 py-2">
					<p className="mb-1 text-[11px] font-medium text-ink-faint">
						JavaScript
					</p>
					<pre className="max-h-40 overflow-auto font-mono text-[11px] text-ink-dull">
						{String(expression)}
					</pre>
				</div>
			);
		},
	},

	browser_tab_open: {
		summary(pair) {
			const url = pair.args?.url;
			return url ? `Open tab: ${truncate(String(url), 50)}` : "Open new tab";
		},
	},

	browser_tab_list: {
		summary() {
			return "List tabs";
		},
	},

	browser_tab_close: {
		summary(pair) {
			const tabId = pair.args?.tab_id;
			return tabId !== undefined ? `Close tab ${tabId}` : "Close tab";
		},
	},

	browser_close: {
		summary() {
			return "Close browser";
		},
		resultView(pair) {
			if (!pair.resultRaw) return null;
			return <ResultLine text="Browser session closed" />;
		},
	},

	shell: {
		summary(pair) {
			const command = pair.args?.command;
			if (!command) return null;
			if (pair.result && typeof pair.result.exit_code === "number") {
				const code = pair.result.exit_code;
				const cmdStr = truncate(String(command), 50);
				return code === 0 ? cmdStr : `${cmdStr} (exit ${code})`;
			}
			return truncate(String(command), 60);
		},
		argsView(pair) {
			const command = pair.args?.command;
			if (!command) return null;
			return (
				<div className="border-b border-app-line/20 px-3 py-2">
					<pre className="max-h-40 overflow-auto font-mono text-[11px] text-ink-dull">
						<span className="select-none text-ink-faint">$ </span>
						{String(command)}
					</pre>
				</div>
			);
		},
		resultView(pair) {
			if (!pair.resultRaw) return null;
			return <ShellResultView pair={pair} />;
		},
	},

	file_read: {
		summary(pair) {
			if (pair.title) return pair.title;
			const path = pair.args?.path;
			return path ? truncate(String(path), 60) : null;
		},
		argsView(pair) {
			const path = pair.args?.path;
			if (!path) return null;
			const offset = pair.args?.offset;
			const limit = pair.args?.limit;
			return (
				<div className="border-b border-app-line/20 px-3 py-2">
					<p className="font-mono text-[11px] text-ink-dull">
						{String(path)}
						{offset ? ` (from line ${offset})` : ""}
						{limit ? ` (${limit} lines)` : ""}
					</p>
				</div>
			);
		},
		resultView(pair) {
			if (!pair.resultRaw) return null;
			return <CollapsiblePre text={pair.resultRaw} maxLines={30} />;
		},
	},

	file_write: {
		summary(pair) {
			if (pair.title) return pair.title;
			const path = pair.args?.path;
			return path ? truncate(String(path), 60) : null;
		},
		argsView(pair) {
			const path = pair.args?.path;
			const content = pair.args?.content;
			if (!path && !content) return null;
			return (
				<div className="border-b border-app-line/20 px-3 py-2">
					{!!path && (
						<p className="mb-1 font-mono text-[11px] text-ink-dull">
							{String(path)}
						</p>
					)}
					{!!content && (
						<pre className="max-h-40 overflow-auto font-mono text-[11px] text-ink-faint">
							{truncate(String(content), 2000)}
						</pre>
					)}
				</div>
			);
		},
		resultView(pair) {
			if (!pair.resultRaw) return null;
			return <ResultLine text={truncate(pair.resultRaw, 100)} />;
		},
	},

	file_edit: {
		summary(pair) {
			if (pair.title) return pair.title;
			const path = pair.args?.path;
			return path ? truncate(String(path), 60) : null;
		},
		argsView(pair) {
			const path = pair.args?.path;
			const oldStr = pair.args?.old_string;
			const newStr = pair.args?.new_string;
			if (!path) return null;
			return (
				<div className="border-b border-app-line/20 px-3 py-2">
					<p className="mb-1 font-mono text-[11px] text-ink-dull">
						{String(path)}
					</p>
					{!!oldStr && (
						<div className="mt-1">
							<p className="text-[11px] font-medium text-red-400/70">Old</p>
							<pre className="max-h-20 overflow-auto font-mono text-[11px] text-red-300/60">
								{truncate(String(oldStr), 500)}
							</pre>
						</div>
					)}
					{!!newStr && (
						<div className="mt-1">
							<p className="text-[11px] font-medium text-emerald-400/70">New</p>
							<pre className="max-h-20 overflow-auto font-mono text-[11px] text-emerald-300/60">
								{truncate(String(newStr), 500)}
							</pre>
						</div>
					)}
				</div>
			);
		},
		resultView(pair) {
			if (!pair.resultRaw) return null;
			return <ResultLine text={truncate(pair.resultRaw, 100)} />;
		},
	},

	file_list: {
		summary(pair) {
			if (pair.title) return pair.title;
			const path = pair.args?.path;
			return path ? truncate(String(path), 60) : null;
		},
		resultView(pair) {
			if (!pair.resultRaw) return null;
			return <CollapsiblePre text={pair.resultRaw} maxLines={30} />;
		},
	},

	exec: {
		summary(pair) {
			const program = pair.args?.program;
			const cmdArgs = pair.args?.args;
			if (!program) return null;
			const parts = [String(program)];
			if (Array.isArray(cmdArgs)) {
				for (const arg of cmdArgs) parts.push(String(arg));
			}
			const full = parts.join(" ");
			if (pair.result && typeof pair.result.exit_code === "number") {
				const code = pair.result.exit_code;
				const cmdStr = truncate(full, 50);
				return code === 0 ? cmdStr : `${cmdStr} (exit ${code})`;
			}
			return truncate(full, 60);
		},
		argsView(pair) {
			const program = pair.args?.program;
			if (!program) return null;
			const parts = [String(program)];
			const cmdArgs = pair.args?.args;
			if (Array.isArray(cmdArgs)) {
				for (const arg of cmdArgs) parts.push(String(arg));
			}
			return (
				<div className="border-b border-app-line/20 px-3 py-2">
					<pre className="max-h-40 overflow-auto font-mono text-[11px] text-ink-dull">
						<span className="select-none text-ink-faint">$ </span>
						{parts.join(" ")}
					</pre>
				</div>
			);
		},
		resultView(pair) {
			if (!pair.resultRaw) return null;
			return <ShellResultView pair={pair} />;
		},
	},

	set_status: {
		summary(pair) {
			const kind = pair.args?.kind;
			const message = pair.args?.message;
			if (kind === "outcome") {
				return message
					? `Outcome: ${truncate(String(message), 50)}`
					: "Outcome set";
			}
			return message ? truncate(String(message), 60) : null;
		},
		resultView() {
			return null;
		},
	},

	// OpenCode tools

	read: {
		summary(pair) {
			if (pair.title) return pair.title;
			const filePath = pair.args?.filePath ?? pair.args?.file_path;
			return filePath ? truncate(String(filePath), 60) : null;
		},
		argsView(pair) {
			const filePath = pair.args?.filePath ?? pair.args?.file_path;
			if (!filePath) return null;
			const offset = pair.args?.offset;
			const limit = pair.args?.limit;
			return (
				<div className="border-b border-app-line/20 px-3 py-2">
					<p className="font-mono text-[11px] text-ink-dull">
						{String(filePath)}
						{offset ? ` (from line ${offset})` : ""}
						{limit ? ` (${limit} lines)` : ""}
					</p>
				</div>
			);
		},
		resultView(pair) {
			if (!pair.resultRaw) return null;
			return <CollapsiblePre text={pair.resultRaw} maxLines={30} />;
		},
	},

	write: {
		summary(pair) {
			if (pair.title) return pair.title;
			const filePath = pair.args?.filePath ?? pair.args?.file_path;
			return filePath ? truncate(String(filePath), 60) : null;
		},
		argsView(pair) {
			const filePath = pair.args?.filePath ?? pair.args?.file_path;
			const content = pair.args?.content;
			if (!filePath && !content) return null;
			return (
				<div className="border-b border-app-line/20 px-3 py-2">
					{!!filePath && (
						<p className="mb-1 font-mono text-[11px] text-ink-dull">
							{String(filePath)}
						</p>
					)}
					{!!content && (
						<pre className="max-h-40 overflow-auto font-mono text-[11px] text-ink-faint">
							{truncate(String(content), 2000)}
						</pre>
					)}
				</div>
			);
		},
		resultView(pair) {
			if (!pair.resultRaw) return null;
			return <ResultLine text={truncate(pair.resultRaw, 100)} />;
		},
	},

	edit: {
		summary(pair) {
			if (pair.title) return pair.title;
			const filePath = pair.args?.filePath ?? pair.args?.file_path;
			return filePath ? truncate(String(filePath), 60) : null;
		},
		argsView(pair) {
			const filePath = pair.args?.filePath ?? pair.args?.file_path;
			const oldStr = pair.args?.oldString ?? pair.args?.old_string;
			const newStr = pair.args?.newString ?? pair.args?.new_string;
			if (!filePath) return null;
			return (
				<div className="border-b border-app-line/20 px-3 py-2">
					<p className="mb-1 font-mono text-[11px] text-ink-dull">
						{String(filePath)}
					</p>
					{!!oldStr && (
						<div className="mt-1">
							<p className="text-[11px] font-medium text-red-400/70">Old</p>
							<pre className="max-h-20 overflow-auto font-mono text-[11px] text-red-300/60">
								{truncate(String(oldStr), 500)}
							</pre>
						</div>
					)}
					{!!newStr && (
						<div className="mt-1">
							<p className="text-[11px] font-medium text-emerald-400/70">New</p>
							<pre className="max-h-20 overflow-auto font-mono text-[11px] text-emerald-300/60">
								{truncate(String(newStr), 500)}
							</pre>
						</div>
					)}
				</div>
			);
		},
		resultView(pair) {
			if (!pair.resultRaw) return null;
			return <ResultLine text={truncate(pair.resultRaw, 100)} />;
		},
	},

	bash: {
		summary(pair) {
			if (pair.title) return pair.title;
			const command = pair.args?.command;
			if (!command) return null;
			if (pair.result && typeof pair.result.exit_code === "number") {
				const code = pair.result.exit_code;
				const cmdStr = truncate(String(command), 50);
				return code === 0 ? cmdStr : `${cmdStr} (exit ${code})`;
			}
			return truncate(String(command), 60);
		},
		argsView(pair) {
			const command = pair.args?.command;
			if (!command) return null;
			return (
				<div className="border-b border-app-line/20 px-3 py-2">
					<pre className="max-h-40 overflow-auto font-mono text-[11px] text-ink-dull">
						<span className="select-none text-ink-faint">$ </span>
						{String(command)}
					</pre>
				</div>
			);
		},
		resultView(pair) {
			if (!pair.resultRaw) return null;
			return <ShellResultView pair={pair} />;
		},
	},

	glob: {
		summary(pair) {
			if (pair.title) return pair.title;
			const pattern = pair.args?.pattern;
			return pattern ? truncate(String(pattern), 60) : null;
		},
		resultView(pair) {
			if (!pair.resultRaw) return null;
			return <CollapsiblePre text={pair.resultRaw} maxLines={20} />;
		},
	},

	grep: {
		summary(pair) {
			if (pair.title) return pair.title;
			const pattern = pair.args?.pattern;
			const include = pair.args?.include;
			if (pattern && include) {
				return `/${pattern}/ in ${include}`;
			}
			return pattern ? `/${truncate(String(pattern), 40)}/` : null;
		},
		resultView(pair) {
			if (!pair.resultRaw) return null;
			return <CollapsiblePre text={pair.resultRaw} maxLines={20} />;
		},
	},

	webfetch: {
		summary(pair) {
			if (pair.title) return pair.title;
			const url = pair.args?.url;
			return url ? truncate(String(url), 60) : null;
		},
		resultView(pair) {
			if (!pair.resultRaw) return null;
			return <CollapsiblePre text={pair.resultRaw} maxLines={20} />;
		},
	},

	read_skill: {
		summary(pair) {
			if (pair.title) return pair.title;
			const name = pair.args?.name;
			return name ? String(name) : null;
		},
		resultView(pair) {
			if (!pair.resultRaw) return null;
			return <CollapsiblePre text={pair.resultRaw} maxLines={30} />;
		},
	},

	web_search: {
		summary(pair) {
			if (pair.title) return pair.title;
			const query = pair.args?.query;
			const resultCount =
				pair.result?.result_count ??
				(Array.isArray(pair.result?.results)
					? (pair.result!.results as unknown[]).length
					: null);
			const queryStr = query ? truncate(String(query), 50) : null;
			if (queryStr && resultCount != null) {
				return `${queryStr} (${resultCount} result${resultCount !== 1 ? "s" : ""})`;
			}
			return queryStr;
		},
		argsView(pair) {
			const query = pair.args?.query;
			if (!query) return null;
			const count = pair.args?.count;
			const freshness = pair.args?.freshness;
			return (
				<div className="border-b border-app-line/20 px-3 py-2">
					<p className="text-[11px] text-ink-dull">
						<span className="select-none text-ink-faint">Search: </span>
						{String(query)}
					</p>
					{!!(count || freshness) && (
						<p className="mt-0.5 text-[11px] text-ink-faint">
							{count ? `${count} results` : ""}
							{count && freshness ? " · " : ""}
							{freshness ? `${freshness}` : ""}
						</p>
					)}
				</div>
			);
		},
		resultView(pair) {
			if (!pair.resultRaw) return null;
			return <CollapsiblePre text={pair.resultRaw} maxLines={20} />;
		},
	},

	spacebot_docs: {
		summary(pair) {
			if (pair.title) return pair.title;
			const action = pair.args?.action;
			const docId = pair.args?.doc_id;
			if (action === "read" && docId) {
				return truncate(String(docId), 50);
			}
			return action ? String(action) : "list";
		},
		argsView(pair) {
			const action = pair.args?.action;
			const docId = pair.args?.doc_id;
			const query = pair.args?.query;
			if (!action && !docId) return null;
			return (
				<div className="border-b border-app-line/20 px-3 py-2">
					{!!docId && (
						<p className="font-mono text-[11px] text-ink-dull">
							{String(docId)}
						</p>
					)}
					{!!query && (
						<p className="mt-0.5 text-[11px] text-ink-faint">
							filter: {String(query)}
						</p>
					)}
				</div>
			);
		},
		resultView(pair) {
			if (!pair.resultRaw) return null;
			return <CollapsiblePre text={pair.resultRaw} maxLines={30} />;
		},
	},

	todowrite: {
		summary(pair) {
			if (pair.title) return pair.title;
			return "Update tasks";
		},
		resultView() {
			return null;
		},
	},

	task: {
		summary(pair) {
			if (pair.title) return pair.title;
			const description = pair.args?.description;
			return description ? truncate(String(description), 60) : null;
		},
		resultView(pair) {
			if (!pair.resultRaw) return null;
			return <CollapsiblePre text={pair.resultRaw} maxLines={20} />;
		},
	},
};

const defaultRenderer: ToolRenderer = {
	summary(pair) {
		if (!pair.argsRaw || pair.argsRaw === "{}") return null;
		return truncate(pair.argsRaw, 60);
	},
};

function getRenderer(name: string): ToolRenderer {
	return toolRenderers[name] ?? defaultRenderer;
}

// ---------------------------------------------------------------------------
// Shared sub-components
// ---------------------------------------------------------------------------

function ResultLine({text}: {text: string}) {
	return <p className="px-3 py-2 text-[11px] text-ink-dull">{text}</p>;
}

function ResultText({text}: {text: string | null}) {
	if (!text) return null;
	return (
		<pre className="max-h-60 overflow-auto whitespace-pre-wrap px-3 py-2 font-mono text-[11px] text-ink-dull">
			{text}
		</pre>
	);
}

function CollapsiblePre({
	text,
	maxLines = 20,
}: {
	text: string;
	maxLines?: number;
}) {
	const [expanded, setExpanded] = useState(false);
	const lines = text.split("\n");
	const needsCollapse = lines.length > maxLines;
	const displayText =
		needsCollapse && !expanded
			? lines.slice(0, maxLines).join("\n") + "\n..."
			: text;

	return (
		<div>
			<pre className="max-h-80 overflow-auto whitespace-pre-wrap px-3 py-2 font-mono text-[11px] text-ink-dull">
				{displayText}
			</pre>
			{needsCollapse && (
				<button
					onClick={() => setExpanded(!expanded)}
					className="w-full border-t border-app-line/20 px-3 py-1 text-center text-[11px] text-ink-faint hover:text-ink-dull"
				>
					{expanded ? "Show less" : `Show all ${lines.length} lines`}
				</button>
			)}
		</div>
	);
}

// ---------------------------------------------------------------------------
// Shell result rendering
// ---------------------------------------------------------------------------

function ShellResultView({pair}: {pair: ToolCallPair}) {
	const r = pair.result;

	if (!r || typeof r.exit_code !== "number") {
		return <CollapsiblePre text={pair.resultRaw!} maxLines={30} />;
	}

	const exitCode = r.exit_code as number;
	const stdout = typeof r.stdout === "string" ? r.stdout : "";
	const stderr = typeof r.stderr === "string" ? r.stderr : "";
	const hasStdout = stdout.trim().length > 0;
	const hasStderr = stderr.trim().length > 0;
	const isError = exitCode !== 0;

	if (!hasStdout && !hasStderr && exitCode === 0) {
		return <ResultLine text="Completed with no output" />;
	}

	return (
		<div className="flex flex-col">
			{isError && (
				<div className="flex items-center gap-1.5 border-b border-app-line/20 px-3 py-1.5">
					<span className="rounded bg-red-500/15 px-1.5 py-0.5 font-mono text-[11px] font-medium text-red-400">
						exit {exitCode}
					</span>
				</div>
			)}

			{hasStdout && (
				<div className={hasStderr ? "border-b border-app-line/20" : ""}>
					<CollapsiblePre text={stdout.replace(/\n$/, "")} maxLines={30} />
				</div>
			)}

			{hasStderr && (
				<div>
					<div className="flex items-center gap-1.5 border-b border-app-line/10 px-3 pt-1.5 pb-1">
						<span
							className={clsx(
								"text-[11px] font-medium",
								isError ? "text-red-400/70" : "text-yellow-500/70",
							)}
						>
							stderr
						</span>
					</div>
					<pre
						className={clsx(
							"max-h-40 overflow-auto whitespace-pre-wrap px-3 py-2 font-mono text-[11px]",
							isError ? "text-red-300/60" : "text-yellow-300/50",
						)}
					>
						{stderr.replace(/\n$/, "")}
					</pre>
				</div>
			)}
		</div>
	);
}

// ---------------------------------------------------------------------------
// Status display helpers
// ---------------------------------------------------------------------------

const STATUS_ICONS: Record<ToolCallStatus, string> = {
	running: "\u25B6",
	completed: "\u2713",
	error: "\u2717",
};

const STATUS_COLORS: Record<ToolCallStatus, string> = {
	running: "text-accent",
	completed: "text-status-success",
	error: "text-status-error",
};

function formatToolName(name: string): string {
	const overrides: Record<string, string> = {
		webfetch: "Web Fetch",
		todowrite: "Todo",
		read_skill: "Read Skill",
		web_search: "Web Search",
		spacebot_docs: "Docs",
	};
	if (overrides[name]) return overrides[name];

	const stripped = name
		.replace(/^browser_/, "")
		.replace(/^file_/, "")
		.replace(/^tab_/, "Tab ");

	return stripped
		.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

function toolCategory(name: string): string | null {
	if (name.startsWith("browser_")) return "Browser";
	if (name.startsWith("file_")) return "File";
	return null;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function ToolCall({pair}: {pair: ToolCallPair}) {
	const [expanded, setExpanded] = useState(false);
	const renderer = getRenderer(pair.name);
	const summary = renderer.summary(pair);
	const category = toolCategory(pair.name);
	const displayName = formatToolName(pair.name);

	return (
		<div
			className={clsx(
				"rounded-md border bg-app-dark-box/30",
				pair.status === "error" ? "border-status-error/30" : "border-app-line/50",
			)}
		>
			<button
				onClick={() => setExpanded(!expanded)}
				className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs"
			>
				<span
					className={clsx(
						STATUS_COLORS[pair.status],
						pair.status === "running" ? "animate-pulse" : "",
					)}
				>
					{STATUS_ICONS[pair.status]}
				</span>
				{category && (
					<span className="text-[11px] text-ink-faint">{category}</span>
				)}
				<span className="font-medium text-ink-dull">{displayName}</span>
				{summary && !expanded && (
					<span className="flex-1 truncate text-ink-faint">{summary}</span>
				)}
				{pair.status === "running" && (
					<span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
				)}
			</button>

			{expanded && (
				<div className="border-t border-app-line/30">
					{renderArgs(pair, renderer)}
					{renderResult(pair, renderer)}
				</div>
			)}
		</div>
	);
}

function renderArgs(
	pair: ToolCallPair,
	renderer: ToolRenderer,
): React.ReactNode {
	if (renderer.argsView) {
		const custom = renderer.argsView(pair);
		if (custom) return custom;
	}

	if (pair.args && Object.keys(pair.args).length > 0) {
		return (
			<div className="border-b border-app-line/20 px-3 py-2">
				<div className="flex flex-col gap-0.5">
					{Object.entries(pair.args).map(([key, value]) => (
						<p key={key} className="text-[11px]">
							<span className="text-ink-faint">{key}: </span>
							<span className="text-ink-dull">
								{formatArgValue(key, value)}
							</span>
						</p>
					))}
				</div>
			</div>
		);
	}

	if (pair.argsRaw && pair.argsRaw !== "{}" && pair.argsRaw.trim().length > 0) {
		return (
			<div className="border-b border-app-line/20 px-3 py-2">
				<pre className="max-h-40 overflow-auto font-mono text-[11px] text-ink-dull">
					{pair.argsRaw}
				</pre>
			</div>
		);
	}

	return null;
}

function renderResult(
	pair: ToolCallPair,
	renderer: ToolRenderer,
): React.ReactNode {
	if (pair.status === "running") {
		return (
			<div className="flex items-center gap-2 px-3 py-2 text-[11px] text-ink-faint">
				<span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
				Running...
			</div>
		);
	}

	if (renderer.resultView) {
		const custom = renderer.resultView(pair);
		if (custom !== undefined) return custom;
	}

	if (!pair.resultRaw) return null;

	if (pair.result && Object.keys(pair.result).length > 0) {
		return (
			<div className="px-3 py-2">
				<div className="flex flex-col gap-0.5">
					{Object.entries(pair.result).map(([key, value]) => (
						<p key={key} className="text-[11px]">
							<span className="text-ink-faint">{key}: </span>
							<span className="text-ink-dull">
								{typeof value === "string"
									? truncate(value, 200)
									: JSON.stringify(value)}
							</span>
						</p>
					))}
				</div>
			</div>
		);
	}

	return <CollapsiblePre text={pair.resultRaw} maxLines={20} />;
}

function formatArgValue(key: string, value: unknown): string {
	if (key === "secret" && typeof value === "string") {
		return "***";
	}
	if (typeof value === "string") {
		return truncate(value, 100);
	}
	if (typeof value === "boolean" || typeof value === "number") {
		return String(value);
	}
	return JSON.stringify(value);
}

function truncate(text: string, maxLen: number): string {
	if (text.length <= maxLen) return text;
	return text.slice(0, maxLen) + "...";
}
