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
      <Card
        style={{
          maxHeight: '80vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-modal)',
          padding: 0,
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid hsl(var(--border-subtle))', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'hsl(var(--accent-coral))', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Week {item.week_number} - {item.day_label}
              </span>
              <Badge variant={badge.variant}>{badge.label}</Badge>
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: 'hsl(var(--text-primary))', margin: 0 }}>
              {item.post_title}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
          >
            <X size={18} style={{ color: 'hsl(var(--text-tertiary))' }} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Caption */}
          {item.caption && (
            <div>
              <span className="text-caption" style={{ marginBottom: 4, display: 'block' }}>Caption</span>
              <p style={{ fontSize: 14, color: 'hsl(var(--text-primary))', lineHeight: 1.6, margin: 0 }}>
                {item.caption}
              </p>
            </div>
          )}

          {/* Meta */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <span className="text-caption">Platform</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                <PlatformIcon size={14} style={{ color: 'hsl(var(--text-secondary))' }} />
                <span style={{ fontSize: 13, color: 'hsl(var(--text-primary))', textTransform: 'capitalize' }}>
                  {item.platforms.join(', ')}
                </span>
              </div>
            </div>
            <div>
              <span className="text-caption">Slides</span>
              <p style={{ fontSize: 13, color: 'hsl(var(--text-primary))', margin: '4px 0 0' }}>{item.slide_count}</p>
            </div>
            <div>
              <span className="text-caption">Revision</span>
              <p style={{ fontSize: 13, color: 'hsl(var(--text-primary))', margin: '4px 0 0' }}>{item.revision}</p>
            </div>
            {item.scheduled_date && (
              <div>
                <span className="text-caption">Scheduled</span>
                <p style={{ fontSize: 13, color: 'hsl(var(--text-primary))', margin: '4px 0 0' }}>{formatShortDate(item.scheduled_date)}</p>
              </div>
            )}
          </div>

          {/* Feedback if rejected */}
          {item.feedback && (
            <div style={{ padding: '12px 14px', borderRadius: 8, backgroundColor: 'hsl(var(--status-error-bg))', border: '1px solid hsl(var(--status-error))' }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'hsl(var(--status-error))', textTransform: 'uppercase' }}>Feedback</span>
              <p style={{ fontSize: 13, color: 'hsl(var(--text-primary))', margin: '4px 0 0' }}>{item.feedback}</p>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MessageSquare size={14} style={{ color: 'hsl(var(--text-tertiary))' }} />
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'hsl(var(--text-primary))' }}>Rejection feedback</span>
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
      </Card>
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

  return (
    <div style={{ overflowX: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'grid', gridTemplateColumns: `80px repeat(7, 1fr)`, gap: 1, marginBottom: 1 }}>
        <div style={{ padding: '8px 12px' }} />
        {days.map(d => (
          <div key={d} style={{ padding: '8px 12px', fontSize: 12, fontWeight: 600, color: 'hsl(var(--text-tertiary))', textAlign: 'center' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Rows */}
      {sortedWeeks.map(([weekNum, weekItems]) => (
        <div key={weekNum} style={{ display: 'grid', gridTemplateColumns: `80px repeat(7, 1fr)`, gap: 1, marginBottom: 1 }}>
          <div style={{ padding: '12px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'hsl(var(--text-secondary))' }}>Wk {weekNum}</span>
          </div>
          {days.map((_, dayIdx) => {
            const dayItem = weekItems.find(i => dayMap[i.day_label] === dayIdx)
            return (
              <div
                key={dayIdx}
                style={{
                  padding: 6,
                  minHeight: 80,
                  borderRadius: 8,
                  backgroundColor: dayItem ? 'hsl(var(--bg-surface))' : 'hsl(var(--bg-elevated))',
                  border: '1px solid hsl(var(--border-subtle))',
                  cursor: dayItem ? 'pointer' : undefined,
                }}
                onClick={() => dayItem && onSelect(dayItem)}
              >
                {dayItem && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <p style={{ fontSize: 11, fontWeight: 500, color: 'hsl(var(--text-primary))', margin: 0, lineHeight: 1.3 }}>
                      {dayItem.post_title.length > 30 ? dayItem.post_title.slice(0, 30) + '...' : dayItem.post_title}
                    </p>
                    <Badge variant={badge[dayItem.status].variant}>
                      {badge[dayItem.status].label}
                    </Badge>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ))}
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
              <span style={{ fontSize: 13, fontWeight: 600, color: 'hsl(var(--text-primary))' }}>{col.label}</span>
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
                    <p style={{ fontSize: 13, fontWeight: 500, color: 'hsl(var(--text-primary))', margin: '0 0 6px' }}>
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
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '6px 12px',
                  borderRadius: 7,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: isActive ? 600 : 400,
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
