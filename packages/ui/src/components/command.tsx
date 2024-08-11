/* eslint-disable react/no-unknown-property -- . */
"use client";

import * as React from "react";
import { type DialogProps } from "@radix-ui/react-dialog";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";
import { cn } from "../lib/utils";
import { Dialog, DialogContent } from "./dialog";

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    className={cn(
      "ui-flex ui-h-full ui-w-full ui-flex-col ui-overflow-hidden ui-rounded-md ui-bg-popover ui-text-popover-foreground",
      className,
    )}
    ref={ref}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

type CommandDialogProps = DialogProps;

function CommandDialog({
  children,
  ...props
}: CommandDialogProps): JSX.Element {
  return (
    <Dialog {...props}>
      <DialogContent className="ui-overflow-hidden ui-p-0 ui-shadow-lg">
        <Command className="[&_[cmdk-group-heading]]:ui-px-2 [&_[cmdk-group-heading]]:ui-font-medium [&_[cmdk-group-heading]]:ui-text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:ui-pt-0 [&_[cmdk-group]]:ui-px-2 [&_[cmdk-input-wrapper]_svg]:ui-h-5 [&_[cmdk-input-wrapper]_svg]:ui-w-5 [&_[cmdk-input]]:ui-h-12 [&_[cmdk-item]]:ui-px-2 [&_[cmdk-item]]:ui-py-3 [&_[cmdk-item]_svg]:ui-h-5 [&_[cmdk-item]_svg]:ui-w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
}

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div
    className="ui-flex ui-items-center ui-border-b ui-px-3"
    cmdk-input-wrapper=""
  >
    <Search className="ui-mr-2 ui-h-4 ui-w-4 ui-shrink-0 ui-opacity-50" />
    <CommandPrimitive.Input
      className={cn(
        "ui-flex ui-h-11 ui-w-full ui-rounded-md ui-bg-transparent ui-py-3 ui-text-sm ui-outline-none placeholder:ui-text-muted-foreground disabled:ui-cursor-not-allowed disabled:ui-opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  </div>
));

CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    className={cn(
      "ui-max-h-[300px] ui-overflow-y-auto ui-overflow-x-hidden",
      className,
    )}
    ref={ref}
    {...props}
  />
));

CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    className="ui-py-6 ui-text-center ui-text-sm"
    ref={ref}
    {...props}
  />
));

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    className={cn(
      "ui-overflow-hidden ui-p-1 ui-text-foreground [&_[cmdk-group-heading]]:ui-px-2 [&_[cmdk-group-heading]]:ui-py-1.5 [&_[cmdk-group-heading]]:ui-text-xs [&_[cmdk-group-heading]]:ui-font-medium [&_[cmdk-group-heading]]:ui-text-muted-foreground",
      className,
    )}
    ref={ref}
    {...props}
  />
));

CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    className={cn("ui--mx-1 ui-h-px ui-bg-border", className)}
    ref={ref}
    {...props}
  />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    className={cn(
      "ui-relative ui-flex ui-cursor-default ui-select-none ui-items-center ui-rounded-sm ui-px-2 ui-py-1.5 ui-text-sm ui-outline-none aria-selected:ui-bg-accent aria-selected:ui-text-accent-foreground data-[disabled='true']:ui-pointer-events-none data-[disabled='true']:ui-opacity-50",
      className,
    )}
    ref={ref}
    {...props}
  />
));

CommandItem.displayName = CommandPrimitive.Item.displayName;

function CommandShortcut({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>): JSX.Element {
  return (
    <span
      className={cn(
        "ui-ml-auto ui-text-xs ui-tracking-widest ui-text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
CommandShortcut.displayName = "CommandShortcut";

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
