# SpaceUI Component Audit

Assessment of spaceui components vs the real Spacedrive implementations. Generated 2026-03-26.

Use this to track migration progress as components are faithfully rebuilt from the real codebase.

**Real Spacedrive UI source:** `spacedrive/packages/ui/src/`
**Real Spacedrive Explorer source:** `spacedrive/packages/interface/src/components/Explorer/`
**SpaceUI source:** `spaceui/packages/`

---

## Primitives (`@spacedrive/primitives`)

### Good — Worth keeping, minor fixes needed

| Component | Accuracy | Real Source | Status | Notes |
|---|---|---|---|---|
| Divider | 95% | `ui/src/Divider.tsx` | ✅ Keep | Nearly identical, real is simplified |
| Switch | 85% | `ui/src/Switch.tsx` | ✅ Keep | Structure matches, minor styling diffs |
| Checkbox | 80% | `ui/src/CheckBox.tsx` | ✅ Keep | Core matches, real has extended RadixCheckbox variant |
| Tooltip | 75% | `ui/src/Tooltip.tsx` | ✅ Keep | Core matches, real adds keybind display |
| Button | 72% | `ui/src/Button.tsx` | 🔧 Fix | Missing link mode, real has 9 variants (subtle, gray, accent, colored, bare) |
| RadioGroup | 70% | `ui/src/RadioGroup.tsx` | 🔧 Fix | Core Radix usage matches, layout/wrapper differs |

### Mediocre — Needs rework from real source

| Component | Accuracy | Real Source | Status | Notes |
|---|---|---|---|---|
| Tabs | 65% | `ui/src/Tabs.tsx` | 🔨 Rework | Real is minimalist tw() wrapper, spaceui is over-styled |
| Slider | 60% | `ui/src/Slider.tsx` | 🔨 Rework | Core Radix matches, features differ |
| Select | 50% | `ui/src/Select.tsx` | 🔨 Rework | Real is wrapped controlled component, spaceui exports raw Radix |
| SearchBar | 50% | `ui/src/SearchBar.tsx` | 🔨 Rework | Real has clear button, sidebar colors, backdrop blur |
| Dropdown | 50% | `ui/src/Dropdown.tsx` | 🔨 Rework | Real uses Headless UI, spaceui is custom |
| Input | 45% | `ui/src/Input.tsx` | 🔨 Rework | Real has 5 sizes, icon support, icon positioning, SearchInput, PasswordInput, TextArea |
| Popover | 40% | `ui/src/Popover.tsx` | 🔨 Rework | Real is hook-based (usePopover), spaceui is compositional Radix |
| Loader | 40% | `ui/src/Loader.tsx` | 🔨 Rework | Real uses react-loading-icons Puff, spaceui is custom spinner |

### Bad — Rebuild from scratch using real source

| Component | Accuracy | Real Source | Status | Notes |
|---|---|---|---|---|
| Dialog | 35% | `ui/src/Dialog.tsx` | ❌ Rebuild | Real has imperative DialogManager class, useDialog hook, form integration, react-spring animations. Completely different architecture. |
| ProgressBar | 30% | `ui/src/ProgressBar.tsx` | ❌ Rebuild | Incompatible props (value/max vs value/total or percent), missing indeterminate/pending state |
| Toast | 25% | `ui/src/Toast.tsx` | ❌ Rebuild | Real uses Sonner library with promise toasts, actions, cancel buttons, loading states |
| CircularProgress | 20% | `ui/src/CircularProgress.tsx` | ❌ Rebuild | Real adapted from react-customizable-progressbar with 24+ props |
| ContextMenu | 15% | `ui/src/ContextMenu.tsx` | ❌ Rebuild | Real wraps Radix with custom object API, cva variants (danger/dull), keybind rendering |
| DropdownMenu | 10% | `ui/src/DropdownMenu.tsx` | ❌ Rebuild | Real is custom framer-motion implementation, NOT Radix. Completely different. |

### Fabricated — No real equivalent, delete or design fresh

| Component | Notes |
|---|---|
| Badge | Does not exist in real Spacedrive UI |
| Card | Does not exist in real Spacedrive UI |
| Banner | Does not exist in real Spacedrive UI |
| ToggleGroup | Does not exist in real Spacedrive UI |
| Collapsible | Does not exist in real Spacedrive UI |
| Resizable | Does not exist in real Spacedrive UI |
| NumberStepper | Does not exist in real Spacedrive UI |
| FilterButton | Does not exist in real Spacedrive UI |
| SelectTriggerButton | Does not exist in real Spacedrive UI |
| OptionList | Does not exist in real Spacedrive UI |

---

## Explorer (`@spacedrive/explorer`)

### Done — faithful to real Spacedrive

| Component | Real Source | Status | Notes |
|---|---|---|---|
| TagPill | `interface/src/components/Tags/TagPill.tsx` | ✅ Done | Faithful: color+children API, sizes, color dot, remove button |
| RenameInput | `interface/src/routes/explorer/components/InlineNameEdit.tsx` | ✅ Done | Faithful: generic (no File type), extension handling, async save, blur cancels |

### Removed — too large/complex for a UI library, belong in @sd/interface

| Component | Reason |
|---|---|
| FileList | TanStack Virtual + Table, column resizing, keyboard nav — app-level |
| FileRow | Table integration, drag-drop, inline rename — app-level |
| FileGrid | Virtualization, dnd-kit, context menus — app-level |
| PathBar | SdPath, device system, routing, animations — app-level |
| DragOverlay | Integrated into DndProvider — app-level |
| FileThumb | Sidecar system, caching, video scrubber — app-level |
| Inspector | Polymorphic variants, deeply tied to data types — app-level |
| QuickPreview | Standalone Tauri window — app-level |
| KindIcon | Rust-generated asset system — app-level |
| InspectorPanel | Didn't exist in real app — deleted |

---

## AI (`@spacedrive/ai`)

Not audited yet. These components were extracted from the Spacebot interface and may be more accurate since they were built recently. Audit when ready to integrate.

---

## Migration Checklist

### Phase 1 — Fix the good ones
- [ ] Button — add missing variants (subtle, gray, accent, colored, bare), add link mode
- [ ] Checkbox — add RadixCheckbox extended variant
- [ ] Tooltip — add keybind display support
- [ ] RadioGroup — match real wrapper/layout pattern
- [ ] TagPill — align props API (color+children vs tag object)
- [ ] RenameInput — add extension handling, async save, blur cancellation

### Phase 2 — Rework the mediocre ones
- [ ] Input — rebuild with sizes, icon support, SearchInput, PasswordInput, TextArea
- [ ] Select — rebuild as wrapped controlled component
- [ ] Dialog — rebuild with DialogManager, useDialog, form integration
- [ ] DropdownMenu — rebuild as custom framer-motion (not Radix)
- [ ] ContextMenu — rebuild with custom object API, cva variants
- [ ] Toast — rebuild with Sonner integration
- [ ] Popover — rebuild with usePopover hook pattern
- [ ] SearchBar — rebuild with clear button, sidebar colors
- [ ] Loader — decide: keep custom or switch to react-loading-icons
- [ ] Tabs — simplify to match real minimal wrapper
- [ ] Slider — align features
- [ ] Dropdown — rebuild on Headless UI
- [ ] ProgressBar — rebuild with Radix, indeterminate state
- [ ] CircularProgress — rebuild or adopt library

### Phase 3 — Rebuild explorer components
- [ ] KindIcon — integrate with @sd/assets icon system
- [ ] FileThumb — sidecar system, caching, thumbnails
- [ ] FileGrid — TanStack Virtual, dnd-kit, context menus
- [ ] FileList — TanStack Virtual + Table, column resizing
- [ ] FileRow — table integration, drag-drop, inline rename
- [ ] PathBar — animated modes, editable paths, SdPath
- [ ] Inspector — polymorphic variant system
- [ ] QuickPreview — decide: modal vs window approach for spaceui
- [ ] DragOverlay — polymorphic preview types
- [ ] Delete InspectorPanel

### Phase 4 — Clean up fabricated components
- [ ] Decide which fabricated components to keep as new additions (Badge, Card, Banner may be useful)
- [ ] Delete the rest
