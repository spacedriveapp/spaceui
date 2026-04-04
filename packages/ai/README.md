# @spacedrive/ai

AI agent interaction components for SpaceUI.

## Installation

```bash
bun add @spacedrive/ai @spacedrive/primitives
# or
npm install @spacedrive/ai @spacedrive/primitives
```

Peer dependencies:
- `react` ^18.0.0 || ^19.0.0
- `react-dom` ^18.0.0 || ^19.0.0
- `@tanstack/react-query` ^5.0.0
- `@tanstack/react-virtual` ^3.0.0

Optional dependencies:
- `@react-sigma/core`, `sigma`, `graphology` (for MemoryGraph)
- `@dnd-kit/core`, `@dnd-kit/sortable` (for TaskBoard drag-and-drop)

## Usage

```tsx
import { ToolCall, Markdown, ChatComposer, TaskCard, ConnectionStatus } from '@spacedrive/ai';
import type { ToolCallPair, TaskInfo } from '@spacedrive/ai';

function AgentInterface() {
  const toolCall: ToolCallPair = {
    id: '1',
    name: 'file_read',
    argsRaw: '{"path": "/docs/readme.md"}',
    args: { path: '/docs/readme.md' },
    resultRaw: '{"content": "# Hello"}',
    result: { content: '# Hello' },
    status: 'completed',
  };

  const task: TaskInfo = {
    id: '1',
    title: 'Review code',
    status: 'in_progress',
    priority: 'high',
    assignees: ['agent-1'],
  };

  return (
    <div className="space-y-4">
      <ConnectionStatus status="connected" />
      <ToolCall toolCall={toolCall} expanded />
      <TaskCard task={task} />
    </div>
  );
}
```

## Components

### Core AI Components

#### ToolCall

Display tool invocations with arguments and results:

```tsx
import { ToolCall } from '@spacedrive/ai';
import type { ToolCallPair } from '@spacedrive/ai';

const toolCall: ToolCallPair = {
  id: '1',
  name: 'search_files',
  argsRaw: '{"query": "*.ts"}',
  args: { query: '*.ts' },
  resultRaw: '{"count": 42}',
  result: { count: 42 },
  status: 'completed', // 'running' | 'completed' | 'error'
};

<ToolCall 
  toolCall={toolCall} 
  expanded={true}  // Show full details
  onToggle={() => {}}  // Toggle expansion
/>
```

#### Markdown

Render agent responses with proper styling:

```tsx
import { Markdown } from '@spacedrive/ai';

<Markdown content={`# Response

Here's what I found:
- Item 1
- Item 2

\`\`\`typescript
const x = 1;
\`\`\`
`} />
```

Features:
- GitHub Flavored Markdown
- Syntax highlighting ready
- Semantic color styling
- Raw HTML support

### Chat Components

#### ChatComposer

Message input with model selection:

```tsx
import { useState } from 'react';
import { ChatComposer, ModelSelect } from '@spacedrive/ai';
import type { ModelOption } from '@spacedrive/ai';

const models: ModelOption[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'OpenAI',
    context_window: 8192,
    capabilities: ['tools', 'reasoning'],
  },
];

function Chat() {
  const [message, setMessage] = useState('');
  const [model, setModel] = useState('gpt-4');

  return (
    <ChatComposer
      value={message}
      onChange={setMessage}
      onSend={() => console.log('Send:', message)}
      models={models}
      selectedModel={model}
      onModelChange={setModel}
      onVoiceClick={() => console.log('Voice input')}
    />
  );
}
```

#### ModelSelect

LLM model picker with search:

```tsx
<ModelSelect
  models={models}
  value={selectedModel}
  onChange={setSelectedModel}
  placeholder="Select a model..."
/>
```

### Task Management

#### TaskCard

Individual task display:

```tsx
import { TaskCard } from '@spacedrive/ai';
import type { TaskInfo } from '@spacedrive/ai';

const task: TaskInfo = {
  id: '1',
  title: 'Implement feature',
  status: 'in_progress',
  priority: 'high',
  assignees: ['agent-1', 'agent-2'],
  conversation_id: 'conv-123',
};

<TaskCard 
  task={task} 
  onClick={() => console.log('Open task')}
/>
```

#### TaskBoard

Kanban board with columns:

```tsx
import { TaskBoard } from '@spacedrive/ai';

const tasks: TaskInfo[] = [
  { id: '1', title: 'Task 1', status: 'backlog', priority: 'medium', assignees: [] },
  { id: '2', title: 'Task 2', status: 'in_progress', priority: 'high', assignees: [] },
];

<TaskBoard
  tasks={tasks}
  onTaskMove={(taskId, newStatus) => {
    console.log(`Move ${taskId} to ${newStatus}`);
  }}
  onTaskClick={(task) => {
    console.log('Clicked:', task);
  }}
/>
```

### Memory Components

#### MemoryList

List view of agent memories:

```tsx
import { MemoryList } from '@spacedrive/ai';
import type { MemoryInfo } from '@spacedrive/ai';

const memories: MemoryInfo[] = [
  {
    id: '1',
    type: 'conversation',
    content: 'Discussed architecture...',
    source: 'Slack',
    edges: [{ target: '2', relation: 'related' }],
  },
];

<MemoryList
  memories={memories}
  onMemoryClick={(memory) => console.log(memory)}
  onMemoryDelete={(memory) => console.log('Delete:', memory.id)}
/>
```

#### MemoryGraph

Graph visualization (lazy-loaded):

```tsx
import { MemoryGraph } from '@spacedrive/ai';

<MemoryGraph
  memories={memories}
  onNodeClick={(memory) => console.log(memory)}
/>
```

### Agent Components

#### AgentSelector

Agent switching dropdown:

```tsx
import { AgentSelector } from '@spacedrive/ai';
import type { AgentInfo } from '@spacedrive/ai';

const agents: AgentInfo[] = [
  { id: '1', name: 'Dev Assistant', detail: 'Code review', status: 'online' },
  { id: '2', name: 'Doc Writer', detail: 'Documentation', status: 'busy' },
];

<AgentSelector
  agents={agents}
  value={selectedAgent}
  onChange={setSelectedAgent}
/>
```

#### ProfileAvatar

Deterministic avatar from seed:

```tsx
import { ProfileAvatar } from '@spacedrive/ai';

// Generates gradient based on seed
<ProfileAvatar seed="user123" name="John Doe" size="md" />

// With image
<ProfileAvatar 
  seed="user456" 
  name="Jane Smith" 
  imageUrl="/avatars/jane.jpg"
  size="lg" 
/>
```

### Status Components

#### ConnectionStatus

Connection state indicator:

```tsx
import { ConnectionStatus } from '@spacedrive/ai';

<ConnectionStatus status="connected" />
<ConnectionStatus status="connecting" />
<ConnectionStatus status="offline" />
<ConnectionStatus status="error" />
```

### Schedule Components

#### CronJobList

Cron job management:

```tsx
import { CronJobList } from '@spacedrive/ai';
import type { CronJobInfo } from '@spacedrive/ai';

const jobs: CronJobInfo[] = [
  {
    id: '1',
    name: 'Daily backup',
    schedule: '0 2 * * *',
    last_run: '2024-03-24T02:00:00Z',
    next_run: '2024-03-25T02:00:00Z',
    status: 'active',
  },
];

<CronJobList
  jobs={jobs}
  onCreateJob={() => console.log('Create job')}
  onToggleJob={(id, enabled) => console.log(id, enabled)}
/>
```

#### AutonomyPanel

Autonomy level control:

```tsx
import { AutonomyPanel } from '@spacedrive/ai';

<AutonomyPanel
  currentLevel="assisted"
  onLevelChange={(level) => console.log('New level:', level)}
  pendingApprovals={[
    { id: '1', action: 'Delete file', reason: 'User request', timestamp: '2024-03-25T10:00:00Z' },
  ]}
  onApprove={(id) => console.log('Approve:', id)}
  onDeny={(id) => console.log('Deny:', id)}
/>
```

## Types

All components export their prop types:

```typescript
import type {
  ToolCallPair,
  ToolCallStatus,
  TranscriptStep,
  TaskInfo,
  MemoryInfo,
  CronJobInfo,
  AgentInfo,
  ModelOption,
} from '@spacedrive/ai';
```

### Utility Functions

#### pairTranscriptSteps

Pairs action and result steps for display:

```typescript
import { pairTranscriptSteps } from '@spacedrive/ai';
import type { TranscriptStep } from '@spacedrive/ai';

const steps: TranscriptStep[] = [
  { type: 'action', call_id: '1', name: 'read', content: [], text: '' },
  { type: 'tool_result', call_id: '1', name: 'read', content: [], text: 'Done' },
];

const pairs = pairTranscriptSteps(steps);
// [[action, result], [null, null], ...]
```

## Design Principles

1. **Data via props** - No internal data fetching
2. **Callbacks for events** - `onSend`, `onCancel`, etc.
3. **Layout-agnostic** - Use flex/grid, container constrains
4. **Lazy-loadable** - Heavy components code-split
5. **Types co-located** - Export prop interfaces

## License

MIT © Spacedrive
