// Tool execution types
export type ToolCallStatus = 'running' | 'completed' | 'error';

export interface ToolCallPair {
	id: string;
	name: string;
	argsRaw: string;
	args: Record<string, unknown> | null;
	resultRaw: string | null;
	result: Record<string, unknown> | null;
	status: ToolCallStatus;
	/** Human-readable summary provided by live opencode parts */
	title?: string | null;
}

// Transcript step types — discriminated union matching the real API schema

export type ActionContent =
	| { type: 'text'; text: string }
	| { type: 'tool_call'; id: string; name: string; args: string };

export type TranscriptStep =
	| { type: 'action'; content: ActionContent[] }
	| { type: 'user_text'; text: string }
	| { type: 'system_text'; text: string }
	| { type: 'tool_result'; call_id: string; name: string; text: string };

// Paired transcript item for rendering

export type TranscriptItem =
	| { kind: 'text'; text: string }
	| { kind: 'tool'; pair: ToolCallPair };

// Domain objects
export interface TaskInfo {
	id: string;
	title: string;
	status: string;
	priority: string;
	assignees: string[];
	conversation_id?: string;
}

export interface MemoryInfo {
	id: string;
	type: string;
	content: string;
	source?: string;
	edges?: Array<{ target: string; relation: string }>;
}

export interface CronJobInfo {
	id: string;
	name: string;
	schedule: string;
	last_run?: string;
	next_run?: string;
	status: string;
}

export interface AgentInfo {
	id: string;
	name: string;
	detail: string;
	status?: string;
}

export interface ModelOption {
	id: string;
	name: string;
	provider: string;
	context_window?: number;
	capabilities?: string[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function tryParseJson(text: string): Record<string, unknown> | null {
	if (!text || text.trim().length === 0) return null;
	try {
		const parsed = JSON.parse(text);
		if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
			return parsed as Record<string, unknown>;
		}
		return null;
	} catch {
		return null;
	}
}

export function isErrorResult(
	text: string,
	parsed: Record<string, unknown> | null
): boolean {
	if (parsed?.error) return true;
	if (parsed?.status === 'error') return true;
	if (parsed?.success === false) return true;
	if (typeof parsed?.exit_code === 'number' && parsed.exit_code !== 0) return true;
	const lower = text.toLowerCase();
	return (
		lower.startsWith('error:') ||
		lower.startsWith('error -') ||
		lower.startsWith('failed:') ||
		lower.startsWith('toolset error:')
	);
}

// ---------------------------------------------------------------------------
// Transcript → TranscriptItem[] pairing
// ---------------------------------------------------------------------------

/**
 * Walk a flat TranscriptStep[] and pair each tool_call with its tool_result
 * via call_id matching, plus emit standalone text steps. Returns an ordered
 * list of renderable items: text blocks and paired tool calls.
 */
export function pairTranscriptSteps(steps: TranscriptStep[]): TranscriptItem[] {
	const items: TranscriptItem[] = [];
	const resultsById = new Map<string, { name: string; text: string }>();

	// First pass: index all tool_result steps by call_id
	for (const step of steps) {
		if (step.type === 'tool_result') {
			resultsById.set(step.call_id, { name: step.name, text: step.text });
		}
	}

	// Second pass: emit items in order
	for (const step of steps) {
		if (step.type === 'action') {
			for (const content of step.content) {
				if (content.type === 'text') {
					items.push({ kind: 'text', text: content.text });
				} else if (content.type === 'tool_call') {
					const result = resultsById.get(content.id);
					const parsedArgs = tryParseJson(content.args);
					const parsedResult = result ? tryParseJson(result.text) : null;

					const hasError = result
						? isErrorResult(result.text, parsedResult)
						: false;

					items.push({
						kind: 'tool',
						pair: {
							id: content.id,
							name: content.name,
							argsRaw: content.args,
							args: parsedArgs,
							resultRaw: result?.text ?? null,
							result: parsedResult,
							status: result
								? hasError
									? 'error'
									: 'completed'
								: 'running',
						},
					});
				}
			}
		}
	}

	return items;
}
