import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Layers, Star } from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { formatShortDate } from '@/lib/utils'
import type { ContentReview } from '@/types/database'

function platformDisplayName(p: string): string {
  if (p === 'x') return 'X/Twitter'
  return p.charAt(0).toUpperCase() + p.slice(1)
}

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

interface DraggableContentCardProps {
  item: ContentReview
  onSelect: (item: ContentReview) => void
  isSelected: boolean
  onToggleSelect: (id: string) => void
  showCheckbox: 'always' | 'hover' | 'none'
  enableDrag?: boolean
  isTopPerformer?: boolean
  children?: React.ReactNode
}

export function DraggableContentCard({
  item,
  onSelect,
  isSelected,
  onToggleSelect,
  showCheckbox,
  enableDrag = true,
  isTopPerformer = false,
  children,
}: DraggableContentCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    disabled: !enableDrag,
  })

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(enableDrag ? listeners : {})}
      {...attributes}
      className={`group relative ${isDragging ? 'opacity-50 z-50' : ''}`}
    >
      <Card className="bg-[hsl(var(--bg-surface))] border border-[hsl(var(--border-subtle))] rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing">
        {/* Top Performer badge */}
        {isTopPerformer && (
          <Badge variant="outline" className="absolute top-2 right-2 z-10 text-[10px] gap-0.5 border-[hsl(var(--status-success))] text-[hsl(var(--status-success))] bg-[hsl(var(--status-success)/0.08)]">
            <Star size={10} className="fill-current" />
            Top
          </Badge>
        )}

        {/* Checkbox */}
        {showCheckbox !== 'none' && (
          <div
            className={`absolute top-2 left-2 z-10 ${
              showCheckbox === 'hover' ? 'opacity-0 group-hover:opacity-100 transition-opacity' : ''
            } ${isSelected ? '!opacity-100' : ''}`}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => {
                e.stopPropagation()
                onToggleSelect(item.id)
              }}
              onClick={(e) => e.stopPropagation()}
              className="h-4 w-4 rounded border-[hsl(var(--border-default))] accent-[hsl(var(--accent-coral))] cursor-pointer"
            />
          </div>
        )}

        <div
          className={showCheckbox !== 'none' ? 'pl-5' : ''}
          onClick={(e) => {
            // Only trigger select if not dragging and not clicking checkbox
            if (!isDragging) {
              e.stopPropagation()
              onSelect(item)
            }
          }}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <p className="text-sm font-medium text-[hsl(var(--text-primary))] line-clamp-2 m-0 flex-1 cursor-pointer">
              {item.post_title}
            </p>
            <div className="flex items-center gap-1 shrink-0">
              <StatusBadge status={item.status} />
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {item.scheduled_date && (
              <span className="text-xs text-[hsl(var(--text-tertiary))]">{formatShortDate(item.scheduled_date)}</span>
            )}
            <SlideInfo slideCount={item.slide_count} />
            <PlatformTags platforms={item.platforms} />
          </div>
        </div>

        {/* Slot for additional content like dropdown menus */}
        {children}
      </Card>
    </div>
  )
}
