import type { HealthStatus } from '@/types/database'
import { cn } from '@/lib/utils'

interface StatusDotProps {
  status: HealthStatus | 'success' | 'warning' | 'error' | 'info'
  className?: string
}

const statusMap: Record<string, string> = {
  healthy: 'status-dot-success',
  success: 'status-dot-success',
  degraded: 'status-dot-warning',
  warning: 'status-dot-warning',
  down: 'status-dot-error',
  error: 'status-dot-error',
  info: 'status-dot-info',
}

export function StatusDot({ status, className }: StatusDotProps) {
  return <span className={cn('status-dot', statusMap[status], className)} />
}
