import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CalendarDays, ArrowRight, Linkedin, BookOpen, FileText, ShoppingBag } from 'lucide-react'
import { startOfWeek, addDays, isSameDay, format, isToday } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { SkeletonBlock } from '@/components/ui/SkeletonBlock'
import { useContentReviews } from '@/hooks/useContentReviews'
import type { ContentReview, ContentStatus } from '@/types/database'

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

const statusPriority: Record<ContentStatus, number> = {
  pending: 0,
  draft: 1,
  approved: 2,
  rejected: 3,
  posted: 4,
}

function ContentItemCard({ item }: { item: ContentReview }) {
  const PlatformIcon = item.platforms[0]
    ? platformIcons[item.platforms[0]] ?? FileText
    : FileText
  const badge = statusBadge[item.status]

  return (
    <Link to="/pipeline" style={{ textDecoration: 'none', display: 'block' }}>
      <div
        style={{
          padding: '6px 8px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'hsl(var(--bg-surface))',
          border: '1px solid hsl(var(--border-subtle))',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4, marginBottom: 2 }}>
          <PlatformIcon size={16} style={{ color: 'hsl(var(--text-tertiary))', flexShrink: 0 }} />
          <Badge variant={badge.variant} className="text-[10px] px-1.5 py-0">{badge.label}</Badge>
        </div>
        <p
          className="text-caption"
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            color: 'hsl(var(--text-primary))',
          }}
        >
          {item.post_title}
        </p>
      </div>
    </Link>
  )
}

export function ContentCalendarStrip() {
  const { data: reviews, isLoading } = useContentReviews()

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  if (isLoading) {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <SkeletonBlock width={15} height={15} style={{ borderRadius: '50%' }} />
          <SkeletonBlock width="30%" height={16} />
        </div>
        <div className="calendar-strip-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
          {days.map((_, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <SkeletonBlock width="100%" height={14} />
              <SkeletonBlock width="60%" height={12} />
              <SkeletonBlock width="100%" height={60} style={{ borderRadius: 'var(--radius-sm)' }} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const allReviews = reviews ?? []

  function getItemsForDay(dayDate: Date): ContentReview[] {
    return allReviews
      .filter(r => r.scheduled_date && isSameDay(new Date(r.scheduled_date), dayDate))
      .sort((a, b) => (statusPriority[a.status] ?? 4) - (statusPriority[b.status] ?? 4))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CalendarDays size={15} style={{ color: 'hsl(var(--text-tertiary))' }} />
          <span className="text-section-header">Content Calendar</span>
        </div>
        <Link
          to="/pipeline"
          className="text-body-sm font-medium"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            color: 'hsl(var(--accent-coral))',
            textDecoration: 'none',
          }}
        >
          View pipeline
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Calendar grid */}
      <div
        className="calendar-strip-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 8,
        }}
      >
        {days.map((dayDate) => {
          const today = isToday(dayDate)
          const items = getItemsForDay(dayDate)
          const visibleItems = items.slice(0, 2)
          const overflowCount = items.length - 2

          return (
            <div
              key={dayDate.toISOString()}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                padding: 8,
                borderRadius: 'var(--radius-sm)',
                backgroundColor: today ? 'hsl(var(--bg-elevated))' : 'transparent',
              }}
            >
              {/* Day label */}
              <span
                className="text-overline"
                style={{
                  textAlign: 'center',
                  ...(today
                    ? { color: 'hsl(var(--accent-coral))', fontWeight: 700 }
                    : {}),
                }}
              >
                {format(dayDate, 'EEE')}
              </span>

              {/* Date number */}
              <span
                className="text-caption"
                style={{
                  textAlign: 'center',
                  ...(today ? { color: 'hsl(var(--text-primary))', fontWeight: 600 } : {}),
                }}
              >
                {format(dayDate, 'd')}
              </span>

              {/* Content items or empty placeholder */}
              {items.length === 0 ? (
                <div
                  style={{
                    border: '1px dashed hsl(var(--border-default))',
                    borderRadius: 'var(--radius-sm)',
                    minHeight: 60,
                  }}
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {visibleItems.map((item) => (
                    <ContentItemCard key={item.id} item={item} />
                  ))}
                  {overflowCount > 0 && (
                    <Link
                      to="/pipeline"
                      className="text-caption"
                      style={{
                        color: 'hsl(var(--accent-coral))',
                        textAlign: 'center',
                        display: 'block',
                        paddingTop: 2,
                        textDecoration: 'none',
                      }}
                    >
                      +{overflowCount} more
                    </Link>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .calendar-strip-grid { overflow-x: auto; grid-template-columns: repeat(7, minmax(100px, 1fr)) !important; }
        }
      `}</style>
    </motion.div>
  )
}
