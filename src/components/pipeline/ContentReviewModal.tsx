import { useState, useRef, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { StatusBadge } from '@/components/ui/StatusBadge'
import {
  Copy,
  Check,
  X,
  Calendar,
  Layers,
  Pencil,
  Eye,
  Clock,
  BarChart3,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { formatShortDate } from '@/lib/utils'
import { useUpdateCaption } from '@/hooks/useContentReviews'
import { useCreateVersion } from '@/hooks/useContentVersions'
import { useN8nWebhook } from '@/hooks/useN8nWebhook'
import { AiRefinementPanel } from '@/components/pipeline/AiRefinementPanel'
import { RevisionHistory } from '@/components/pipeline/RevisionHistory'
import { PerformanceCard } from '@/components/pipeline/PerformanceCard'
import type { ContentReview } from '@/types/database'

// ----- Helpers -----

async function copyToClipboard(text: string, label = 'Text') {
  try {
    await navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard`)
  } catch {
    toast.error('Failed to copy to clipboard')
  }
}

function stripHashtags(text: string): string {
  return text.replace(/#\w+/g, '').replace(/\s{2,}/g, ' ').trim()
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

// ----- Content Type Badge -----

function contentTypeBadge(slideCount: number): string {
  if (slideCount > 1) return 'Carousel'
  if (slideCount === 1) return 'Visual Quote'
  return 'Text'
}

// ----- Props -----

interface ContentReviewModalProps {
  item: ContentReview | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onApprove: (id: string) => void
  onReject: (id: string, reason: string) => void
}

// ----- Component -----

export function ContentReviewModal({
  item,
  open,
  onOpenChange,
  onApprove,
  onReject,
}: ContentReviewModalProps) {
  const [showRejectInput, setShowRejectInput] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editCaption, setEditCaption] = useState('')
  const [activePlatformTab, setActivePlatformTab] = useState(0)
  const [publishTime, setPublishTime] = useState('')
  const lastSavedRef = useRef<string>('')

  const updateCaption = useUpdateCaption()
  const createVersion = useCreateVersion()
  const { fireWebhook } = useN8nWebhook()

  // Reset state when item changes
  const prevItemIdRef = useRef<string | null>(null)
  if (item && item.id !== prevItemIdRef.current) {
    prevItemIdRef.current = item.id
    const caption = item.caption ?? ''
    setEditCaption(caption)
    lastSavedRef.current = caption
    setIsEditing(false)
    setActivePlatformTab(0)
    setPublishTime('')
  }

  const handleApplySuggestion = useCallback((original: string, revised: string) => {
    setEditCaption((prev) => prev.replace(original, revised))
    setIsEditing(true)
    toast.success('Suggestion applied')
  }, [])

  if (!item) return null

  const postText = isEditing ? editCaption : (item.caption ?? '')
  const charCount = postText.length
  const typeLabel = contentTypeBadge(item.slide_count)

  // Carousel slide placeholders
  const slideCount = item.slide_count
  const slidesData = item.slides ?? []

  const handleBlurSave = () => {
    if (editCaption === lastSavedRef.current) return
    updateCaption.mutate({ id: item.id, caption: editCaption })
    createVersion.mutate({
      content_id: item.id,
      revision: item.revision + 1,
      caption: editCaption,
      change_summary: 'Manual edit',
    })
    lastSavedRef.current = editCaption
    toast.success('Caption saved')
  }

  const handleApproveClick = () => {
    onApprove(item.id)
    void fireWebhook({
      action: 'approved',
      post_title: item.post_title,
      scheduled_date: item.scheduled_date,
      platform: item.platforms[0] ?? 'linkedin',
    })
    toast.success('Content approved')
  }

  const handleRejectConfirm = () => {
    if (!rejectReason.trim()) return
    onReject(item.id, rejectReason.trim())
    void fireWebhook({
      action: 'rejected',
      post_title: item.post_title,
      scheduled_date: item.scheduled_date,
      platform: item.platforms[0] ?? 'linkedin',
      rejection_reason: rejectReason.trim(),
    })
    toast.success('Content rejected with reason logged')
    setShowRejectInput(false)
    setRejectReason('')
  }

  const handleClose = (openState: boolean) => {
    if (!openState) {
      setShowRejectInput(false)
      setRejectReason('')
      setIsEditing(false)
    }
    onOpenChange(openState)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[720px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          {/* 1. Header: Platform tags, type badge, status, date */}
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <Badge className="bg-[hsl(var(--accent-coral))] text-white text-[10px] uppercase tracking-wider">
              {typeLabel}
            </Badge>
            <StatusBadge status={item.status} />
            {item.platforms.map((p) => (
              <Badge key={p} variant="outline" className="text-[10px] capitalize">
                {p}
              </Badge>
            ))}
            {item.scheduled_date && (
              <span className="flex items-center gap-1 text-xs text-[hsl(var(--text-tertiary))]">
                <Calendar className="w-3 h-3" />
                {formatShortDate(item.scheduled_date)}
              </span>
            )}
          </div>
          <DialogTitle className="text-lg font-semibold text-[hsl(var(--text-primary))]">
            {item.post_title}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Review content: {item.post_title}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Ready to Post / Copy Post (approved items) */}
          {item.status === 'approved' && (
            <div className="flex items-center gap-3 p-3 bg-[hsl(var(--status-success))]/10 border border-[hsl(var(--status-success))]/30 rounded-[var(--radius-md)]">
              <Badge className="bg-[hsl(var(--status-success))] text-white">
                Ready to Post
              </Badge>
              <Button
                size="sm"
                onClick={() => copyToClipboard(postText, 'Post text')}
                className="bg-[hsl(var(--status-success))] hover:bg-[hsl(var(--status-success))]/90 text-white"
              >
                <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy Post Text
              </Button>
            </div>
          )}

          {/* 2. Multi-platform tabs */}
          {item.platforms.length > 1 && (
            <div className="flex gap-1.5">
              {item.platforms.map((p, idx) => (
                <Badge
                  key={p}
                  variant={idx === activePlatformTab ? 'default' : 'outline'}
                  className={cn(
                    'cursor-pointer capitalize transition-colors',
                    idx === activePlatformTab && 'bg-[hsl(var(--accent-coral))] text-white',
                  )}
                  onClick={() => setActivePlatformTab(idx)}
                >
                  {p}
                </Badge>
              ))}
            </div>
          )}

          {/* 3. Caption section with edit toggle + character count */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="block text-xs font-medium uppercase tracking-wide text-[hsl(var(--text-tertiary))]">
                Post Body
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? (
                  <>
                    <Eye className="w-3 h-3 mr-1" /> Done
                  </>
                ) : (
                  <>
                    <Pencil className="w-3 h-3 mr-1" /> Edit
                  </>
                )}
              </Button>
            </div>

            {isEditing ? (
              <Textarea
                value={editCaption}
                onChange={(e) => setEditCaption(e.target.value)}
                onBlur={handleBlurSave}
                rows={10}
                className="w-full text-sm leading-relaxed"
              />
            ) : (
              postText && (
                <div className="max-h-[300px] overflow-y-auto p-4 bg-[hsl(var(--bg-elevated))] rounded-[var(--radius-md)] text-sm leading-relaxed whitespace-pre-wrap select-text text-[hsl(var(--text-primary))]">
                  {postText}
                </div>
              )
            )}

            {/* Character Count */}
            {postText && (
              <div className="flex items-center justify-between mt-1.5">
                <CharCountIndicator count={charCount} />
              </div>
            )}
          </div>

          {/* Copy Buttons */}
          {postText && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(postText, 'Post text')}
              >
                <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy Post Text
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  copyToClipboard(
                    stripHashtags(postText),
                    'Post text (no hashtags)',
                  )
                }
              >
                <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy Without Hashtags
              </Button>
            </div>
          )}

          {/* 4. AI Refinement Panel */}
          <div>
            <span className="block text-xs font-medium uppercase tracking-wide text-[hsl(var(--text-tertiary))] mb-2">
              AI Refinement
            </span>
            <AiRefinementPanel
              caption={editCaption || item.caption || ''}
              onApplySuggestion={handleApplySuggestion}
            />
          </div>

          {/* 5. Carousel slide preview (CSUG-03) */}
          {item.content_type === 'carousel' && slideCount > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2 text-[hsl(var(--text-primary))]">
                <Layers className="w-3.5 h-3.5 inline mr-1.5" />
                Slide Preview ({slideCount})
              </h4>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {Array.from({ length: slideCount }, (_, i) => {
                  const slide = slidesData[i]
                  return (
                    <div
                      key={i}
                      className="shrink-0 w-[160px] h-[120px] rounded-[var(--radius-md)] bg-[hsl(var(--bg-elevated))] border-2 border-dashed border-[hsl(var(--border-subtle))] flex flex-col items-center justify-center p-3 text-center"
                    >
                      {slide ? (
                        <>
                          <span className="text-xs font-medium text-[hsl(var(--text-primary))] line-clamp-2">
                            {slide.title}
                          </span>
                          {slide.description && (
                            <span className="text-[10px] text-[hsl(var(--text-tertiary))] mt-1 line-clamp-2">
                              {slide.description}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-[hsl(var(--text-tertiary))]">
                          Slide {i + 1}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
              <Button variant="ghost" size="sm" disabled className="text-xs mt-1 opacity-50">
                Export from Excalidraw
              </Button>
            </div>
          )}

          {/* 6. Publishing time scaffold (CSUG-10) */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-[hsl(var(--text-tertiary))] mb-1">
              <Clock className="w-3 h-3" />
              Publish time
              <span className="text-[hsl(var(--text-tertiary))] opacity-60">(coming soon)</span>
            </label>
            <Input
              type="time"
              value={publishTime}
              onChange={(e) => setPublishTime(e.target.value)}
              className="w-40 text-sm"
            />
          </div>

          {/* Meta row */}
          <div className="grid grid-cols-4 gap-3 rounded-[var(--radius-md)] bg-[hsl(var(--bg-elevated))] p-3.5">
            <div>
              <span className="block text-xs font-medium uppercase tracking-wide text-[hsl(var(--text-tertiary))] mb-1">
                Week
              </span>
              <span className="text-sm font-medium text-[hsl(var(--text-primary))]">
                {item.week_number}
              </span>
            </div>
            <div>
              <span className="block text-xs font-medium uppercase tracking-wide text-[hsl(var(--text-tertiary))] mb-1">
                Day
              </span>
              <span className="text-sm font-medium text-[hsl(var(--text-primary))]">
                {item.day_label}
              </span>
            </div>
            <div>
              <span className="block text-xs font-medium uppercase tracking-wide text-[hsl(var(--text-tertiary))] mb-1">
                Slides
              </span>
              <span className="text-sm font-medium text-[hsl(var(--text-primary))]">
                {item.slide_count}
              </span>
            </div>
            <div>
              <span className="block text-xs font-medium uppercase tracking-wide text-[hsl(var(--text-tertiary))] mb-1">
                Revision
              </span>
              <span className="text-sm font-medium text-[hsl(var(--text-primary))]">
                {item.revision}
              </span>
            </div>
          </div>

          {/* 7. Revision History (collapsible) */}
          <div>
            <span className="block text-xs font-medium uppercase tracking-wide text-[hsl(var(--text-tertiary))] mb-2">
              Version History
            </span>
            <RevisionHistory
              contentId={item.id}
              currentCaption={editCaption || item.caption}
            />
          </div>

          {/* 8. Performance Metrics (if posted) */}
          {item.status === 'posted' && (
            <div>
              <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-[hsl(var(--text-tertiary))] mb-2">
                <BarChart3 className="w-3.5 h-3.5" />
                Performance
              </span>
              <PerformanceCard contentId={item.id} />
            </div>
          )}

          {/* Existing feedback if rejected */}
          {item.feedback && (
            <div className="rounded-[var(--radius-md)] bg-[hsl(0_80%_97%)] border border-[hsl(var(--status-error)/0.3)] p-3.5">
              <span className="block text-xs font-medium uppercase tracking-wide text-[hsl(var(--status-error))] mb-1.5">
                Previous Feedback
              </span>
              <p className="text-sm text-[hsl(var(--text-primary))] leading-relaxed m-0">
                {item.feedback}
              </p>
            </div>
          )}

          {/* 9. Approve/Reject Action Bar */}
          <div className="flex items-center gap-3 pt-4 border-t border-[hsl(var(--border-subtle))]">
            {!showRejectInput ? (
              <>
                {(item.status === 'pending' || item.status === 'draft') && (
                  <>
                    <Button
                      onClick={handleApproveClick}
                      className="bg-[hsl(var(--status-success))] hover:bg-[hsl(var(--status-success))]/90 text-white"
                    >
                      <Check className="w-4 h-4 mr-1.5" /> Approve
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowRejectInput(true)}
                      className="text-[hsl(var(--status-error))] border-[hsl(var(--status-error))]"
                    >
                      <X className="w-4 h-4 mr-1.5" /> Reject
                    </Button>
                  </>
                )}
                {item.status === 'rejected' && (
                  <span className="text-sm text-[hsl(var(--text-secondary))]">
                    This content has been rejected. Update and re-submit.
                  </span>
                )}
                {item.status === 'approved' && (
                  <span className="text-sm text-[hsl(var(--status-success))] font-medium">
                    Approved and ready to post
                  </span>
                )}
                {item.status === 'posted' && (
                  <span className="text-sm text-[hsl(var(--text-secondary))]">
                    Already posted
                  </span>
                )}
              </>
            ) : (
              <div className="flex-1 space-y-2">
                <Textarea
                  placeholder="Rejection reason (required for audit trail)..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="min-h-[60px]"
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowRejectInput(false)
                      setRejectReason('')
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    disabled={!rejectReason.trim()}
                    onClick={handleRejectConfirm}
                    className="bg-[hsl(var(--status-error))] hover:bg-[hsl(var(--status-error))]/90 text-white"
                  >
                    Confirm Reject
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
