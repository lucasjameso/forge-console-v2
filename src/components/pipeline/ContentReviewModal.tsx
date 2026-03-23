import { useState } from 'react'
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
import { StatusBadge } from '@/components/ui/StatusBadge'
import {
  Copy,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Layers,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { formatShortDate } from '@/lib/utils'
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
  const [slideIdx, setSlideIdx] = useState(0)

  if (!item) return null

  const postText = item.caption || ''
  const charCount = postText.length
  const typeLabel = contentTypeBadge(item.slide_count)

  // Parse slides from caption if carousel (structured as sections separated by ---)
  const slides =
    item.slide_count > 1
      ? postText.split('---').map((s, i) => {
          const lines = s.trim().split('\n').filter(Boolean)
          return {
            title: lines[0] || `Slide ${i + 1}`,
            description: lines.slice(1).join('\n') || '',
          }
        })
      : []

  const handleApproveClick = () => {
    onApprove(item.id)
    toast.success('Content approved')
  }

  const handleRejectConfirm = () => {
    if (!rejectReason.trim()) return
    onReject(item.id, rejectReason.trim())
    toast.success('Content rejected with reason logged')
    setShowRejectInput(false)
    setRejectReason('')
  }

  const handleClose = (openState: boolean) => {
    if (!openState) {
      setShowRejectInput(false)
      setRejectReason('')
      setSlideIdx(0)
    }
    onOpenChange(openState)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[720px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          {/* Platform tags, type badge, status, date */}
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

          {/* Post Body Display */}
          {postText && (
            <div>
              <span className="block text-xs font-medium uppercase tracking-wide text-[hsl(var(--text-tertiary))] mb-1.5">
                Post Body
              </span>
              <div className="max-h-[300px] overflow-y-auto p-4 bg-[hsl(var(--bg-elevated))] rounded-[var(--radius-md)] text-sm leading-relaxed whitespace-pre-wrap select-text text-[hsl(var(--text-primary))]">
                {postText}
              </div>
            </div>
          )}

          {/* Character Count */}
          {postText && (
            <div className="flex items-center justify-between">
              <CharCountIndicator count={charCount} />
            </div>
          )}

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
                    'Post text (no hashtags)'
                  )
                }
              >
                <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy Without Hashtags
              </Button>
            </div>
          )}

          {/* Carousel Slides */}
          {slides.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2 text-[hsl(var(--text-primary))]">
                <Layers className="w-3.5 h-3.5 inline mr-1.5" />
                Carousel Slides ({slides.length})
              </h4>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() =>
                    setSlideIdx((prev) => Math.max(0, prev - 1))
                  }
                  disabled={slideIdx === 0}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="flex-1 p-3 bg-[hsl(var(--bg-elevated))] rounded-[var(--radius-md)]">
                  <div className="text-xs text-[hsl(var(--text-tertiary))]">
                    Slide {slideIdx + 1} of {slides.length}
                  </div>
                  <div className="text-sm font-medium mt-1 text-[hsl(var(--text-primary))]">
                    {slides[slideIdx]?.title}
                  </div>
                  {slides[slideIdx]?.description && (
                    <div className="text-sm mt-1 text-[hsl(var(--text-secondary))]">
                      {slides[slideIdx]?.description}
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() =>
                    setSlideIdx((prev) =>
                      Math.min(slides.length - 1, prev + 1)
                    )
                  }
                  disabled={slideIdx === slides.length - 1}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

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

          {/* Approve/Reject Action Bar */}
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
