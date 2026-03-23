import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react'
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  differenceInCalendarWeeks,
  isWithinInterval,
  addDays,
} from 'date-fns'
import type { ContentReview } from '@/types/database'

interface AnalyticsStripProps {
  items: ContentReview[]
  currentMonth: Date
}

function StatusPill({ label, count, variant }: { label: string; count: number; variant?: string }) {
  const colorMap: Record<string, string> = {
    posted: 'bg-[hsl(var(--status-success)/0.1)] text-[hsl(var(--status-success))]',
    pending: 'bg-[hsl(var(--status-warning)/0.1)] text-[hsl(var(--status-warning))]',
    draft: 'bg-[hsl(var(--bg-elevated))] text-[hsl(var(--text-secondary))]',
    default: 'bg-[hsl(var(--bg-elevated))] text-[hsl(var(--text-primary))]',
  }
  const cls = colorMap[variant ?? 'default'] ?? colorMap.default
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-pill)] text-xs font-medium ${cls}`}>
      {count} {label}
    </span>
  )
}

function CadenceDot({ level }: { level: 'green' | 'amber' | 'red' }) {
  const colorMap = {
    green: 'bg-[hsl(var(--status-success))]',
    amber: 'bg-[hsl(var(--status-warning))]',
    red: 'bg-[hsl(var(--status-error))]',
  }
  return <span className={`inline-block w-2 h-2 rounded-full ${colorMap[level]}`} />
}

export function AnalyticsStrip({ items, currentMonth }: AnalyticsStripProps) {
  const [expanded, setExpanded] = useState(true)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)

  // Filter items to current month
  const monthItems = useMemo(
    () =>
      items.filter((item) => {
        if (!item.scheduled_date) return false
        const d = parseISO(item.scheduled_date)
        return isWithinInterval(d, { start: monthStart, end: monthEnd })
      }),
    [items, monthStart, monthEnd]
  )

  // Counts
  const total = monthItems.length
  const posted = monthItems.filter((i) => i.status === 'posted').length
  const pending = monthItems.filter((i) => i.status === 'pending').length
  const draft = monthItems.filter((i) => i.status === 'draft').length

  // Cadence: posts per week average
  const cadence = useMemo(() => {
    const weekCount = Math.max(1, differenceInCalendarWeeks(monthEnd, monthStart, { weekStartsOn: 1 }) + 1)
    const avg = total / weekCount
    if (avg >= 5) return { level: 'green' as const, label: 'on track' }
    if (avg >= 3) return { level: 'amber' as const, label: 'falling behind' }
    return { level: 'red' as const, label: 'gaps detected' }
  }, [total, monthStart, monthEnd])

  // Gap detection: 2+ consecutive days with no content
  const gaps = useMemo(() => {
    const allDays = eachDayOfInterval({ start: monthStart, end: monthEnd })
    const scheduledDates = new Set(
      monthItems
        .filter((i) => i.scheduled_date)
        .map((i) => format(parseISO(i.scheduled_date!), 'yyyy-MM-dd'))
    )

    const found: { start: Date; end: Date }[] = []
    let gapStart: Date | null = null
    let gapLength = 0

    for (const day of allDays) {
      const key = format(day, 'yyyy-MM-dd')
      if (!scheduledDates.has(key)) {
        if (gapStart === null) gapStart = day
        gapLength++
      } else {
        if (gapStart !== null && gapLength >= 2) {
          found.push({ start: gapStart, end: addDays(gapStart, gapLength - 1) })
        }
        gapStart = null
        gapLength = 0
      }
    }
    // Close trailing gap
    if (gapStart !== null && gapLength >= 2) {
      found.push({ start: gapStart, end: addDays(gapStart, gapLength - 1) })
    }

    return found
  }, [monthItems, monthStart, monthEnd])

  if (total === 0 && items.length === 0) return null

  return (
    <div className="bg-[hsl(var(--bg-elevated))] rounded-[var(--radius-md)] mb-4">
      {/* Toggle header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-[hsl(var(--bg-elevated)/0.8)] transition-colors rounded-[var(--radius-md)]"
      >
        <span className="text-xs font-medium uppercase tracking-wide text-[hsl(var(--text-tertiary))]">
          {format(currentMonth, 'MMMM')} Analytics
        </span>
        {expanded ? (
          <ChevronUp size={14} className="text-[hsl(var(--text-tertiary))]" />
        ) : (
          <ChevronDown size={14} className="text-[hsl(var(--text-tertiary))]" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3 flex flex-wrap items-center gap-3">
              {/* Stat pills */}
              <span className="text-xs text-[hsl(var(--text-tertiary))]">This month:</span>
              <StatusPill label="planned" count={total} />
              <StatusPill label="posted" count={posted} variant="posted" />
              <StatusPill label="pending" count={pending} variant="pending" />
              <StatusPill label="draft" count={draft} variant="draft" />

              {/* Separator */}
              <span className="w-px h-4 bg-[hsl(var(--border-subtle))]" />

              {/* Cadence indicator */}
              <span className="inline-flex items-center gap-1.5 text-xs text-[hsl(var(--text-secondary))]">
                <CadenceDot level={cadence.level} />
                Cadence: {cadence.label}
              </span>

              {/* Gap alerts */}
              {gaps.map((gap, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-xs text-[hsl(var(--status-warning))]"
                >
                  <AlertTriangle size={12} />
                  Gap: {format(gap.start, 'MMM d')}-{format(gap.end, 'MMM d')} has no content
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
