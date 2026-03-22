import { motion } from 'framer-motion'
import { StatusDot } from '@/components/ui/StatusDot'
import { SkeletonBlock } from '@/components/ui/SkeletonBlock'
import { useSystemHealth } from '@/hooks/useSystemHealth'
import type { HealthStatus } from '@/types/database'

const statusColor: Record<HealthStatus, string> = {
  healthy: 'inherit',
  degraded: 'hsl(var(--status-warning))',
  down: 'hsl(var(--status-error))',
}

export function SystemHealthStrip() {
  const { data: healthData, isLoading } = useSystemHealth()

  if (isLoading) {
    return (
      <SkeletonBlock width="100%" height={32} style={{ borderRadius: 'var(--radius-md)' }} />
    )
  }

  const data = healthData ?? []

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.15 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '8px 16px',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'hsl(var(--bg-elevated))',
        border: '1px solid hsl(var(--border-subtle))',
      }}
    >
      {data.map((item) => (
        <div
          key={item.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <StatusDot status={item.status} />
          <span
            className="text-body-sm"
            style={{
              fontWeight: item.status !== 'healthy' ? 600 : 400,
              color: statusColor[item.status],
            }}
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
