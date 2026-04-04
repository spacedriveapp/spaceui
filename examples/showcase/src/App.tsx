import { useState } from 'react'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@spacedrive/primitives'
import { ToolCall, Markdown, ChatComposer, ModelSelect, ConnectionStatus, ProfileAvatar, AgentSelector, TaskCard, MemoryList, CronJobList, AutonomyPanel } from '@spacedrive/ai'
import { FileGrid, FileList, PathBar, KindIcon, TagPill, FileThumb, Inspector } from '@spacedrive/explorer'
import { InputField, CheckboxField, SelectField } from '@spacedrive/forms'
import type { ToolCallPair, TaskInfo, MemoryInfo, CronJobInfo, AgentInfo, ModelOption } from '@spacedrive/ai'
import type { FileInfo, TagInfo } from '@spacedrive/explorer'

function App() {
  const [activeTab, setActiveTab] = useState('primitives')

  // Sample data for demos
  const toolCall: ToolCallPair = {
    id: '1',
    name: 'file_read',
    argsRaw: '{"path": "/docs/readme.md"}',
    args: { path: '/docs/readme.md' },
    resultRaw: '{"content": "# Hello World"}',
    result: { content: '# Hello World' },
    status: 'completed',
  }

  const task: TaskInfo = {
    id: '1',
    title: 'Review pull request #42',
    status: 'in_progress',
    priority: 'high',
    assignees: ['Alice', 'Bob'],
  }

  const memory: MemoryInfo = {
    id: '1',
    type: 'conversation',
    content: 'Discussed the new SpaceUI design system architecture with the team...',
    source: 'Slack #design',
    edges: [{ target: '2', relation: 'related' }],
  }

  const cronJob: CronJobInfo = {
    id: '1',
    name: 'Daily backup',
    schedule: '0 2 * * *',
    last_run: '2024-03-24T02:00:00Z',
    next_run: '2024-03-25T02:00:00Z',
    status: 'active',
  }

  const agent: AgentInfo = {
    id: '1',
    name: 'Dev Assistant',
    detail: 'Helps with code reviews',
    status: 'online',
  }

  const model: ModelOption = {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'OpenAI',
    context_window: 8192,
    capabilities: ['tools', 'reasoning'],
  }

  const file: FileInfo = {
    id: '1',
    name: 'document.pdf',
    path: '/docs/document.pdf',
    kind: 'document',
    size: 1024000,
    modifiedAt: new Date(),
    createdAt: new Date(),
    isDirectory: false,
    extension: 'pdf',
  }

  const tag: TagInfo = {
    id: '1',
    name: 'Important',
    color: '#ef4444',
  }

  return (
    <TooltipProvider>
      <div className="p-8 max-w-6xl mx-auto space-y-8">
        <header className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold text-ink">SpaceUI Showcase</h1>
            <Badge variant="default">v0.0.1</Badge>
          </div>
          <p className="text-ink-dull">
            A demonstration of all SpaceUI components across primitives, AI, and explorer packages.
          </p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="primitives">Primitives</TabsTrigger>
            <TabsTrigger value="ai">AI Components</TabsTrigger>
            <TabsTrigger value="explorer">Explorer</TabsTrigger>
            <TabsTrigger value="forms">Forms</TabsTrigger>
            <TabsTrigger value="playground">Playground</TabsTrigger>
          </TabsList>

          <TabsContent value="primitives" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Buttons</CardTitle>
                <CardDescription>Various button styles and states</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button loading>Loading</Button>
                <Button size="sm">Small</Button>
                <Button size="lg">Large</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Badges</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="destructive">Error</Badge>
                <Badge variant="outline">Outline</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Input & Select</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Enter text..." />
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Option 1</SelectItem>
                    <SelectItem value="2">Option 2</SelectItem>
                    <SelectItem value="3">Option 3</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dialog</CardTitle>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Open Dialog</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button variant="destructive">Delete</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tooltip</CardTitle>
              </CardHeader>
              <CardContent>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button>Hover me</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This is a tooltip!</p>
                  </TooltipContent>
                </Tooltip>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>ToolCall</CardTitle>
              </CardHeader>
              <CardContent>
                <ToolCall toolCall={toolCall} expanded />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Markdown</CardTitle>
              </CardHeader>
              <CardContent>
                <Markdown content={`# Hello World

This is **bold** and *italic* text.

- Item 1
- Item 2
- Item 3

\`\`\`typescript
const greeting = "Hello";
console.log(greeting);
\`\`\`
`} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>TaskCard</CardTitle>
              </CardHeader>
              <CardContent>
                <TaskCard task={task} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>MemoryList</CardTitle>
              </CardHeader>
              <CardContent>
                <MemoryList memories={[memory]} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ConnectionStatus</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <ConnectionStatus status="connected" />
                <ConnectionStatus status="connecting" />
                <ConnectionStatus status="offline" />
                <ConnectionStatus status="error" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ProfileAvatar</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-4">
                <ProfileAvatar seed="user1" name="John Doe" size="sm" />
                <ProfileAvatar seed="user2" name="Jane Smith" size="md" />
                <ProfileAvatar seed="user3" name="Bob Wilson" size="lg" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ChatComposer</CardTitle>
              </CardHeader>
              <CardContent>
                <ChatComposer
                  value=""
                  onChange={() => {}}
                  onSend={() => {}}
                  models={[model]}
                  selectedModel="gpt-4"
                  onModelChange={() => {}}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="explorer" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>KindIcon</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-4">
                <KindIcon kind="document" />
                <KindIcon kind="image" />
                <KindIcon kind="video" />
                <KindIcon kind="audio" />
                <KindIcon kind="code" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>TagPill</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-2">
                <TagPill tag={tag} />
                <TagPill tag={{ ...tag, name: 'Review', color: '#3b82f6' }} />
                <TagPill tag={{ ...tag, name: 'Done', color: '#22c55e' }} onRemove={() => {}} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>PathBar</CardTitle>
              </CardHeader>
              <CardContent>
                <PathBar
                  path={['Home', 'Documents', 'Projects', 'spaceui', 'src']}
                  onNavigate={(index) => console.log('Navigate to', index)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>FileThumb</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-4">
                <FileThumb file={file} size="sm" />
                <FileThumb file={file} size="md" />
                <FileThumb file={file} size="lg" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inspector</CardTitle>
              </CardHeader>
              <CardContent>
                <Inspector file={file} tags={[tag]} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forms" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Form Fields</CardTitle>
                <CardDescription>Form components built on react-hook-form</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Input Field</label>
                  <Input placeholder="Type something..." />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Field</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a">Option A</SelectItem>
                      <SelectItem value="b">Option B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button>Submit Form</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="playground" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Component Playground</CardTitle>
                <CardDescription>Mix and match components here</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-app-box rounded-lg">
                  <ProfileAvatar seed="agent1" name="AI Agent" />
                  <div className="flex-1">
                    <p className="font-medium">AI Assistant</p>
                    <ConnectionStatus status="connected" showLabel={false} />
                  </div>
                  <Button variant="ghost" size="sm">
                    Settings
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <TaskCard task={task} />
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <FileThumb file={file} size="sm" />
                        <span className="text-sm">{file.name}</span>
                        <TagPill tag={tag} />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  )
}

export default App
