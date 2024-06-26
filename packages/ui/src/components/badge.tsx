import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/utils"

const badgeVariants = cva(
  "ui-inline-flex ui-items-center ui-rounded-full ui-border ui-px-2.5 ui-py-0.5 ui-text-xs ui-font-semibold ui-transition-colors focus:ui-outline-none focus:ui-ring-2 focus:ui-ring-ring focus:ui-ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "ui-border-transparent ui-bg-primary ui-text-primary-foreground hover:ui-bg-primary/80",
        secondary:
          "ui-border-transparent ui-bg-secondary ui-text-secondary-foreground hover:ui-bg-secondary/80",
        destructive:
          "ui-border-transparent ui-bg-destructive ui-text-destructive-foreground hover:ui-bg-destructive/80",
        outline: "ui-text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
