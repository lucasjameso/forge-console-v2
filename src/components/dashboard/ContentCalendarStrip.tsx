import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CalendarDays, ArrowRight, Linkedin, BookOpen, FileText, ShoppingBag, CheckCircle } from 'lucide-react'
import { startOfWeek, addDays, isSameDay, format, isToday, isBefore } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { SkeletonBlock } from '@/components/ui/SkeletonBlock'
import { useContentReviews } from '@/hooks/useContentReviews'
import type { ContentReview, ContentStatus } from '@/types/database'

const platformIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
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
  const isPosted = item.status === 'posted'

  return (
    <Link to="/pipeline" className="no-underline block">
      <div
        className="px-2 py-2 rounded-sm bg-[hsl(var(--bg-surface))] border border-[hsl(var(--border-subtle))] cursor-pointer relative min-h-[80px] flex flex-col"
      >
        {isPosted && (
          <div className="absolute top-1 right-1">
            <CheckCircle size={12} className="text-[hsl(var(--status-success))]" />
          </div>
        )}
        <div className="flex items-center justify-between gap-1 mb-1">
          <PlatformIcon size={16} className="text-[hsl(var(--text-tertiary))] shrink-0" />
          <Badge variant={badge.variant} className="text-[10px] px-1.5 py-0">{badge.label}</Badge>
        </div>
        <p className="text-caption text-[hsl(var(--text-primary))] line-clamp-2 flex-1">
          {item.post_title}
        </p>
        <span className="text-[11px] text-[hsl(var(--text-tertiary))] capitalize mt-1">
          {item.slide_count > 1 ? 'Carousel' : 'Post'}
        </span>
      </div>
    </Link>
  )
}

function getWeekItems(allReviews: ContentReview[], weekStartDate: Date) {
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStartDate, i))
  return allReviews.filter(r =>
    r.scheduled_date && weekDays.some(day => isSameDay(new Date(r.scheduled_date!), day))
  )
}

export function ContentCalendarStrip() {
  const { data: reviews, isLoading } = useContentReviews()

  const now = new Date()
  const currentWeekStart = startOfWeek(now, { weekStartsOn: 1 })

  if (isLoading) {
    const days = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i))
    return (
      <div>
        <div className="flex items-center gap-2 mb-4">
          <SkeletonBlock width={15} height={15} className="rounded-full" />
          <SkeletonBlock width="30%" height={16} />
        </div>
        <div className="grid grid-cols-7 gap-2 overflow-x-auto md:overflow-visible">
          {days.map((_, i) => (
            <div key={i} className="flex flex-col gap-1.5 min-w-[100px] md:min-w-0">
              <SkeletonBlock width="100%" height={14} />
              <SkeletonBlock width="60%" height={12} />
              <SkeletonBlock width="100%" height={60} className="rounded-sm" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const allReviews = reviews ?? []

  // Intelligent week selection: show current week if it has content, otherwise find next week with content
  let selectedWeekStart = currentWeekStart
  let headerLabel = 'This Week'
  const currentWeekItems = getWeekItems(allReviews, currentWeekStart)

  if (currentWeekItems.length === 0) {
    // Search up to 8 weeks ahead for content
    let found = false
    for (let w = 1; w <= 8; w++) {
      const candidateStart = addDays(currentWeekStart, w * 7)
      const candidateItems = getWeekItems(allReviews, candidateStart)
      if (candidateItems.length > 0) {
        selectedWeekStart = candidateStart
        const weekEnd = addDays(candidateStart, 6)
        headerLabel = `Next scheduled: ${format(candidateStart, 'MMM d')} - ${format(weekEnd, 'MMM d')}`
        found = true
        break
      }
    }
    if (!found) {
      // No future content, show current week with CTA
      headerLabel = 'This Week'
    }
  }

  const days = Array.from({ length: 7 }, (_, i) => addDays(selectedWeekStart, i))

  function getItemsForDay(dayDate: Date): ContentReview[] {
    return allReviews
      .filter(r => r.scheduled_date && isSameDay(new Date(r.scheduled_date), dayDate))
      .sort((a, b) => (statusPriority[a.status] ?? 4) - (statusPriority[b.status] ?? 4))
  }

  const totalItems = days.reduce((sum, d) => sum + getItemsForDay(d).length, 0)
  const showEmptyCTA = totalItems === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarDays size={15} className="text-[hsl(var(--text-tertiary))]" />
          <span className="text-section-header">Content Calendar</span>
          <span className="text-caption text-[hsl(var(--text-tertiary))]">{headerLabel}</span>
        </div>
        <Link
          to="/pipeline"
          className="text-body-sm font-medium flex items-center gap-1 text-[hsl(var(--accent-coral))] no-underline"
        >
          View pipeline
          <ArrowRight size={14} />
        </Link>
      </div>

      {showEmptyCTA ? (
        <div className="rounded-lg border border-dashed border-[hsl(var(--border-default))] p-8 text-center">
          <CalendarDays size={24} className="text-[hsl(var(--text-tertiary))] mx-auto mb-2" />
          <p className="text-body-sm text-[hsl(var(--text-secondary))]">
            No content scheduled. Plan your next week.
          </p>
          <Link
            to="/pipeline"
            className="text-body-sm font-medium text-[hsl(var(--accent-coral))] no-underline mt-2 inline-block"
          >
            Open pipeline
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-2 overflow-x-auto md:overflow-visible">
          {days.map((dayDate) => {
            const today = isToday(dayDate)
            const isPast = isBefore(dayDate, now) && !today
            const items = getItemsForDay(dayDate)
            const visibleItems = items.slice(0, 2)
            const overflowCount = items.length - 2

            return (
              <div
                key={dayDate.toISOString()}
                className={`flex flex-col gap-1.5 p-2 rounded-sm min-w-[100px] md:min-w-0 ${
                  today ? 'bg-[hsl(var(--bg-elevated))]' : ''
                } ${isPast ? 'opacity-60' : ''}`}
              >
                {/* Day label */}
                <span
                  className={`text-overline text-center ${
                    today ? 'text-[hsl(var(--accent-coral))] font-bold' : ''
                  }`}
                >
                  {format(dayDate, 'EEE')}
                </span>

                {/* Date number */}
                <span
                  className={`text-caption text-center ${
                    today ? 'text-[hsl(var(--text-primary))] font-semibold' : ''
                  }`}
                >
                  {format(dayDate, 'd')}
                </span>

                {/* Content items or empty placeholder */}
                {items.length === 0 ? (
                  <div className="border border-dashed border-[hsl(var(--border-default))] rounded-sm min-h-[60px]" />
                ) : (
                  <div className="flex flex-col gap-1">
                    {visibleItems.map((item) => (
                      <ContentItemCard key={item.id} item={item} />
                    ))}
                    {overflowCount > 0 && (
                      <Link
                        to="/pipeline"
                        className="text-caption text-[hsl(var(--accent-coral))] text-center block pt-0.5 no-underline"
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
      )}
    </motion.div>
  )
}
