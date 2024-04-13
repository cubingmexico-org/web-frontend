import { cn } from "@/lib/utils"

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- Reason: Skeleton is a component
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
