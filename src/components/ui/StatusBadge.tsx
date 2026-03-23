import type { ContentStatus } from '@/lib/colors'
import { cn } from '@/lib/utils'

const STATUS_CLASSES: Record<ContentStatus, string> = {
  draft: 'bg-[hsl(var(--bg-elevated))] text-[hsl(var(--text-tertiary))]',
  pending: 'bg-[hsl(var(--status-warning-bg))] text-[hsl(var(--status-warning))]',
  approved: 'bg-[hsl(var(--status-success-bg))] text-[hsl(var(--status-success))]',
  rejected: 'bg-[hsl(var(--status-error-bg))] text-[hsl(var(--status-error))]',
  posted: 'bg-[hsl(var(--status-info-bg))] text-[hsl(var(--status-info))]',
}

interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: ContentStatus
}

export function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border-transparent px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide',
        STATUS_CLASSES[status],
        className
      )}
      {...props}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}
