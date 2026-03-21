import { motion } from 'framer-motion'
import { Server } from 'lucide-react'
import { StatusDot } from '@/components/ui/StatusDot'
import { SkeletonBlock } from '@/components/ui/SkeletonBlock'
import { useSystemHealth } from '@/hooks/useSystemHealth'
import { formatRelativeTime } from '@/lib/utils'
import type { HealthStatus } from '@/types/database'

const statusLabel: Record<HealthStatus, string> = {
  healthy: 'Healthy',
  degraded: 'Degraded',
  down: 'Down',
}

const overallStatus = (statuses: HealthStatus[]): { status: HealthStatus; label: string } => {
  if (statuses.includes('down')) return { status: 'down', label: 'System Issues' }
  if (statuses.includes('degraded')) return { status: 'degraded', label: 'Degraded' }
  return { status: 'healthy', label: 'All Systems Go' }
}

export function SystemHealthCard() {
  const { data: healthData, isLoading } = useSystemHealth()

  if (isLoading) {
    return (
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <SkeletonBlock width="50%" height={16} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <SkeletonBlock width={8} height={8} style={{ borderRadius: '50%' }} />
              <SkeletonBlock width="60%" height={12} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const data = healthData ?? []
  const statuses = data.map(d => d.status)
  const overall = overallStatus(statuses)

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Server size={15} style={{ color: 'var(--text-tertiary)' }} />
          <span className="text-card-title">System Health</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <StatusDot status={overall.status} />
          <span style={{ fontSize: 12, fontWeight: 500, color: overall.status === 'healthy' ? 'var(--status-success)' : overall.status === 'degraded' ? 'var(--status-warning)' : 'var(--status-error)' }}>
            {overall.label}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              borderRadius: 8,
              backgroundColor: 'var(--bg-elevated)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <StatusDot status={item.status} />
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                {item.service}
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, color: item.status === 'healthy' ? 'var(--status-success)' : item.status === 'degraded' ? 'var(--status-warning)' : 'var(--status-error)', fontWeight: 500 }}>
                {statusLabel[item.status]}
              </div>
              <div className="text-caption">{formatRelativeTime(item.checked_at)}</div>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <p className="text-caption" style={{ textAlign: 'center', padding: '12px 0' }}>
            No health data available
          </p>
        )}
      </div>
    </motion.div>
  )
}
