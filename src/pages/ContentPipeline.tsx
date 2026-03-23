import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core'
import {
  Calendar,
  List,
  Columns3,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  Layers,
  Plus,
  MoreHorizontal,
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
  getWeek,
  isToday,
  parseISO,
} from 'date-fns'
import { cn } from '@/lib/utils'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { useContentReviews, useUpdateContentStatus, useUpdateScheduledDate, useCreateContent, useDeleteContent } from '@/hooks/useContentReviews'
import { useBulkSelection } from '@/hooks/useBulkSelection'
import { ContentReviewModal } from '@/components/pipeline/ContentReviewModal'
import { TemplatesTab } from '@/components/pipeline/TemplatesTab'
import { AnalyticsStrip } from '@/components/pipeline/AnalyticsStrip'
import { DraggableContentCard } from '@/components/pipeline/DraggableContentCard'
import { DroppableColumn } from '@/components/pipeline/DroppableColumn'
import { DroppableDateCell } from '@/components/pipeline/DroppableDateCell'
import { DragOverlayCard } from '@/components/pipeline/DragOverlayCard'
import { BulkActionBar } from '@/components/pipeline/BulkActionBar'
import { formatShortDate } from '@/lib/utils'
import type { ContentReview, ContentStatus, ContentType } from '@/types/database'

type ViewMode = 'list' | 'week' | 'month' | 'kanban' | 'templates'

const viewModes: { key: ViewMode; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { key: 'list', label: 'List', icon: List },
  { key: 'week', label: 'Week', icon: Calendar },
  { key: 'month', label: 'Month', icon: LayoutGrid },
  { key: 'kanban', label: 'Kanban', icon: Columns3 },
  { key: 'templates', label: 'Templates', icon: Layers },
]


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

// ----- Character Count Indicator -----
function CharCountIndicator({ count }: { count: number }) {
  const color =
    count >= 1200 && count <= 1600
      ? 'text-[hsl(var(--status-success))]'
      : count > 3000
        ? 'text-[hsl(var(--status-error))]'
        : 'text-[hsl(var(--status-warning))]'
  return (
    <span className={cn('text-xs font-medium', color)}>
      {count.toLocaleString()} characters
      {count >= 1200 && count <= 1600 && ' (optimal)'}
    </span>
  )
}

// ----- Platform helpers -----
const addContentPlatformOptions = ['linkedin', 'facebook', 'x', 'instagram', 'tiktok']

function platformDisplayName(p: string): string {
  if (p === 'x') return 'X/Twitter'
  return p.charAt(0).toUpperCase() + p.slice(1)
}

// ----- Platform Tags Component -----
function PlatformTags({ platforms }: { platforms: string[] }) {
  const displayPlatforms = platforms.length > 0 ? platforms : ['linkedin']
  return (
    <div className="flex gap-1">
      {displayPlatforms.map(p => (
        <Badge key={p} variant="outline" className="text-[10px] capitalize">{platformDisplayName(p)}</Badge>
      ))}
    </div>
  )
}

// ----- Add Content Modal -----
interface NewContentState {
  title: string
  body: string
  content_type: ContentType
  scheduledDate: string
  dayLabel: string
  platforms: string[]
  series: string
  notes: string
}

const initialNewContent: NewContentState = {
  title: '',
  body: '',
  content_type: 'text',
  scheduledDate: '',
  dayLabel: 'Monday',
  platforms: ['linkedin'],
  series: '',
  notes: '',
}

function AddContentDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [newContent, setNewContent] = useState<NewContentState>(initialNewContent)
  const createContent = useCreateContent()

  const dayOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  const weekNum = newContent.scheduledDate
    ? getWeek(new Date(newContent.scheduledDate), { weekStartsOn: 1 })
    : null

  const togglePlatform = (p: string) => {
    setNewContent(prev => ({
      ...prev,
      platforms: prev.platforms.includes(p)
        ? prev.platforms.filter(x => x !== p)
        : [...prev.platforms, p],
    }))
  }

  const handleCreate = () => {
    createContent.mutate({
      post_title: newContent.title,
      caption: newContent.body || null,
      content_type: newContent.content_type,
      scheduled_date: newContent.scheduledDate || null,
      day_label: newContent.dayLabel,
      week_number: weekNum,
      platforms: newContent.platforms,
      series: newContent.series || null,
      notes: newContent.notes || null,
    }, {
      onSuccess: () => {
        setNewContent(initialNewContent)
        onOpenChange(false)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
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
              className="w-full rounded-[var(--radius-md)] border border-input bg-card px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-coral focus:ring-2 focus:ring-coral/10 placeholder:text-muted-foreground"
              placeholder="Post title..."
              value={newContent.title}
              onChange={e => setNewContent(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          {/* Post Body */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-[hsl(var(--text-tertiary))] mb-1.5">Post Body</label>
            <textarea
              className="w-full min-h-[300px] resize-y rounded-[var(--radius-md)] border border-input bg-card px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-coral focus:ring-2 focus:ring-coral/10 placeholder:text-muted-foreground font-[inherit]"
              placeholder="Write your post content..."
              value={newContent.body}
              onChange={e => setNewContent(prev => ({ ...prev, body: e.target.value }))}
            />
            <div className="mt-1">
              <CharCountIndicator count={newContent.body.length} />
            </div>
          </div>

          {/* Content Type */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-[hsl(var(--text-tertiary))] mb-1.5">Content Type</label>
            <Select
              value={newContent.content_type}
              onValueChange={(v: ContentType) => setNewContent(prev => ({ ...prev, content_type: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text Post</SelectItem>
                <SelectItem value="carousel">Carousel</SelectItem>
                <SelectItem value="visual_quote">Visual Quote</SelectItem>
                <SelectItem value="poll">Poll</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Platforms */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-[hsl(var(--text-tertiary))] mb-1.5">Platforms</label>
            <div className="flex flex-wrap gap-2">
              {addContentPlatformOptions.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePlatform(p)}
                  className={cn(
                    'px-3 py-1 text-xs rounded-[var(--radius-pill)] border transition-colors capitalize',
                    newContent.platforms.includes(p)
                      ? 'bg-[hsl(var(--accent-coral))] text-white border-[hsl(var(--accent-coral))]'
                      : 'border-[hsl(var(--border-default))] text-[hsl(var(--text-secondary))] hover:bg-[hsl(var(--bg-elevated))]'
                  )}
                >
                  {platformDisplayName(p)}
                </button>
              ))}
            </div>
          </div>

          {/* Scheduled date + Week number */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-[hsl(var(--text-tertiary))] mb-1.5">Scheduled Date</label>
              <input
                type="date"
                className="w-full rounded-[var(--radius-md)] border border-input bg-card px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-coral focus:ring-2 focus:ring-coral/10"
                value={newContent.scheduledDate}
                onChange={e => setNewContent(prev => ({ ...prev, scheduledDate: e.target.value }))}
              />
              {weekNum !== null && (
                <div className="text-sm text-[hsl(var(--text-secondary))] mt-1">Week {weekNum}</div>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-[hsl(var(--text-tertiary))] mb-1.5">Day</label>
              <select
                className="w-full rounded-[var(--radius-md)] border border-input bg-card px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-coral focus:ring-2 focus:ring-coral/10"
                value={newContent.dayLabel}
                onChange={e => setNewContent(prev => ({ ...prev, dayLabel: e.target.value }))}
              >
                {dayOptions.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Series/Arc */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-[hsl(var(--text-tertiary))] mb-1.5">Series / Arc</label>
            <input
              type="text"
              className="w-full rounded-[var(--radius-md)] border border-input bg-card px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-coral focus:ring-2 focus:ring-coral/10 placeholder:text-muted-foreground"
              placeholder="Series/Arc tag (e.g., CLARITY Launch, Ridgeline Origins)"
              value={newContent.series}
              onChange={e => setNewContent(prev => ({ ...prev, series: e.target.value }))}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-[hsl(var(--text-tertiary))] mb-1.5">Notes</label>
            <textarea
              className="w-full min-h-[60px] resize-y rounded-[var(--radius-md)] border border-input bg-card px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-coral focus:ring-2 focus:ring-coral/10 placeholder:text-muted-foreground font-[inherit]"
              placeholder="Internal notes (not published)"
              value={newContent.notes}
              onChange={e => setNewContent(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={handleCreate}
            disabled={!newContent.title.trim() || createContent.isPending}
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
function ListView({
  items,
  onSelect,
  selection,
}: {
  items: ContentReview[]
  onSelect: (item: ContentReview) => void
  selection: { isSelected: (id: string) => boolean; toggle: (id: string) => void }
}) {
  return (
    <div className="flex flex-col gap-2.5">
      {items.map((item, idx) => {
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
            >
              {/* Checkbox */}
              <div className="shrink-0">
                <input
                  type="checkbox"
                  checked={selection.isSelected(item.id)}
                  onChange={() => selection.toggle(item.id)}
                  className="h-4 w-4 rounded border-[hsl(var(--border-default))] accent-[hsl(var(--accent-coral))] cursor-pointer"
                />
              </div>

              {/* Left: week/date */}
              <div className="flex flex-col items-center w-16 shrink-0" onClick={() => onSelect(item)}>
                <span className="text-xs text-[hsl(var(--text-tertiary))]">Wk {item.week_number}</span>
                <span className="text-xs text-[hsl(var(--text-tertiary))]">{item.day_label.slice(0, 3)}</span>
              </div>

              {/* Center: title + caption */}
              <div className="flex-1 min-w-0" onClick={() => onSelect(item)}>
                <p className="text-sm font-medium text-[hsl(var(--text-primary))] truncate m-0">{item.post_title}</p>
                {item.caption && (
                  <p className="text-[13px] text-[hsl(var(--text-secondary))] line-clamp-1 m-0 mt-0.5">{item.caption}</p>
                )}
                {/* Bottom metadata */}
                <div className="flex items-center gap-3 mt-1">
                  <PlatformTags platforms={item.platforms} />
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

function WeekView({
  items,
  onSelect,
  selection,
}: {
  items: ContentReview[]
  onSelect: (item: ContentReview) => void
  selection: { isSelected: (id: string) => boolean; toggle: (id: string) => void }
}) {
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
              const today = isItemToday(item)
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.03 }}
                  className="flex items-center gap-3 rounded-md p-3 transition-colors hover:bg-[hsl(var(--bg-elevated))]"
                >
                  <div className="shrink-0">
                    <input
                      type="checkbox"
                      checked={selection.isSelected(item.id)}
                      onChange={() => selection.toggle(item.id)}
                      className="h-4 w-4 rounded border-[hsl(var(--border-default))] accent-[hsl(var(--accent-coral))] cursor-pointer"
                    />
                  </div>
                  <div className="w-14 shrink-0 cursor-pointer" onClick={() => onSelect(item)}>
                    <span className="text-xs text-[hsl(var(--text-tertiary))]">{item.day_label.slice(0, 3)}</span>
                  </div>
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onSelect(item)}>
                    <p className="text-sm font-medium text-[hsl(var(--text-primary))] truncate m-0">{item.post_title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <PlatformTags platforms={item.platforms} />
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

function MonthView({
  items,
  onSelect,
  activeItem,
  onDragStart,
  onDragEnd,
  sensors,
  selection,
}: {
  items: ContentReview[]
  onSelect: (item: ContentReview) => void
  activeItem: ContentReview | null
  onDragStart: (event: DragStartEvent) => void
  onDragEnd: (event: DragEndEvent) => void
  sensors: ReturnType<typeof useSensors>
  selection: { isSelected: (id: string) => boolean; toggle: (id: string) => void }
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1)

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
    setSlideDirection(1)
    setCurrentMonth(prev => addMonths(prev, 1))
  }

  const goPrev = () => {
    setSlideDirection(-1)
    setCurrentMonth(prev => subMonths(prev, 1))
  }

  const goToday = () => {
    const now = new Date()
    setSlideDirection(now > currentMonth ? 1 : -1)
    setCurrentMonth(now)
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

      {/* Calendar grid wrapped in DndContext */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={format(currentMonth, 'yyyy-MM')}
            initial={{ x: slideDirection * 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: slideDirection * -60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30, duration: 0.2 }}
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
            <div className="grid grid-cols-7 gap-px w-full">
              {calendarDays.map((day) => {
                const dateKey = format(day, 'yyyy-MM-dd')
                const dayItems = itemsByDate.get(dateKey) ?? []
                const inMonth = isSameMonth(day, currentMonth)
                const todayCell = isToday(day)

                return (
                  <DroppableDateCell
                    key={dateKey}
                    dateKey={dateKey}
                    isCurrentMonth={inMonth}
                    isToday={todayCell}
                    dayNumber={format(day, 'd')}
                  >
                    {dayItems.map(item => (
                      <DraggableContentCard
                        key={item.id}
                        item={item}
                        onSelect={onSelect}
                        isSelected={selection.isSelected(item.id)}
                        onToggleSelect={selection.toggle}
                        showCheckbox="hover"
                        enableDrag={true}
                        isTopPerformer={false}
                      />
                    ))}
                  </DroppableDateCell>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        <DragOverlay>
          {activeItem && <DragOverlayCard item={activeItem} />}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

const kanbanStatusOptions: ContentStatus[] = ['draft', 'pending', 'approved', 'posted']

function KanbanView({
  items,
  onSelect,
  onMoveStatus,
  activeItem,
  onDragStart,
  onDragEnd,
  sensors,
  selection,
}: {
  items: ContentReview[]
  onSelect: (item: ContentReview) => void
  onMoveStatus: (id: string, newStatus: ContentStatus) => void
  activeItem: ContentReview | null
  onDragStart: (event: DragStartEvent) => void
  onDragEnd: (event: DragEndEvent) => void
  sensors: ReturnType<typeof useSensors>
  selection: { isSelected: (id: string) => boolean; toggle: (id: string) => void }
}) {
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="grid grid-cols-4 gap-4">
        {kanbanColumns.map(col => {
          const colItems = items.filter(i => i.status === col.status)
          return (
            <DroppableColumn
              key={col.status}
              id={col.status}
              label={col.label}
              count={colItems.length}
            >
              {colItems.map((item) => (
                <DraggableContentCard
                  key={item.id}
                  item={item}
                  onSelect={onSelect}
                  isSelected={selection.isSelected(item.id)}
                  onToggleSelect={selection.toggle}
                  showCheckbox="always"
                  enableDrag={true}
                >
                  {/* Preserve click-to-move dropdown per D-02 */}
                  <div className="absolute top-2 right-2 z-10">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="h-6 w-6 flex items-center justify-center rounded-[var(--radius-sm)] hover:bg-[hsl(var(--bg-elevated))] transition-colors"
                          onClick={e => e.stopPropagation()}
                        >
                          <MoreHorizontal className="w-4 h-4 text-[hsl(var(--text-tertiary))]" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {kanbanStatusOptions
                          .filter(s => s !== item.status)
                          .map(s => (
                            <DropdownMenuItem
                              key={s}
                              onClick={(e) => {
                                e.stopPropagation()
                                onMoveStatus(item.id, s)
                              }}
                            >
                              Move to {s.replace('_', ' ')}
                            </DropdownMenuItem>
                          ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </DraggableContentCard>
              ))}
            </DroppableColumn>
          )
        })}
      </div>

      <DragOverlay>
        {activeItem && <DragOverlayCard item={activeItem} />}
      </DragOverlay>
    </DndContext>
  )
}

// ----- Main -----
export function ContentPipeline() {
  const [view, setView] = useState<ViewMode>('list')
  const [selected, setSelected] = useState<ContentReview | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [activeItem, setActiveItem] = useState<ContentReview | null>(null)
  const { data: reviews, isLoading } = useContentReviews()
  const updateStatus = useUpdateContentStatus()
  const updateScheduledDate = useUpdateScheduledDate()
  const deleteContent = useDeleteContent()
  const selection = useBulkSelection()

  const items = reviews ?? []

  // DnD sensors with distance constraint to allow clicks (per research pitfall 4)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  const handleSelect = (item: ContentReview) => {
    setSelected(item)
    setDetailOpen(true)
  }

  const handleApprove = (id: string) => {
    updateStatus.mutate({ id, status: 'approved' })
    setDetailOpen(false)
    setSelected(null)
  }

  const handleReject = (id: string, reason: string) => {
    updateStatus.mutate({ id, status: 'rejected', feedback: reason })
    setDetailOpen(false)
    setSelected(null)
  }

  const handleMoveStatus = (id: string, newStatus: ContentStatus) => {
    updateStatus.mutate({ id, status: newStatus })
    toast.success(`Moved to ${newStatus.replace('_', ' ')}`)
  }

  // Drag handlers
  const handleDragStart = (event: DragStartEvent) => {
    const draggedId = event.active.id as string
    const found = items.find(i => i.id === draggedId) ?? null
    setActiveItem(found)
  }

  const handleKanbanDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveItem(null)
    if (!over) return

    const itemId = active.id as string
    const newStatus = over.id as ContentStatus
    const item = items.find(i => i.id === itemId)
    if (!item || item.status === newStatus) return

    updateStatus.mutate({ id: itemId, status: newStatus })
    toast.success(`Moved to ${newStatus.replace('_', ' ')}`)
  }

  const handleMonthDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveItem(null)
    if (!over) return

    const itemId = active.id as string
    const newDate = over.id as string
    const item = items.find(i => i.id === itemId)
    if (!item) return

    // Only update if the date actually changed
    if (item.scheduled_date === newDate) return

    updateScheduledDate.mutate({ id: itemId, scheduled_date: newDate })
    toast.success(`Rescheduled to ${newDate}`)
  }

  // Bulk action handlers
  const handleBulkApproveAll = () => {
    selection.selectedIds.forEach(id => {
      updateStatus.mutate({ id, status: 'approved' })
    })
    selection.deselectAll()
    toast.success('All selected items approved')
  }

  const handleBulkMoveToDraft = () => {
    selection.selectedIds.forEach(id => {
      updateStatus.mutate({ id, status: 'draft' })
    })
    selection.deselectAll()
    toast.success('All selected items moved to draft')
  }

  const handleBulkDelete = () => {
    selection.selectedIds.forEach(id => {
      deleteContent.mutate({ id })
    })
    selection.deselectAll()
  }

  const handleBulkReschedule = () => {
    // Placeholder -- date picker integration in future iteration
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-lg)] border-none cursor-pointer text-xs transition-all ${
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
      {/* Analytics Strip */}
      {!isLoading && items.length > 0 && (
        <AnalyticsStrip items={items} currentMonth={new Date()} />
      )}

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
      ) : view === 'templates' ? (
        <TemplatesTab />
      ) : items.length === 0 ? (
        <Card className="p-6 text-center py-12">
          <p className="text-sm text-[hsl(var(--text-secondary))]">No content in the pipeline yet.</p>
        </Card>
      ) : (
        <>
          {view === 'list' && <ListView items={items} onSelect={handleSelect} selection={selection} />}
          {view === 'week' && <WeekView items={items} onSelect={handleSelect} selection={selection} />}
          {view === 'month' && (
            <MonthView
              items={items}
              onSelect={handleSelect}
              activeItem={activeItem}
              onDragStart={handleDragStart}
              onDragEnd={handleMonthDragEnd}
              sensors={sensors}
              selection={selection}
            />
          )}
          {view === 'kanban' && (
            <KanbanView
              items={items}
              onSelect={handleSelect}
              onMoveStatus={handleMoveStatus}
              activeItem={activeItem}
              onDragStart={handleDragStart}
              onDragEnd={handleKanbanDragEnd}
              sensors={sensors}
              selection={selection}
            />
          )}
        </>
      )}

      {/* Bulk Action Bar */}
      <BulkActionBar
        count={selection.count}
        onApproveAll={handleBulkApproveAll}
        onMoveToDraft={handleBulkMoveToDraft}
        onReschedule={handleBulkReschedule}
        onDelete={handleBulkDelete}
        onDeselectAll={selection.deselectAll}
      />

      {/* Detail Modal */}
      <ContentReviewModal
        item={selected}
        open={detailOpen}
        onOpenChange={(open) => {
          setDetailOpen(open)
          if (!open) setSelected(null)
        }}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      {/* Add Content Modal */}
      <AddContentDialog open={addOpen} onOpenChange={setAddOpen} />
    </PageShell>
  )
}
