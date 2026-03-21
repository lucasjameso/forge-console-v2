import { motion } from 'framer-motion'
import { Linkedin, BookOpen, FileText, ShoppingBag } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { formatShortDate } from '@/lib/utils'
import type { ContentReview, ContentStatus } from '@/types/database'

const platformIcons: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  linkedin: Linkedin,
  goodreads: BookOpen,
  medium: FileText,
  amazon: ShoppingBag,
}

const statusConfig: Record<ContentStatus, { variant: 'success' | 'warning' | 'error' | 'info' | 'neutral'; label: string }> = {
  draft: { variant: 'neutral', label: 'Draft' },
  pending: { variant: 'warning', label: 'Pending' },
  approved: { variant: 'success', label: 'Approved' },
  rejected: { variant: 'error', label: 'Rejected' },
  posted: { variant: 'info', label: 'Posted' },
}

interface ContentCardProps {
  item: ContentReview
  index: number
  onClick?: () => void
  compact?: boolean
}

export function ContentCard({ item, index, onClick, compact }: ContentCardProps) {
  const PlatformIcon = item.platforms[0]
    ? platformIcons[item.platforms[0]] ?? FileText
    : FileText
  const badge = statusConfig[item.status]

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : undefined }}
    >
      <div className="card" style={{ padding: compact ? '12px 16px' : '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: compact ? 4 : 6 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--accent-coral)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Wk {item.week_number} - {item.day_label}
              </span>
              {item.scheduled_date && (
                <span className="text-caption">{formatShortDate(item.scheduled_date)}</span>
              )}
            </div>
            <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', margin: 0 }}>
              {item.post_title}
            </p>
            {!compact && item.caption && (
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '6px 0 0', lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.caption}
              </p>
            )}
          </div>
          <Badge variant={badge.variant}>{badge.label}</Badge>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: compact ? 6 : 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <PlatformIcon size={13} style={{ color: 'var(--text-tertiary)' }} />
            {item.platforms.map(p => (
              <span key={p} className="text-caption" style={{ textTransform: 'capitalize' }}>{p}</span>
            ))}
          </div>
          <span className="text-caption">{item.slide_count} slides</span>
          <span className="text-caption">Rev {item.revision}</span>
        </div>
      </div>
    </motion.div>
  )
}
