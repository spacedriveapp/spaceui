# @spacedrive/explorer

File management and explorer components for SpaceUI.

## Installation

```bash
bun add @spacedrive/explorer @spacedrive/primitives
# or
npm install @spacedrive/explorer @spacedrive/primitives
```

Peer dependencies:
- `react` ^18.0.0 || ^19.0.0
- `react-dom` ^18.0.0 || ^19.0.0
- `@tanstack/react-virtual` ^3.0.0

## Usage

```tsx
import { FileGrid, PathBar, Inspector, KindIcon, TagPill } from '@spacedrive/explorer';
import type { FileInfo, TagInfo } from '@spacedrive/explorer';

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
};

const tag: TagInfo = {
  id: '1',
  name: 'Important',
  color: '#ef4444',
};

function FileBrowser() {
  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <PathBar 
          path={['Home', 'Documents', 'Projects']} 
          onNavigate={(index) => console.log('Navigate to', index)} 
        />
        <div className="mt-4">
          <KindIcon kind="document" />
          <TagPill tag={tag} onRemove={() => console.log('Remove tag')} />
        </div>
      </div>
      <Inspector file={file} tags={[tag]} />
    </div>
  );
}
```

## Components

### Display Components

#### KindIcon

File type icons:

```tsx
import { KindIcon } from '@spacedrive/explorer';
import type { FileKind } from '@spacedrive/explorer';

<KindIcon kind="document" />      {/* Document icon */}
<KindIcon kind="image" />         {/* Image icon */}
<KindIcon kind="video" />         {/* Video icon */}
<KindIcon kind="audio" />         {/* Audio icon */}
<KindIcon kind="archive" />       {/* Archive icon */}
<KindIcon kind="code" />          {/* Code icon */}
<KindIcon kind="unknown" />       {/* Question mark */}
```

Sizes: `sm` | `md` | `lg`

```tsx
<KindIcon kind="image" size="lg" />
```

#### TagPill

Colored tag pill:

```tsx
import { TagPill } from '@spacedrive/explorer';
import type { TagInfo } from '@spacedrive/explorer';

const tag: TagInfo = {
  id: '1',
  name: 'Important',
  color: '#ef4444',  // Any valid CSS color
};

<TagPill tag={tag} />

// With remove button
<TagPill tag={tag} onRemove={() => console.log('Remove')} />
```

#### FileThumb

File thumbnail renderer:

```tsx
import { FileThumb } from '@spacedrive/explorer';
import type { FileInfo } from '@spacedrive/explorer';

const file: FileInfo = {
  id: '1',
  name: 'photo.jpg',
  kind: 'image',
  thumbnailUrl: '/thumbs/photo.jpg',
  // ... other fields
};

<FileThumb file={file} size="sm" />  {/* 32px */}
<FileThumb file={file} size="md" />  {/* 48px */}
<FileThumb file={file} size="lg" />  {/* 64px */}
```

For images with `thumbnailUrl`, displays the image. Otherwise shows kind icon.

### Navigation Components

#### PathBar

Breadcrumb navigation:

```tsx
import { PathBar } from '@spacedrive/explorer';

<PathBar
  path={['Home', 'Documents', 'Projects', 'MyProject']}
  onNavigate={(index) => {
    // index -1 = home, 0 = Home, 1 = Documents, etc.
    console.log('Navigate to level', index);
  }}
  homeLabel="Home"  // Optional, defaults to "Home"
/>
```

Features:
- Home button always shown
- Long paths collapsed with dropdown
- Click any segment to navigate

### File Views

#### FileGrid

Grid layout of files:

```tsx
import { FileGrid } from '@spacedrive/explorer';
import type { FileInfo } from '@spacedrive/explorer';

const files: FileInfo[] = [
  { id: '1', name: 'file1.txt', kind: 'document', /* ... */ },
  { id: '2', name: 'file2.jpg', kind: 'image', /* ... */ },
];

const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

<FileGrid
  files={files}
  selectedIds={selectedIds}
  onFileClick={(file, event) => {
    // Handle selection logic
    console.log('Clicked:', file.name);
  }}
  onFileDoubleClick={(file) => {
    console.log('Open:', file.name);
  }}
/>
```

Features:
- Responsive grid (2-6 columns based on viewport)
- Checkbox selection (appears on hover)
- Thumbnail display
- Multi-select support via `selectedIds`

#### FileList

Table/list layout:

```tsx
import { FileList } from '@spacedrive/explorer';

<FileList
  files={files}
  selectedIds={selectedIds}
  onFileClick={(file, event) => {}}
  onFileDoubleClick={(file) => {}}
  sort={{ field: 'name', direction: 'asc' }}
  onSort={(field) => {
    console.log('Sort by', field);
  }}
/>
```

Columns:
- Name (always visible)
- Size (hidden on mobile)
- Modified date (hidden on mobile)
- Kind (hidden on mobile)

Click column headers to sort.

#### FileRow

Single row (used internally by FileList):

```tsx
import { FileRow } from '@spacedrive/explorer';

<FileRow
  file={file}
  selected={selectedIds.has(file.id)}
  onClick={() => {}}
  onDoubleClick={() => {}}
/>
```

### Inspector Components

#### Inspector

File metadata panel:

```tsx
import { Inspector } from '@spacedrive/explorer';

<Inspector
  file={file}
  tags={tags}
  onTagRemove={(tagId) => console.log('Remove tag', tagId)}
/>
```

Displays:
- File name
- Tags (with remove buttons if `onTagRemove` provided)
- File metadata (kind, size, dates, path)
- Custom metadata from `file.metadata`

#### InspectorPanel

Collapsible section for inspector:

```tsx
import { InspectorPanel } from '@spacedrive/explorer';

<InspectorPanel title="EXIF Data" defaultOpen={true}>
  <dl>
    <dt>Camera</dt>
    <dd>iPhone 14 Pro</dd>
    <dt>Aperture</dt>
    <dd>f/1.78</dd>
  </dl>
</InspectorPanel>
```

### Interaction Components

#### RenameInput

Inline file rename:

```tsx
import { RenameInput } from '@spacedrive/explorer';

<RenameInput
  initialValue="old-filename.txt"
  onRename={(newName) => console.log('Rename to', newName)}
  onCancel={() => console.log('Cancelled')}
/>
```

Features:
- Auto-focused and selected on mount
- Enter to confirm
- Escape to cancel
- Validates extension preservation

#### DragOverlay

Visual feedback during drag:

```tsx
import { DragOverlay } from '@spacedrive/explorer';

<DragOverlay files={draggedFiles} />
```

Shows:
- Stack of thumbnails (up to 3)
- Count badge (+N for more)
- "X items" label

#### QuickPreview

Spacebar preview modal:

```tsx
import { QuickPreview } from '@spacedrive/explorer';

<QuickPreview
  file={selectedFile}
  isOpen={previewOpen}
  onClose={() => setPreviewOpen(false)}
  onNext={() => selectNextFile()}
  onPrevious={() => selectPreviousFile()}
/>
```

Supports:
- Images (with zoom)
- Video (native controls)
- Audio (native controls)
- Other files (placeholder)

Keyboard shortcuts:
- Escape: Close
- Arrow keys: Navigate

## Types

All components export their prop types:

```typescript
import type {
  FileKind,
  FileInfo,
  TagInfo,
  ViewMode,
  SortField,
  SortDirection,
  SortState,
  SelectionState,
} from '@spacedrive/explorer';
```

### FileKind

```typescript
type FileKind = 
  | 'document'
  | 'image'
  | 'video'
  | 'audio'
  | 'archive'
  | 'executable'
  | 'code'
  | 'unknown';
```

### FileInfo

```typescript
interface FileInfo {
  id: string;
  name: string;
  path: string;
  kind: FileKind;
  size: number;
  modifiedAt: Date;
  createdAt: Date;
  thumbnailUrl?: string;
  isDirectory: boolean;
  extension?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}
```

### TagInfo

```typescript
interface TagInfo {
  id: string;
  name: string;
  color: string;
}
```

## Design Principles

1. **Data via props** - Components don't fetch data
2. **Platform-agnostic** - React DOM only, no platform APIs
3. **Virtual-scroll ready** - Works with `@tanstack/react-virtual`
4. **Thumbnail contract** - URL or kind identifier
5. **Callback-driven** - Events via props, not internal state

## Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+

Requires:
- CSS Grid
- CSS Custom Properties
- Intersection Observer (for virtual scrolling)

## License

MIT © Spacedrive
