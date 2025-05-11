import * as ComboboxPrimitive from "@diceui/combobox";
import { Check, ChevronDown, X } from "lucide-react";
import * as React from "react";

import { cn } from "@workspace/ui/lib/utils";

const Combobox = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.Root
    data-slot="combobox"
    ref={ref}
    className={cn(className)}
    {...props}
  />
)) as ComboboxPrimitive.ComboboxRootComponentProps;
Combobox.displayName = ComboboxPrimitive.Root.displayName;

const ComboboxLabel = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Label>
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.Label
    data-slot="combobox-label"
    ref={ref}
    className={cn("px-0.5 py-1.5 font-semibold text-sm", className)}
    {...props}
  />
));
ComboboxLabel.displayName = ComboboxPrimitive.Label.displayName;

const ComboboxAnchor = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.Anchor>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Anchor>
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.Anchor
    data-slot="combobox-anchor"
    ref={ref}
    className={cn(
      "relative flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 shadow-xs data-focused:ring-1 data-focused:ring-ring",
      className,
    )}
    {...props}
  />
));
ComboboxAnchor.displayName = ComboboxPrimitive.Anchor.displayName;

const ComboboxInput = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Input>
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.Input
    data-slot="combobox-input"
    ref={ref}
    className={cn(
      "flex h-9 w-full rounded-md bg-transparent text-base placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      className,
    )}
    {...props}
  />
));
ComboboxInput.displayName = ComboboxPrimitive.Input.displayName;

const ComboboxTrigger = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <ComboboxPrimitive.Trigger
    data-slot="combobox-trigger"
    ref={ref}
    className={cn(
      "flex shrink-0 items-center justify-center rounded-r-md border-input bg-transparent text-muted-foreground transition-colors hover:text-foreground/80 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  >
    {children || <ChevronDown className="h-4 w-4" />}
  </ComboboxPrimitive.Trigger>
));
ComboboxTrigger.displayName = ComboboxPrimitive.Trigger.displayName;

const ComboboxCancel = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.Cancel
    data-slot="combobox-cancel"
    ref={ref}
    className={cn(
      "-translate-y-1/2 absolute top-1/2 right-1 flex h-6 w-6 items-center justify-center rounded-sm bg-background opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
      className,
    )}
    {...props}
  />
));
ComboboxCancel.displayName = ComboboxPrimitive.Cancel.displayName;

const ComboboxBadgeList = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.BadgeList>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.BadgeList>
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.BadgeList
    data-slot="combobox-badge-list"
    ref={ref}
    className={cn("flex flex-wrap items-center gap-1.5", className)}
    {...props}
  />
));
ComboboxBadgeList.displayName = ComboboxPrimitive.BadgeList.displayName;

const ComboboxBadgeItem = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.BadgeItem>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.BadgeItem>
>(({ className, children, ...props }, ref) => (
  <ComboboxPrimitive.BadgeItem
    data-slot="combobox-badge-item"
    ref={ref}
    className={cn(
      "inline-flex items-center justify-between gap-1 rounded-sm bg-secondary px-2 py-0.5",
      className,
    )}
    {...props}
  >
    <span className="truncate text-[13px] text-secondary-foreground">
      {children}
    </span>
    <ComboboxPrimitive.BadgeItemDelete
      data-slot="combobox-badge-item-delete"
      className="shrink-0 rounded p-0.5 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring data-highlighted:bg-destructive"
    >
      <X className="h-3 w-3" />
    </ComboboxPrimitive.BadgeItemDelete>
  </ComboboxPrimitive.BadgeItem>
));
ComboboxBadgeItem.displayName = ComboboxPrimitive.BadgeItem.displayName;

const ComboboxContent = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Content>
>(({ sideOffset = 6, className, children, ...props }, ref) => (
  <ComboboxPrimitive.Content
    data-slot="combobox-content"
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-fit min-w-[var(--dice-anchor-width)] origin-[var(--dice-transform-origin)] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=closed]:animate-out data-[state=open]:animate-in",
      className,
    )}
    {...props}
  >
    {children}
  </ComboboxPrimitive.Content>
));
ComboboxContent.displayName = ComboboxPrimitive.Content.displayName;

const ComboboxLoading = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.Loading>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Loading>
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.Loading
    data-slot="combobox-loading"
    ref={ref}
    className={cn("py-6 text-center text-sm", className)}
    {...props}
  >
    Cargando...
  </ComboboxPrimitive.Loading>
));
ComboboxLoading.displayName = ComboboxPrimitive.Loading.displayName;

const ComboboxEmpty = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Empty>
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.Empty
    data-slot="combobox-empty"
    ref={ref}
    className={cn("py-6 text-center text-sm", className)}
    {...props}
  />
));
ComboboxEmpty.displayName = ComboboxPrimitive.Empty.displayName;

const ComboboxGroup = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Group>
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.Group
    data-slot="combobox-group"
    ref={ref}
    className={cn("overflow-hidden", className)}
    {...props}
  />
));
ComboboxGroup.displayName = ComboboxPrimitive.Group.displayName;

const ComboboxGroupLabel = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.GroupLabel>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.GroupLabel>
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.GroupLabel
    data-slot="combobox-group-label"
    ref={ref}
    className={cn(
      "px-2 py-1.5 font-semibold text-muted-foreground text-xs",
      className,
    )}
    {...props}
  />
));
ComboboxGroupLabel.displayName = ComboboxPrimitive.GroupLabel.displayName;

const ComboboxItem = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Item> & {
    outset?: boolean;
  }
>(({ className, children, outset, ...props }, ref) => (
  <ComboboxPrimitive.Item
    data-slot="combobox-item"
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 text-sm outline-none",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
      outset ? "pr-8 pl-2" : "pr-2 pl-8",
      className,
    )}
    {...props}
  >
    <ComboboxPrimitive.ItemIndicator
      className={cn(
        "absolute flex h-3.5 w-3.5 items-center justify-center",
        outset ? "right-2" : "left-2",
      )}
    >
      <Check className="h-4 w-4" />
    </ComboboxPrimitive.ItemIndicator>
    <ComboboxPrimitive.ItemText>{children}</ComboboxPrimitive.ItemText>
  </ComboboxPrimitive.Item>
));
ComboboxItem.displayName = ComboboxPrimitive.Item.displayName;

const ComboboxSeparator = React.forwardRef<
  React.ComponentRef<typeof ComboboxPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.Separator
    data-slot="combobox-separator"
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
ComboboxSeparator.displayName = ComboboxPrimitive.Separator.displayName;

export {
  Combobox,
  ComboboxAnchor,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxCancel,
  ComboboxBadgeList,
  ComboboxBadgeItem,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxItem,
  ComboboxLabel,
  ComboboxLoading,
  ComboboxSeparator,
};
