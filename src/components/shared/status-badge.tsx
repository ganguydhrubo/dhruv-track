import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type StatusType = "success" | "warning" | "error" | "info" | "default"

interface StatusBadgeProps {
  status: string
  type?: StatusType
  className?: string
}

const statusStyles: Record<StatusType, string> = {
  success: "bg-green-100 text-green-800 hover:bg-green-200 border-green-200",
  warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200",
  error: "bg-red-100 text-red-800 hover:bg-red-200 border-red-200",
  info: "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200",
  default: "bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-200",
}

export function StatusBadge({ status, type = "default", className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium capitalize",
        statusStyles[type],
        className
      )}
    >
      {status}
    </Badge>
  )
}
