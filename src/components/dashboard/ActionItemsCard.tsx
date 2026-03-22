import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { SkeletonBlock } from '@/components/ui/SkeletonBlock'
import { useActionItems } from '@/hooks/useProjects'
import { useProjects } from '@/hooks/useProjects'
import { formatRelativeTime } from '@/lib/utils'

const urgencyBadge = (urgency: string) => {
  if (urgency === 'high') return 'error'
  if (urgency === 'medium') return 'warning'
  return 'neutral'
}

export function ActionItemsCard() {
  const { data: items, isLoading: loadingItems } = useActionItems()
  const { data: projects, isLoading: loadingProjects } = useProjects()

  const isLoading = loadingItems || loadingProjects

  if (isLoading) {
    return (
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <SkeletonBlock width="40%" height={18} />
        {[0, 1, 2].map(i => (
          <div key={i} className="card" style={{ padding: '12px 16px', gap: 8, display: 'flex', flexDirection: 'column' }}>
            <SkeletonBlock width="80%" height={14} />
            <SkeletonBlock width="40%" height={11} />
          </div>
        ))}
      </div>
    )
  }

  const openItems = (items ?? []).filter(i => i.status === 'open')

  const getProjectBadge = (projectId: string) => {
    const proj = (projects ?? []).find(p => p.id === projectId)
    return proj?.name.split(' ')[0] ?? 'Unknown'
  }

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertCircle size={15} style={{ color: 'hsl(var(--text-tertiary))' }} />
          <span className="text-card-title">Action Items</span>
          {openItems.length > 0 && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 20,
                height: 20,
                borderRadius: '50%',
                backgroundColor: 'hsl(var(--accent-coral))',
                color: 'white',
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {openItems.length}
            </span>
          )}
        </div>
      </div>

      {openItems.length === 0 ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '24px 0',
            color: 'hsl(var(--text-tertiary))',
          }}
        >
          <CheckCircle size={24} style={{ color: 'hsl(var(--status-success))' }} />
          <span style={{ fontSize: 13 }}>Nothing needs your attention right now</span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {openItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
              style={{
                padding: '12px 14px',
                borderRadius: 10,
                border: '1px solid hsl(var(--border-subtle))',
                backgroundColor: 'hsl(var(--bg-elevated))',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                <p style={{ fontSize: 13, color: 'hsl(var(--text-primary))', fontWeight: 500, flex: 1 }}>
                  {item.description}
                </p>
                <Badge variant={urgencyBadge(item.urgency) as 'error' | 'warning' | 'neutral'}>
                  {item.urgency}
                </Badge>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Badge variant="navy">{getProjectBadge(item.project_id)}</Badge>
                <span className="text-caption">{formatRelativeTime(item.created_at)}</span>
                {item.source && (
                  <span className="text-caption">from {item.source}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
