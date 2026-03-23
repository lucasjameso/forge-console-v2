import { Badge } from '@/components/ui/badge'
import type { Priority } from '@/lib/colors'
import { cn } from '@/lib/utils'

const PRIORITY_VARIANT = {
  high: 'error',
  medium: 'warning',
  low: 'success',
} as const

interface PriorityBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  priority: Priority
}

export function PriorityBadge({ priority, className, ...props }: PriorityBadgeProps) {
  return (
    <Badge
      variant={PRIORITY_VARIANT[priority]}
      className={cn('border-transparent', className)}
      {...props}
    >
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  )
}
