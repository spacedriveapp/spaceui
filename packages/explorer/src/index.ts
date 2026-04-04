// @spacedrive/explorer — presentational file management components
//
// These are dumb components: props-in, callbacks-out, no data fetching,
// no context, no business logic. Consumers wire up their own state.

export { TagPill } from "./TagPill";
export type { TagPillProps } from "./TagPill";

export { RenameInput } from "./RenameInput";
export type { RenameInputProps } from "./RenameInput";

export { FileThumb } from "./FileThumb";
export type { FileThumbProps, IconSource } from "./FileThumb";

export { GridItem } from "./GridItem";
export type { GridItemProps, GridItemTag } from "./GridItem";
