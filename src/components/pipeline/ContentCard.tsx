import { motion } from 'framer-motion'
import { Layers, Linkedin, BookOpen, FileText, ShoppingBag } from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Card } from '@/components/ui/card'
import { formatShortDate } from '@/lib/utils'
import type { ContentReview } from '@/types/database'

const platformIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  linkedin: Linkedin,
  goodreads: BookOpen,
  medium: FileText,
  amazon: ShoppingBag,
}

interface ContentCardProps {
  item: ContentReview
  index: number
  onClick?: () => void
  compact?: boolean
}

function SlideLabel({ count }: { count: number }) {
  if (count === 0 || count === null) {
    return <span className="text-xs text-[hsl(var(--text-secondary))]">Text post</span>
  }
  return (
    <span className="flex items-center gap-1 text-xs text-[hsl(var(--text-secondary))]">
      <Layers size={12} />
      {count} slides
    </span>
  )
}

export function ContentCard({ item, index, onClick, compact }: ContentCardProps) {
  const PlatformIcon = item.platforms[0]
    ? platformIcons[item.platforms[0]] ?? FileText
    : FileText

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      className={onClick ? 'cursor-pointer' : undefined}
    >
      <Card className={`transition-shadow hover:shadow-card-hover ${compact ? 'px-4 py-3' : 'px-5 py-4'}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className={`flex items-center gap-2 ${compact ? 'mb-1' : 'mb-1.5'}`}>
              <span className="text-xs font-medium uppercase tracking-wide text-[hsl(var(--accent-coral))]">
                Wk {item.week_number} - {item.day_label}
              </span>
              {item.scheduled_date && (
                <span className="text-xs text-[hsl(var(--text-tertiary))]">{formatShortDate(item.scheduled_date)}</span>
              )}
            </div>
            <p className="text-sm font-medium text-[hsl(var(--text-primary))] m-0">
              {item.post_title}
            </p>
            {!compact && item.caption && (
              <p className="text-xs text-[hsl(var(--text-secondary))] mt-1.5 m-0 leading-relaxed truncate">
                {item.caption}
              </p>
            )}
          </div>
          <StatusBadge status={item.status} />
        </div>

        <div className={`flex items-center gap-3 ${compact ? 'mt-1.5' : 'mt-2.5'}`}>
          <div className="flex items-center gap-1">
            <PlatformIcon size={13} className="text-[hsl(var(--text-tertiary))]" />
            {item.platforms.map(p => (
              <span key={p} className="text-xs text-[hsl(var(--text-tertiary))] capitalize">{p}</span>
            ))}
          </div>
          <SlideLabel count={item.slide_count} />
          <span className="text-xs text-[hsl(var(--text-tertiary))]">Rev {item.revision}</span>
        </div>
      </Card>
    </motion.div>
  )
}
