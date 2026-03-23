import { motion } from 'framer-motion'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Badge } from '@/components/ui/badge'
import type { ContentReview } from '@/types/database'

function platformDisplayName(p: string): string {
  if (p === 'x') return 'X/Twitter'
  return p.charAt(0).toUpperCase() + p.slice(1)
}

interface DragOverlayCardProps {
  item: ContentReview
}

export function DragOverlayCard({ item }: DragOverlayCardProps) {
  return (
    <motion.div
      initial={{ scale: 1, rotate: 0 }}
      animate={{ scale: 1.03, rotate: 2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="max-w-[280px] bg-[hsl(var(--bg-surface))] border border-[hsl(var(--border-default))] rounded-lg p-3 shadow-xl pointer-events-none"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-sm font-medium text-[hsl(var(--text-primary))] line-clamp-2 m-0 flex-1">
          {item.post_title}
        </p>
        <StatusBadge status={item.status} />
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        {item.platforms.map(p => (
          <Badge key={p} variant="outline" className="text-[10px] capitalize">{platformDisplayName(p)}</Badge>
        ))}
      </div>
    </motion.div>
  )
}
