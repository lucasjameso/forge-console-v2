import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  List,
  Columns3,
  LayoutGrid,
  X,
  Check,
  XCircle,
  MessageSquare,
  Linkedin,
  BookOpen,
  FileText,
  ShoppingBag,
} from 'lucide-react'
import { PageShell } from '@/components/layout/PageShell'
import { ContentCard } from '@/components/pipeline/ContentCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { SkeletonBlock } from '@/components/ui/SkeletonBlock'
import { useContentReviews, useUpdateContentStatus } from '@/hooks/useContentReviews'
import { formatShortDate } from '@/lib/utils'
import type { ContentReview, ContentStatus } from '@/types/database'

type ViewMode = 'list' | 'week' | 'month' | 'kanban'

const viewModes: { key: ViewMode; label: string; icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }> }[] = [
  { key: 'list', label: 'List', icon: List },
  { key: 'week', label: 'Week', icon: Calendar },
  { key: 'month', label: 'Month', icon: LayoutGrid },
  { key: 'kanban', label: 'Kanban', icon: Columns3 },
]

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

const kanbanColumns: { status: ContentStatus; label: string }[] = [
  { status: 'draft', label: 'Draft' },
  { status: 'pending', label: 'Pending Review' },
  { status: 'approved', label: 'Approved' },
  { status: 'posted', label: 'Posted' },
]

// ----- Detail Modal -----
function ContentDetail({ item, onClose }: { item: ContentReview; onClose: () => void }) {
  const updateStatus = useUpdateContentStatus()
  const [feedback, setFeedback] = useState('')
  const [showReject, setShowReject] = useState(false)
  const badge = statusConfig[item.status]
  const PlatformIcon = item.platforms[0] ? platformIcons[item.platforms[0]] ?? FileText : FileText

  const handleApprove = () => {
    updateStatus.mutate({ id: item.id, status: 'approved' })
    onClose()
  }

  const handleReject = () => {
    if (!feedback.trim()) return
    updateStatus.mutate({ id: item.id, status: 'rejected', feedback: feedback.trim() })
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        style={{
          width: '100%',
          maxWidth: 560,
        }}
        onClick={(e) => e.stopPropagation()}
      >
      <div
        style={{
          maxHeight: '80vh',
          overflowY: 'auto',
          backgroundColor: 'hsl(var(--bg-surface))',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid hsl(var(--border-default))',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid hsl(var(--border-subtle))', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span className="text-overline" style={{ color: 'hsl(var(--accent-coral))' }}>
                Week {item.week_number} &middot; {item.day_label}
              </span>
              <Badge variant={badge.variant}>{badge.label}</Badge>
            </div>
            <h3 className="text-section-header" style={{ color: 'hsl(var(--text-primary))', margin: 0 }}>
              {item.post_title}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, flexShrink: 0, marginTop: 2 }}
          >
            <X size={18} style={{ color: 'hsl(var(--text-tertiary))' }} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Caption */}
          {item.caption && (
            <div>
              <span className="text-overline" style={{ color: 'hsl(var(--text-tertiary))', marginBottom: 6, display: 'block' }}>Caption</span>
              <p className="text-body-sm" style={{ color: 'hsl(var(--text-primary))', lineHeight: 1.6, margin: 0 }}>
                {item.caption}
              </p>
            </div>
          )}

          {/* Meta row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, padding: '14px 16px', borderRadius: 'var(--radius-md)', backgroundColor: 'hsl(var(--bg-elevated))' }}>
            <div>
              <span className="text-overline" style={{ color: 'hsl(var(--text-tertiary))', display: 'block', marginBottom: 4 }}>Platform</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <PlatformIcon size={14} style={{ color: 'hsl(var(--text-secondary))' }} />
                <span className="text-body-sm font-medium" style={{ color: 'hsl(var(--text-primary))', textTransform: 'capitalize' }}>
                  {item.platforms.join(', ')}
                </span>
              </div>
            </div>
            <div>
              <span className="text-overline" style={{ color: 'hsl(var(--text-tertiary))', display: 'block', marginBottom: 4 }}>Slides</span>
              <span className="text-body-sm font-medium" style={{ color: 'hsl(var(--text-primary))' }}>{item.slide_count}</span>
            </div>
            <div>
              <span className="text-overline" style={{ color: 'hsl(var(--text-tertiary))', display: 'block', marginBottom: 4 }}>Revision</span>
              <span className="text-body-sm font-medium" style={{ color: 'hsl(var(--text-primary))' }}>{item.revision}</span>
            </div>
            <div>
              <span className="text-overline" style={{ color: 'hsl(var(--text-tertiary))', display: 'block', marginBottom: 4 }}>Scheduled</span>
              <span className="text-body-sm font-medium" style={{ color: 'hsl(var(--text-primary))' }}>{item.scheduled_date ? formatShortDate(item.scheduled_date) : 'Not set'}</span>
            </div>
          </div>

          {/* Feedback if rejected */}
          {item.feedback && (
            <div style={{ padding: '14px 16px', borderRadius: 'var(--radius-md)', backgroundColor: 'hsl(0 80% 97%)', border: '1px solid hsl(var(--status-error) / 0.3)' }}>
              <span className="text-overline" style={{ color: 'hsl(var(--status-error))', display: 'block', marginBottom: 6 }}>Feedback</span>
              <p className="text-body-sm" style={{ color: 'hsl(var(--text-primary))', margin: 0, lineHeight: 1.5 }}>{item.feedback}</p>
            </div>
          )}

          {/* Rejection feedback input */}
          <AnimatePresence>
            {showReject && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MessageSquare size={14} style={{ color: 'hsl(var(--text-tertiary))' }} />
                    <span className="text-body-sm font-medium" style={{ color: 'hsl(var(--text-primary))' }}>Rejection feedback</span>
                  </div>
                  <textarea
                    className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-coral focus:ring-2 focus:ring-coral/10 placeholder:text-muted-foreground font-[inherit]"
                    style={{ minHeight: 80, resize: 'vertical' }}
                    placeholder="What needs to change?"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                  <div style={{ display: 'flex', gap: 8 }}>
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
        {(item.status === 'pending' || item.status === 'draft') && !showReject && (
          <div style={{ padding: '16px 24px', borderTop: '1px solid hsl(var(--border-subtle))', display: 'flex', gap: 8 }}>
            <Button onClick={handleApprove}>
              <Check size={14} />
              Approve
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowReject(true)}
              style={{ color: 'hsl(var(--status-error))' }}
            >
              <XCircle size={14} />
              Reject
            </Button>
          </div>
        )}
      </div>
      </motion.div>
    </motion.div>
  )
}

// ----- Views -----
function ListView({ items, onSelect }: { items: ContentReview[]; onSelect: (item: ContentReview) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map((item, idx) => (
        <ContentCard key={item.id} item={item} index={idx} onClick={() => onSelect(item)} />
      ))}
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {sortedWeeks.map(([weekNum, weekItems]) => (
        <div key={weekNum}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span className="text-section-header">Week {weekNum}</span>
            <Badge variant="neutral">{weekItems.length}</Badge>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {weekItems.map((item, idx) => (
              <ContentCard key={item.id} item={item} index={idx} onClick={() => onSelect(item)} compact />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function MonthView({ items, onSelect }: { items: ContentReview[]; onSelect: (item: ContentReview) => void }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const badge = statusConfig

  // Build a simple 4-week grid
  const weeks = new Map<number, ContentReview[]>()
  items.forEach(item => {
    const list = weeks.get(item.week_number) ?? []
    list.push(item)
    weeks.set(item.week_number, list)
  })

  const dayMap: Record<string, number> = {
    Monday: 0, Tuesday: 1, Wednesday: 2, Thursday: 3, Friday: 4, Saturday: 5, Sunday: 6,
  }

  const sortedWeeks = Array.from(weeks.entries()).sort((a, b) => a[0] - b[0])

  const weekCount = sortedWeeks.length || 1

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 200px)' }}>
      {/* Header */}
      <div style={{ display: 'grid', gridTemplateColumns: `64px repeat(7, 1fr)`, gap: 2, marginBottom: 2, flexShrink: 0 }}>
        <div style={{ padding: '8px 12px' }} />
        {days.map(d => (
          <div key={d} className="text-caption font-semibold" style={{ padding: '8px 12px', color: 'hsl(var(--text-tertiary))', textAlign: 'center' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Rows -- expand to fill available height */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {sortedWeeks.map(([weekNum, weekItems]) => (
          <div key={weekNum} style={{ flex: 1, display: 'grid', gridTemplateColumns: `64px repeat(7, 1fr)`, gap: 2, minHeight: `${Math.max(150, 700 / weekCount)}px` }}>
            <div style={{ padding: '12px 8px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
              <span className="text-caption font-semibold" style={{ color: 'hsl(var(--text-secondary))' }}>Wk {weekNum}</span>
            </div>
            {days.map((_, dayIdx) => {
              const dayItem = weekItems.find(i => dayMap[i.day_label] === dayIdx)
              return (
                <div
                  key={dayIdx}
                  style={{
                    padding: 8,
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: dayItem ? 'hsl(var(--bg-surface))' : 'hsl(var(--bg-elevated))',
                    border: `1px solid hsl(var(${dayItem ? '--border-default' : '--border-subtle'}))`,
                    cursor: dayItem ? 'pointer' : undefined,
                    transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
                    boxShadow: dayItem ? 'var(--shadow-card)' : 'none',
                  }}
                  onClick={() => dayItem && onSelect(dayItem)}
                  onMouseEnter={(e) => { if (dayItem) e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)' }}
                  onMouseLeave={(e) => { if (dayItem) e.currentTarget.style.boxShadow = 'var(--shadow-card)' }}
                >
                  {dayItem && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <p className="text-body-sm font-medium" style={{ color: 'hsl(var(--text-primary))', margin: 0, lineHeight: 1.3 }}>
                        {dayItem.post_title.length > 40 ? dayItem.post_title.slice(0, 40) + '...' : dayItem.post_title}
                      </p>
                      <Badge variant={badge[dayItem.status].variant}>
                        {badge[dayItem.status].label}
                      </Badge>
                      {dayItem.scheduled_date && (
                        <span className="text-caption">{formatShortDate(dayItem.scheduled_date)}</span>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

function KanbanView({ items, onSelect }: { items: ContentReview[]; onSelect: (item: ContentReview) => void }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${kanbanColumns.length}, 1fr)`, gap: 16 }}>
      {kanbanColumns.map(col => {
        const colItems = items.filter(i => i.status === col.status)
        const colBadge = statusConfig[col.status]
        return (
          <div key={col.status}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span className="text-body-sm font-semibold" style={{ color: 'hsl(var(--text-primary))' }}>{col.label}</span>
              <Badge variant={colBadge.variant}>{colItems.length}</Badge>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                minHeight: 100,
                padding: 8,
                borderRadius: 10,
                backgroundColor: 'hsl(var(--bg-elevated))',
                border: '1px dashed var(--border-subtle)',
              }}
            >
              {colItems.map((item, idx) => {
                const PIcon = item.platforms[0] ? platformIcons[item.platforms[0]] ?? FileText : FileText
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.03 }}
                    onClick={() => onSelect(item)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 8,
                      backgroundColor: 'hsl(var(--bg-surface))',
                      border: '1px solid hsl(var(--border-subtle))',
                      cursor: 'pointer',
                    }}
                  >
                    <p className="text-body-sm font-medium" style={{ color: 'hsl(var(--text-primary))', margin: '0 0 6px' }}>
                      {item.post_title}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <PIcon size={12} style={{ color: 'hsl(var(--text-tertiary))' }} />
                      <span className="text-caption">{item.slide_count} slides</span>
                      {item.scheduled_date && (
                        <span className="text-caption">{formatShortDate(item.scheduled_date)}</span>
                      )}
                    </div>
                  </motion.div>
                )
              })}
              {colItems.length === 0 && (
                <p className="text-caption" style={{ textAlign: 'center', padding: 12 }}>None</p>
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
  const { data: reviews, isLoading } = useContentReviews()

  const items = reviews ?? []

  return (
    <PageShell
      title="Content Pipeline"
      subtitle="Manage, review, and schedule your content."
      actions={
        <div
          style={{
            display: 'flex',
            backgroundColor: 'hsl(var(--bg-elevated))',
            borderRadius: 'var(--radius-md)',
            padding: 3,
            gap: 2,
          }}
        >
          {viewModes.map(vm => {
            const Icon = vm.icon
            const isActive = view === vm.key
            return (
              <button
                key={vm.key}
                onClick={() => setView(vm.key)}
                className={`text-caption ${isActive ? 'font-semibold' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '6px 12px',
                  borderRadius: 7,
                  border: 'none',
                  cursor: 'pointer',
                  color: isActive ? 'hsl(var(--text-primary))' : 'hsl(var(--text-tertiary))',
                  backgroundColor: isActive ? 'hsl(var(--bg-surface))' : 'transparent',
                  boxShadow: isActive ? 'var(--shadow-card)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={13} />
                {vm.label}
              </button>
            )
          })}
        </div>
      }
    >
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[0, 1, 2, 3].map(i => (
            <Card key={i} className="p-6" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <SkeletonBlock width="30%" height={12} />
              <SkeletonBlock width="70%" height={16} />
              <SkeletonBlock width="50%" height={12} />
            </Card>
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card className="p-6" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <p className="text-body">No content in the pipeline yet.</p>
        </Card>
      ) : (
        <>
          {view === 'list' && <ListView items={items} onSelect={setSelected} />}
          {view === 'week' && <WeekView items={items} onSelect={setSelected} />}
          {view === 'month' && <MonthView items={items} onSelect={setSelected} />}
          {view === 'kanban' && <KanbanView items={items} onSelect={setSelected} />}
        </>
      )}

      <AnimatePresence>
        {selected && (
          <ContentDetail item={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </PageShell>
  )
}
