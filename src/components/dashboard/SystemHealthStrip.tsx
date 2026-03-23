import { motion } from 'framer-motion'
import { StatusDot } from '@/components/ui/StatusDot'
import { SkeletonBlock } from '@/components/ui/SkeletonBlock'
import { useSystemHealth } from '@/hooks/useSystemHealth'
import type { HealthStatus } from '@/types/database'

const statusTextClass: Record<HealthStatus, string> = {
  healthy: '',
  degraded: 'font-semibold text-[hsl(var(--status-warning))]',
  down: 'font-semibold text-[hsl(var(--status-error))]',
}

export function SystemHealthStrip() {
  const { data: healthData, isLoading } = useSystemHealth()

  if (isLoading) {
    return (
      <SkeletonBlock width="100%" height={32} className="rounded-md" />
    )
  }

  const data = healthData ?? []

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.15 }}
      className="flex items-center gap-4 py-2 px-4 rounded-md bg-[hsl(var(--bg-elevated))] border border-[hsl(var(--border-subtle))]"
    >
      {data.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-1.5"
        >
          <StatusDot status={item.status} />
          <span
            className={`text-body-sm ${statusTextClass[item.status]}`}
          >
            {item.service}
          </span>
        </div>
      ))}
      {data.length === 0 && (
        <span className="text-caption">No health data available</span>
      )}
    </motion.div>
  )
}
