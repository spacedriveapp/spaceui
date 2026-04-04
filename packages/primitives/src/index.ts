// @spacedrive/primitives
// Faithful extraction of Spacedrive's @sd/ui components

// Button
export { Button, buttonStyles, buttonStyles as buttonVariants } from "./Button";
export type { ButtonProps, LinkButtonProps, ButtonBaseProps } from "./Button";

// Input
export { Input, SearchInput, TextArea, PasswordInput, Label, inputStyles, inputSizes } from "./Input";
export type { InputProps, TextareaProps, InputBaseProps, LabelProps } from "./Input";

// Checkbox
export { CheckBox, RadixCheckbox } from "./Checkbox";
export type { CheckBoxProps, RadixCheckboxProps } from "./Checkbox";
export { CheckboxRoot, CheckboxIndicator } from "./Checkbox";

// Switch
export { Switch } from "./Switch";
export type { SwitchProps } from "./Switch";

// Slider
export { Slider } from "./Slider";

// RadioGroup
export { Root as RadioGroupRoot, Item as RadioGroupItem } from "./RadioGroup";
export type { RootProps as RadioGroupRootProps, ItemProps as RadioGroupItemProps } from "./RadioGroup";

// Dialog
export { Dialog, dialogManager, useDialog, Dialogs } from "./Dialog";
export type { DialogProps, DialogState, DialogOptions, UseDialogProps } from "./Dialog";
export {
	DialogRoot,
	DialogTrigger,
	DialogPortal,
	DialogClose,
	DialogOverlay,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
	DialogDescription,
} from "./Dialog";

// Popover (Radix composable)
export { Popover, usePopover, PopoverRoot, PopoverTrigger, PopoverContent, PopoverAnchor, PopoverClose, PopoverPortal } from "./Popover";

// Tooltip
export { Tooltip, TooltipProvider, Kbd } from "./Tooltip";
export type { TooltipProps } from "./Tooltip";
export { TooltipRoot, TooltipTrigger, TooltipPortal, TooltipContent } from "./Tooltip";

// Tabs
export { Root as TabsRoot, List as TabsList, Trigger as TabsTrigger, Content as TabsContent } from "./Tabs";

// DropdownMenu (Radix composable)
export {
	DropdownMenu,
	DropdownMenuRoot, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
	DropdownMenuCheckboxItem, DropdownMenuRadioItem, DropdownMenuLabel,
	DropdownMenuSeparator, DropdownMenuGroup, DropdownMenuPortal,
	DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuRadioGroup,
} from "./DropdownMenu";

// ContextMenu (Radix with custom object API)
export { ContextMenu, ContextMenuDivItem, useContextMenuContext, contextMenuClassNames, contextMenuItemClassNames, contextMenuSeparatorClassNames } from "./ContextMenu";
export type { ContextMenuItemProps, ContextMenuCheckboxItemProps } from "./ContextMenu";

// Dropdown (Headless UI)
export * as Dropdown from "./Dropdown";

// Select
export { Select, SelectOption, selectStyles } from "./Select";
export type { SelectProps } from "./Select";
export {
	SelectRoot,
	SelectGroup,
	SelectValue,
	SelectTrigger,
	SelectContent,
	SelectLabel,
	SelectItem,
	SelectSeparator,
	SelectScrollUpButton,
	SelectScrollDownButton,
} from "./Select";

// SelectPill
export { SelectPill, selectPillStyles } from "./SelectPill";
export type { SelectPillProps } from "./SelectPill";

// Toast (Sonner-based)
export { toast, Toaster, TOAST_TIMEOUT } from "./Toast";
export type { ToastId, ToastMessage } from "./Toast";

// Loader
export { Loader } from "./Loader";

// Divider
export { Divider } from "./Divider";

// ProgressBar
export { ProgressBar } from "./ProgressBar";
export type { ProgressBarProps } from "./ProgressBar";

// CircularProgress
export { CircularProgress } from "./CircularProgress";
export type { CircularProgressProps } from "./CircularProgress";

// SearchBar
export { SearchBar } from "./SearchBar";

// Shortcut
export { Shortcut } from "./Shortcut";
export type { ShortcutProps } from "./Shortcut";

// CircleButton (formerly TopBarButton)
export { CircleButton, circleButtonStyles } from "./CircleButton";
export type { CircleButtonProps } from "./CircleButton";
export { CircleButtonGroup } from "./CircleButtonGroup";
export type { CircleButtonGroupProps } from "./CircleButtonGroup";

// TabBar
export { TabBar, TabBarItem } from "./TabBar";
export type { TabBarProps, TabBarItemProps } from "./TabBar";

// Backward-compat aliases
export { CircleButton as TopBarButton } from "./CircleButton";
export { CircleButtonGroup as TopBarButtonGroup } from "./CircleButtonGroup";

// Shiny components
export { ShinyButton } from "./ShinyButton";
export type { ShinyButtonProps } from "./ShinyButton";
export { ShinyToggle } from "./ShinyToggle";

// InfoBanner
export { InfoBanner, InfoBannerText, InfoBannerSubtext } from "./InfoBanner";

// Layout
export { Card as LayoutCard, GridLayout } from "./Layout";

// Card (Spacebot-origin)
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "./Card";

// Typography
export { CategoryHeading, ScreenHeading } from "./Typography";

// Resizable
export { Resizable, ResizablePanel, ResizableHandle, useResizableContext } from "./Resizable";

// Keys
export { ModifierKeys, EditingKeys, UIKeys, NavigationKeys, modifierSymbols, keySymbols } from "./keys";
export type { OSforKeys } from "./keys";

// Utilities
export { tw } from "./utils";

// Forms
export { Form, ErrorMessage, errorStyles, z } from "./forms/Form";
export type { FormProps, ErrorMessageProps } from "./forms/Form";

// SpaceItem (sidebar/list item with polymorphic icon)
export { SpaceItem } from "./SpaceItem";
export type { SpaceItemProps } from "./SpaceItem";

// Spacebot-origin components (kept from original extraction, audit pending)
export { Badge, badgeVariants } from "./Badge";
export { Banner, bannerVariants } from "./Banner";
export { ToggleGroup } from "./ToggleGroup";
export { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./Collapsible";
export { NumberStepper } from "./NumberStepper";
export { FilterButton } from "./FilterButton";
export { OptionList, OptionListItem } from "./OptionList";
export { SelectTriggerButton } from "./SelectTriggerButton";
