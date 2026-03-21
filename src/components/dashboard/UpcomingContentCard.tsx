import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Layers, ArrowRight, Linkedin, BookOpen, FileText, ShoppingBag } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { SkeletonBlock } from '@/components/ui/SkeletonBlock'
import { useContentReviews } from '@/hooks/useContentReviews'
import { formatShortDate } from '@/lib/utils'
import type { ContentStatus } from '@/types/database'

const platformIcons: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  linkedin: Linkedin,
  goodreads: BookOpen,
  medium: FileText,
  amazon: ShoppingBag,
}

const statusBadge: Record<ContentStatus, { variant: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'coral' | 'navy'; label: string }> = {
  draft: { variant: 'neutral', label: 'Draft' },
  pending: { variant: 'warning', label: 'Pending' },
  approved: { variant: 'success', label: 'Approved' },
  rejected: { variant: 'error', label: 'Rejected' },
  posted: { variant: 'info', label: 'Posted' },
}

export function UpcomingContentCard() {
  const { data: reviews, isLoading } = useContentReviews()

  if (isLoading) {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <SkeletonBlock width={15} height={15} style={{ borderRadius: '50%' }} />
          <SkeletonBlock width="30%" height={16} />
        </div>
        <div style={{ display: 'flex', gap: 16, overflowX: 'auto' }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="card" style={{ minWidth: 240, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <SkeletonBlock width="40%" height={12} />
              <SkeletonBlock width="90%" height={14} />
              <SkeletonBlock width="60%" height={12} />
              <SkeletonBlock width="30%" height={20} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const upcoming = (reviews ?? []).filter(r => r.status !== 'posted')

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Layers size={15} style={{ color: 'var(--text-tertiary)' }} />
          <span className="text-section-header">Upcoming Content</span>
        </div>
        <Link
          to="/pipeline"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 13,
            color: 'var(--accent-coral)',
            textDecoration: 'none',
            fontWeight: 500,
          }}
        >
          View all
          <ArrowRight size={14} />
        </Link>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 16,
          overflowX: 'auto',
          paddingBottom: 4,
        }}
      >
        {upcoming.length === 0 ? (
          <div className="card" style={{ width: '100%', textAlign: 'center', padding: '24px 0' }}>
            <p className="text-caption">No upcoming content scheduled</p>
          </div>
        ) : (
          upcoming.map((item, idx) => {
            const PlatformIcon = item.platforms[0]
              ? platformIcons[item.platforms[0]] ?? FileText
              : FileText
            const badge = statusBadge[item.status]

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                style={{ minWidth: 260, maxWidth: 280, flexShrink: 0 }}
              >
                <div
                  className="card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    height: '100%',
                  }}
                >
                  {/* Day + date */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: 'var(--accent-coral)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {item.day_label}
                    </span>
                    {item.scheduled_date && (
                      <span className="text-caption">
                        {formatShortDate(item.scheduled_date)}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: 'var(--text-primary)',
                      lineHeight: 1.4,
                    }}
                  >
                    {item.post_title}
                  </p>

                  {/* Meta row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <PlatformIcon size={13} style={{ color: 'var(--text-tertiary)' }} />
                      <span className="text-caption">{item.slide_count} slides</span>
                    </div>
                    <span className="text-caption">Rev {item.revision}</span>
                  </div>

                  {/* Status badge */}
                  <Badge variant={badge.variant}>{badge.label}</Badge>
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}
