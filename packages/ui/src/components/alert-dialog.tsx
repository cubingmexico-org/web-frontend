"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"
import { cn } from "../lib/utils"
import { buttonVariants } from "./button"

const AlertDialog = AlertDialogPrimitive.Root

const AlertDialogTrigger = AlertDialogPrimitive.Trigger

const AlertDialogPortal = AlertDialogPrimitive.Portal

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "ui-fixed ui-inset-0 ui-z-50 ui-bg-black/80  data-[state=open]:ui-animate-in data-[state=closed]:ui-animate-out data-[state=closed]:ui-fade-out-0 data-[state=open]:ui-fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      className={cn(
        "ui-fixed ui-left-[50%] ui-top-[50%] ui-z-50 ui-grid ui-w-full ui-max-w-lg ui-translate-x-[-50%] ui-translate-y-[-50%] ui-gap-4 ui-border ui-bg-background ui-p-6 ui-shadow-lg ui-duration-200 data-[state=open]:ui-animate-in data-[state=closed]:ui-animate-out data-[state=closed]:ui-fade-out-0 data-[state=open]:ui-fade-in-0 data-[state=closed]:ui-zoom-out-95 data-[state=open]:ui-zoom-in-95 data-[state=closed]:ui-slide-out-to-left-1/2 data-[state=closed]:ui-slide-out-to-top-[48%] data-[state=open]:ui-slide-in-from-left-1/2 data-[state=open]:ui-slide-in-from-top-[48%] sm:ui-rounded-lg",
        className
      )}
      ref={ref}
      {...props}
    />
  </AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

function AlertDialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): JSX.Element {
  return <div
    className={cn(
      "ui-flex ui-flex-col ui-space-y-2 ui-text-center sm:ui-text-left",
      className
    )}
    {...props}
  />
}
AlertDialogHeader.displayName = "AlertDialogHeader"

function AlertDialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): JSX.Element {
  return <div
    className={cn(
      "ui-flex ui-flex-col-reverse sm:ui-flex-row sm:ui-justify-end sm:ui-space-x-2",
      className
    )}
    {...props}
  />
}
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    className={cn("ui-text-lg ui-font-semibold", className)}
    ref={ref}
    {...props}
  />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    className={cn("ui-text-sm ui-text-muted-foreground", className)}
    ref={ref}
    {...props}
  />
))
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    className={cn(buttonVariants(), className)}
    ref={ref}
    {...props}
  />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    className={cn(
      buttonVariants({ variant: "outline" }),
      "ui-mt-2 sm:ui-mt-0",
      className
    )}
    ref={ref}
    {...props}
  />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}