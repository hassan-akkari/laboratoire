import { cn } from "@/lib/utils"

// shadcn/ui Skeleton primitive (radix-nova style). A pulsing placeholder block
// that uses theme tokens so it sits correctly in light and dark mode. Used by
// the route-level loading.tsx files to render layout-shaped loading states
// instead of a spinner or bare text.
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-accent", className)}
      {...props}
    />
  )
}

export { Skeleton }
