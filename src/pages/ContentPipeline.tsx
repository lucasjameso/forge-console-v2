import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  List,
  Columns3,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  Layers,
  Inbox,
  Plus,
  Check,
  XCircle,
  MessageSquare,
  Linkedin,
  BookOpen,
  FileText,
  ShoppingBag,
} from 'lucide-react'
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,

  isToday,
  parseISO,
} from 'date-fns'
import { PageShell } from '@/components/layout/PageShell'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { SkeletonBlock } from '@/components/ui/SkeletonBlock'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { useContentReviews, useUpdateContentStatus } from '@/hooks/useContentReviews'
import { formatShortDate } from '@/lib/utils'
import type { ContentReview, ContentStatus } from '@/types/database'

type ViewMode = 'list' | 'week' | 'month' | 'kanban'

const viewModes: { key: ViewMode; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { key: 'list', label: 'List', icon: List },
  { key: 'week', label: 'Week', icon: Calendar },
  { key: 'month', label: 'Month', icon: LayoutGrid },
  { key: 'kanban', label: 'Kanban', icon: Columns3 },
]

const PLATFORM_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  linkedin: Linkedin,
  goodreads: BookOpen,
  medium: FileText,
  amazon: ShoppingBag,
}

const kanbanColumns: { status: ContentStatus; label: string }[] = [
  { status: 'draft', label: 'Draft' },
  { status: 'pending', label: 'Pending Review' },
  { status: 'approved', label: 'Approved' },
  { status: 'posted', label: 'Posted' },
]

// ----- Helpers -----
function SlideInfo({ slideCount }: { slideCount: number }) {
  if (slideCount === 0 || slideCount === null) {
    return <span className="text-xs text-[hsl(var(--text-secondary))]">Text post</span>
  }
  return (
    <span className="flex items-center gap-1 text-xs text-[hsl(var(--text-secondary))]">
      <Layers size={12} />
      {slideCount} slides
    </span>
  )
}

function getItemDate(item: ContentReview): Date | null {
  if (item.scheduled_date) return parseISO(item.scheduled_date)
  return null
}

function isItemToday(item: ContentReview): boolean {
  const d = getItemDate(item)
  return d ? isToday(d) : false
}

// ----- Detail Modal -----
function ContentDetailDialog({
  item,
  open,
  onOpenChange,
}: {
  item: ContentReview | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const updateStatus = useUpdateContentStatus()
  const [feedback, setFeedback] = useState('')
  const [showReject, setShowReject] = useState(false)

  if (!item) return null

  const PlatformIcon = item.platforms[0] ? PLATFORM_ICONS[item.platforms[0]] ?? FileText : FileText

  const handleApprove = () => {
    updateStatus.mutate({ id: item.id, status: 'approved' })
    onOpenChange(false)
  }

  const handleReject = () => {
    if (!feedback.trim()) return
    updateStatus.mutate({ id: item.id, status: 'rejected', feedback: feedback.trim() })
    setFeedback('')
    setShowReject(false)
    onOpenChange(false)
  }

  const handleResubmit = () => {
    updateStatus.mutate({ id: item.id, status: 'pending' })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[680px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium uppercase tracking-wide text-[hsl(var(--accent-coral))]">
              Week {item.week_number} &middot; {item.day_label}
            </span>
            <StatusBadge status={item.status} />
          </div>
          <DialogTitle className="text-lg font-semibold text-[hsl(var(--text-primary))]">
            {item.post_title}
          </DialogTitle>
          <DialogDescription className="sr-only">Content detail for {item.post_title}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          {/* Caption */}
          {item.caption && (
            <div>
              <span className="block text-xs font-medium uppercase tracking-wide text-[hsl(var(--text-tertiary))] mb-1.5">Caption</span>
              <div className="min-h-[120px] rounded-md border border-[hsl(var(--border-subtle))] bg-[hsl(var(--bg-elevated))] px-3 py-2 text-sm text-[hsl(var(--text-primary))] leading-relaxed whitespace-pre-wrap">
                {item.caption}
              </div>
            </div>
          )}

          {/* Meta row */}
          <div className="grid grid-cols-4 gap-3 rounded-md bg-[hsl(var(--bg-elevated))] p-3.5">
            <div>
              <span className="block text-xs font-medium uppercase tracking-wide text-[hsl(var(--text-tertiary))] mb-1">Platform</span>
              <div className="flex items-center gap-1.5">
                <PlatformIcon size={14} className="text-[hsl(var(--text-secondary))]" />
                <span className="text-sm font-medium text-[hsl(var(--text-primary))] capitalize">
                  {item.platforms.join(', ')}
                </span>
              </div>
            </div>
            <div>
              <span className="block text-xs font-medium uppercase tracking-wide text-[hsl(var(--text-tertiary))] mb-1">Slides</span>
              <SlideInfo slideCount={item.slide_count} />
            </div>
            <div>
              <span className="block text-xs font-medium uppercase tracking-wide text-[hsl(var(--text-tertiary))] mb-1">Revision</span>
              <span className="text-sm font-medium text-[hsl(var(--text-primary))]">{item.revision}</span>
            </div>
            <div>
              <span className="block text-xs font-medium uppercase tracking-wide text-[hsl(var(--text-tertiary))] mb-1">Scheduled</span>
              <span className="text-sm font-medium text-[hsl(var(--text-primary))]">{item.scheduled_date ? formatShortDate(item.scheduled_date) : 'Not set'}</span>
            </div>
          </div>

          {/* Feedback if rejected */}
          {item.feedback && (
            <div className="rounded-md bg-[hsl(0_80%_97%)] border border-[hsl(var(--status-error)/0.3)] p-3.5">
              <span className="block text-xs font-medium uppercase tracking-wide text-[hsl(var(--status-error))] mb-1.5">Feedback</span>
              <p className="text-sm text-[hsl(var(--text-primary))] leading-relaxed m-0">{item.feedback}</p>
            </div>
          )}

          {/* Rejection feedback input */}
          <AnimatePresence>
            {showReject && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-1.5">
                    <MessageSquare size={14} className="text-[hsl(var(--text-tertiary))]" />
                    <span className="text-sm font-medium text-[hsl(var(--text-primary))]">Rejection feedback</span>
                  </div>
                  <textarea
                    className="w-full min-h-[80px] resize-y rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-coral focus:ring-2 focus:ring-coral/10 placeholder:text-muted-foreground font-[inherit]"
                    placeholder="What needs to change?"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button variant="destructive" onClick={handleReject} disabled={!feedback.trim()}>
                      Confirm Reject
                    </Button>
                    <Button variant="outline" onClick={() => setShowReject(false)}>Cancel</Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        {!showReject && (
          <DialogFooter className="gap-2">
            {(item.status === 'pending' || item.status === 'draft') && (
              <>
                <Button onClick={handleApprove} className="gap-1.5">
                  <Check size={14} />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowReject(true)}
                  className="text-[hsl(var(--status-error))] gap-1.5"
                >
                  <XCircle size={14} />
                  Reject
                </Button>
              </>
            )}
            {item.status === 'rejected' && (
              <Button onClick={handleResubmit} className="bg-[hsl(var(--accent-coral))] hover:bg-[hsl(var(--accent-coral-hover))] text-white gap-1.5">
                Re-submit
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ----- Add Content Modal -----
function AddContentDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [title, setTitle] = useState('')
  const [caption, setCaption] = useState('')
  const [weekNumber, setWeekNumber] = useState('')
  const [dayLabel, setDayLabel] = useState('Monday')
  const [scheduledDate, setScheduledDate] = useState('')
  const [platforms, setPlatforms] = useState<string[]>(['linkedin'])

  const dayOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const platformOptions = [
    { key: 'linkedin', label: 'LinkedIn' },
    { key: 'medium', label: 'Medium' },
    { key: 'goodreads', label: 'Goodreads' },
    { key: 'amazon', label: 'Amazon' },
  ]

  const togglePlatform = (p: string) => {
    setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])
  }

  const handleCreate = () => {
    // Stub: just show success for now; real mutation added when Supabase is wired
    toast.success('Content created as draft', { description: title })
    setTitle('')
    setCaption('')
    setWeekNumber('')
    setScheduledDate('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-[hsl(var(--text-primary))]">Add Content</DialogTitle>
          <DialogDescription className="text-sm text-[hsl(var(--text-secondary))]">
            Create a new content item as a draft.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-[hsl(var(--text-tertiary))] mb-1.5">Title</label>
            <input
              type="text"
              className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-coral focus:ring-2 focus:ring-coral/10 placeholder:text-muted-foreground"
              placeholder="Post title..."
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          {/* Caption */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-[hsl(var(--text-tertiary))] mb-1.5">Caption</label>
            <textarea
              className="w-full min-h-[100px] resize-y rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-coral focus:ring-2 focus:ring-coral/10 placeholder:text-muted-foreground font-[inherit]"
              placeholder="Write your caption..."
              value={caption}
              onChange={e => setCaption(e.target.value)}
            />
          </div>

          {/* Week / Day row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-[hsl(var(--text-tertiary))] mb-1.5">Week Number</label>
              <input
                type="number"
                className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-coral focus:ring-2 focus:ring-coral/10 placeholder:text-muted-foreground"
                placeholder="12"
                value={weekNumber}
                onChange={e => setWeekNumber(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-[hsl(var(--text-tertiary))] mb-1.5">Day</label>
              <select
                className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-coral focus:ring-2 focus:ring-coral/10"
                value={dayLabel}
                onChange={e => setDayLabel(e.target.value)}
              >
                {dayOptions.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Scheduled date */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-[hsl(var(--text-tertiary))] mb-1.5">Scheduled Date</label>
            <input
              type="date"
              className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-coral focus:ring-2 focus:ring-coral/10"
              value={scheduledDate}
              onChange={e => setScheduledDate(e.target.value)}
            />
          </div>

          {/* Platforms */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-[hsl(var(--text-tertiary))] mb-1.5">Platforms</label>
            <div className="flex flex-wrap gap-2">
              {platformOptions.map(p => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => togglePlatform(p.key)}
                  className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                    platforms.includes(p.key)
                      ? 'bg-[hsl(var(--accent-coral))] text-white border-transparent'
                      : 'bg-[hsl(var(--bg-elevated))] text-[hsl(var(--text-secondary))] border-[hsl(var(--border-subtle))]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={handleCreate}
            disabled={!title.trim()}
            className="bg-[hsl(var(--accent-coral))] hover:bg-[hsl(var(--accent-coral-hover))] text-white gap-1.5"
          >
            <Plus size={14} />
            Create as Draft
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ----- Views -----
function ListView({ items, onSelect }: { items: ContentReview[]; onSelect: (item: ContentReview) => void }) {
  return (
    <div className="flex flex-col gap-2.5">
      {items.map((item, idx) => {
        const PIcon = item.platforms[0] ? PLATFORM_ICONS[item.platforms[0]] ?? FileText : FileText
        const today = isItemToday(item)
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.03 }}
          >
            <Card
              className={`flex items-center gap-4 p-4 h-[84px] cursor-pointer transition-shadow hover:shadow-card-hover ${
                today ? 'bg-[hsl(var(--accent-coral)/0.04)]' : ''
              }`}
              onClick={() => onSelect(item)}
            >
              {/* Left: week/date */}
              <div className="flex flex-col items-center w-16 shrink-0">
                <span className="text-xs text-[hsl(var(--text-tertiary))]">Wk {item.week_number}</span>
                <span className="text-xs text-[hsl(var(--text-tertiary))]">{item.day_label.slice(0, 3)}</span>
              </div>

              {/* Center: title + caption */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[hsl(var(--text-primary))] truncate m-0">{item.post_title}</p>
                {item.caption && (
                  <p className="text-[13px] text-[hsl(var(--text-secondary))] line-clamp-1 m-0 mt-0.5">{item.caption}</p>
                )}
                {/* Bottom metadata */}
                <div className="flex items-center gap-3 mt-1">
                  <PIcon size={13} className="text-[hsl(var(--text-tertiary))]" />
                  <SlideInfo slideCount={item.slide_count} />
                </div>
              </div>

              {/* Right: status + date */}
              <div className="flex flex-col items-end gap-1 shrink-0">
                <StatusBadge status={item.status} />
                {item.scheduled_date && (
                  <span className="text-xs text-[hsl(var(--text-tertiary))]">{formatShortDate(item.scheduled_date)}</span>
                )}
                {today && (
                  <span className="text-[10px] font-semibold text-[hsl(var(--accent-coral))]">Today</span>
                )}
              </div>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}

function WeekView({ items, onSelect }: { items: ContentReview[]; onSelect: (item: ContentReview) => void }) {
  const weeks = new Map<number, ContentReview[]>()
  items.forEach(item => {
    const list = weeks.get(item.week_number) ?? []
    list.push(item)
    weeks.set(item.week_number, list)
  })

  const sortedWeeks = Array.from(weeks.entries()).sort((a, b) => a[0] - b[0])

  return (
    <div className="flex flex-col space-y-8">
      {sortedWeeks.map(([weekNum, weekItems]) => (
        <div key={weekNum} className="rounded-lg border border-[hsl(var(--border-subtle))]">
          {/* Week header bar */}
          <div className="bg-[hsl(var(--bg-elevated))] rounded-t-lg p-3 border-b border-[hsl(var(--border-subtle))]">
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-semibold text-[hsl(var(--text-primary))]">Week {weekNum}</span>
              <Badge variant="neutral">{weekItems.length}</Badge>
            </div>
          </div>
          {/* Items */}
          <div className="flex flex-col gap-2 p-4">
            {weekItems.map((item, idx) => {
              const PIcon = item.platforms[0] ? PLATFORM_ICONS[item.platforms[0]] ?? FileText : FileText
              const today = isItemToday(item)
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.03 }}
                  onClick={() => onSelect(item)}
                  className="flex items-center gap-3 rounded-md p-3 cursor-pointer transition-colors hover:bg-[hsl(var(--bg-elevated))]"
                >
                  <div className="w-14 shrink-0">
                    <span className="text-xs text-[hsl(var(--text-tertiary))]">{item.day_label.slice(0, 3)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[hsl(var(--text-primary))] truncate m-0">{item.post_title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <PIcon size={12} className="text-[hsl(var(--text-tertiary))]" />
                      <SlideInfo slideCount={item.slide_count} />
                    </div>
                  </div>
                  <StatusBadge status={item.status} />
                  {today && (
                    <span className="text-[10px] font-semibold text-[hsl(var(--accent-coral))] bg-[hsl(var(--accent-coral)/0.08)] px-1.5 py-0.5 rounded-full">Today</span>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

function MonthView({ items, onSelect }: { items: ContentReview[]; onSelect: (item: ContentReview) => void }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [direction, setDirection] = useState<'next' | 'prev'>('next')

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  // Build calendar grid days
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const calStart = startOfWeek(monthStart, { weekStartsOn: 1 })
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
    return eachDayOfInterval({ start: calStart, end: calEnd })
  }, [currentMonth])

  // Map items to dates
  const itemsByDate = useMemo(() => {
    const map = new Map<string, ContentReview[]>()
    items.forEach(item => {
      if (item.scheduled_date) {
        const key = format(parseISO(item.scheduled_date), 'yyyy-MM-dd')
        const list = map.get(key) ?? []
        list.push(item)
        map.set(key, list)
      }
    })
    return map
  }, [items])

  const goNext = () => {
    setDirection('next')
    setCurrentMonth(prev => addMonths(prev, 1))
  }

  const goPrev = () => {
    setDirection('prev')
    setCurrentMonth(prev => subMonths(prev, 1))
  }

  const goToday = () => {
    setDirection('next')
    setCurrentMonth(new Date())
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Navigation */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" onClick={goPrev} className="h-8 w-8">
          <ChevronLeft size={16} />
        </Button>
        <h3 className="text-lg font-semibold text-[hsl(var(--text-primary))] min-w-[180px] text-center">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <Button variant="outline" size="icon" onClick={goNext} className="h-8 w-8">
          <ChevronRight size={16} />
        </Button>
        <Button variant="ghost" size="sm" onClick={goToday} className="text-xs ml-1">
          Today
        </Button>
      </div>

      {/* Calendar grid */}
      <motion.div
        key={format(currentMonth, 'yyyy-MM')}
        initial={{ x: direction === 'next' ? 20 : -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {days.map(d => (
            <div key={d} className="text-center text-xs uppercase font-medium text-[hsl(var(--text-tertiary))] py-2">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day) => {
            const dateKey = format(day, 'yyyy-MM-dd')
            const dayItems = itemsByDate.get(dateKey) ?? []
            const inMonth = isSameMonth(day, currentMonth)
            const todayCell = isToday(day)

            return (
              <div
                key={dateKey}
                className={`min-h-[140px] border border-[hsl(var(--border-subtle))] p-2 ${
                  !inMonth ? 'bg-[hsl(var(--bg-elevated)/0.5)]' : 'bg-[hsl(var(--bg-surface))]'
                } ${
                  todayCell ? 'border-t-2 border-t-[hsl(var(--accent-coral))] bg-[hsl(var(--accent-coral)/0.04)]' : ''
                }`}
              >
                <span className={`text-sm font-semibold ${
                  !inMonth
                    ? 'text-[hsl(var(--text-tertiary)/0.4)]'
                    : todayCell
                    ? 'text-[hsl(var(--accent-coral))]'
                    : 'text-[hsl(var(--text-primary))]'
                }`}>
                  {format(day, 'd')}
                </span>
                <div className="flex flex-col gap-1 mt-1">
                  {dayItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => onSelect(item)}
                      className="flex items-center gap-1 rounded px-1.5 py-0.5 text-left transition-colors hover:bg-[hsl(var(--bg-elevated))] w-full"
                    >
                      <StatusBadge status={item.status} className="text-[9px] px-1.5 py-0" />
                      <span className="text-xs text-[hsl(var(--text-primary))] truncate">
                        {item.post_title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}

function KanbanView({ items, onSelect }: { items: ContentReview[]; onSelect: (item: ContentReview) => void }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {kanbanColumns.map(col => {
        const colItems = items.filter(i => i.status === col.status)
        return (
          <div key={col.status}>
            {/* Column header */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-semibold text-[hsl(var(--text-primary))]">{col.label}</span>
              <Badge variant="neutral">{colItems.length}</Badge>
            </div>

            {/* Column body */}
            <div className="max-h-[calc(100vh-280px)] overflow-y-auto rounded-lg bg-[hsl(var(--bg-elevated))] p-2 min-h-[100px]">
              {colItems.length === 0 ? (
                <div className="border-2 border-dashed border-[hsl(var(--border-subtle))] rounded-lg p-8 flex flex-col items-center justify-center gap-2">
                  <Inbox size={24} className="text-[hsl(var(--text-tertiary))] opacity-40" />
                  <span className="text-[13px] text-[hsl(var(--text-tertiary))]">No items</span>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {colItems.map((item, idx) => {
                    const PIcon = item.platforms[0] ? PLATFORM_ICONS[item.platforms[0]] ?? FileText : FileText
                    const today = isItemToday(item)
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: idx * 0.03 }}
                        onClick={() => onSelect(item)}
                        className="bg-[hsl(var(--bg-surface))] border border-[hsl(var(--border-subtle))] rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="text-sm font-medium text-[hsl(var(--text-primary))] line-clamp-2 m-0">
                            {item.post_title}
                          </p>
                          <StatusBadge status={item.status} className="shrink-0" />
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {item.scheduled_date && (
                            <span className="text-xs text-[hsl(var(--text-tertiary))]">{formatShortDate(item.scheduled_date)}</span>
                          )}
                          <SlideInfo slideCount={item.slide_count} />
                          <PIcon size={14} className="text-[hsl(var(--text-tertiary))]" />
                          {today && (
                            <span className="text-[10px] font-semibold text-[hsl(var(--accent-coral))] bg-[hsl(var(--accent-coral)/0.08)] px-1.5 py-0.5 rounded-full">Today</span>
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ----- Main -----
export function ContentPipeline() {
  const [view, setView] = useState<ViewMode>('list')
  const [selected, setSelected] = useState<ContentReview | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const { data: reviews, isLoading } = useContentReviews()

  const items = reviews ?? []

  const handleSelect = (item: ContentReview) => {
    setSelected(item)
    setDetailOpen(true)
  }

  return (
    <PageShell
      title="Content Pipeline"
      subtitle="Manage, review, and schedule your content."
      actions={
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setAddOpen(true)}
            className="bg-[hsl(var(--accent-coral))] hover:bg-[hsl(var(--accent-coral-hover))] text-white gap-1.5"
          >
            <Plus size={14} />
            Add Content
          </Button>
          <div className="flex bg-[hsl(var(--bg-elevated))] rounded-md p-[3px] gap-[2px]">
            {viewModes.map(vm => {
              const Icon = vm.icon
              const isActive = view === vm.key
              return (
                <button
                  key={vm.key}
                  onClick={() => setView(vm.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] border-none cursor-pointer text-xs transition-all ${
                    isActive
                      ? 'font-semibold text-[hsl(var(--text-primary))] bg-[hsl(var(--bg-surface))] shadow-card'
                      : 'text-[hsl(var(--text-tertiary))] bg-transparent'
                  }`}
                >
                  <Icon size={13} />
                  {vm.label}
                </button>
              )
            })}
          </div>
        </div>
      }
    >
      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[0, 1, 2, 3].map(i => (
            <Card key={i} className="p-6 flex flex-col gap-2">
              <SkeletonBlock width="30%" height={12} />
              <SkeletonBlock width="70%" height={16} />
              <SkeletonBlock width="50%" height={12} />
            </Card>
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card className="p-6 text-center py-12">
          <p className="text-sm text-[hsl(var(--text-secondary))]">No content in the pipeline yet.</p>
        </Card>
      ) : (
        <>
          {view === 'list' && <ListView items={items} onSelect={handleSelect} />}
          {view === 'week' && <WeekView items={items} onSelect={handleSelect} />}
          {view === 'month' && <MonthView items={items} onSelect={handleSelect} />}
          {view === 'kanban' && <KanbanView items={items} onSelect={handleSelect} />}
        </>
      )}

      {/* Detail Modal */}
      <ContentDetailDialog
        item={selected}
        open={detailOpen}
        onOpenChange={(open) => {
          setDetailOpen(open)
          if (!open) setSelected(null)
        }}
      />

      {/* Add Content Modal */}
      <AddContentDialog open={addOpen} onOpenChange={setAddOpen} />
    </PageShell>
  )
}
