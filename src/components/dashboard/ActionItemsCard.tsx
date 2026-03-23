import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { SkeletonBlock } from '@/components/ui/SkeletonBlock'
import { useActionItems } from '@/hooks/useProjects'
import { useProjects } from '@/hooks/useProjects'
import { formatRelativeTime } from '@/lib/utils'

const urgencyBadge = (urgency: string) => {
  if (urgency === 'high') return 'error'
  if (urgency === 'medium') return 'warning'
  return 'neutral'
}

export function ActionItemsCard() {
  const { data: items, isLoading: loadingItems } = useActionItems()
  const { data: projects, isLoading: loadingProjects } = useProjects()
  const [showAll, setShowAll] = useState(false)

  const isLoading = loadingItems || loadingProjects

  if (isLoading) {
    return (
      <Card className="p-6 flex flex-col gap-4">
        <SkeletonBlock width="40%" height={18} />
        {[0, 1, 2].map(i => (
          <Card key={i} className="px-4 py-3 flex flex-col gap-2">
            <SkeletonBlock width="80%" height={14} />
            <SkeletonBlock width="40%" height={11} />
          </Card>
        ))}
      </Card>
    )
  }

  const openItems = (items ?? []).filter(i => i.status === 'open')
  const visibleItems = showAll ? openItems : openItems.slice(0, 5)
  const hasMore = openItems.length > 5

  const getProjectBadge = (projectId: string) => {
    const proj = (projects ?? []).find(p => p.id === projectId)
    return proj?.name.split(' ')[0] ?? 'Unknown'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertCircle size={15} className="text-[hsl(var(--text-tertiary))]" />
          <span className="text-card-title">Action Items</span>
          {openItems.length > 0 && (
            <span
              className="text-[11px] font-bold inline-flex items-center justify-center w-5 h-5 rounded-full bg-[hsl(var(--accent-coral))] text-white"
            >
              {openItems.length}
            </span>
          )}
        </div>
      </div>

      {openItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-6 text-[hsl(var(--text-tertiary))]">
          <CheckCircle size={24} className="text-[hsl(var(--status-success))]" />
          <span className="text-body-sm">Nothing needs your attention right now</span>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <AnimatePresence initial={false}>
            {visibleItems.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, delay: idx < 5 ? idx * 0.05 : 0, ease: [0.16, 1, 0.3, 1] }}
                className="py-3 px-3.5 rounded-[var(--radius-md)] border border-[hsl(var(--border-subtle))] bg-[hsl(var(--bg-elevated))] flex flex-col gap-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-body-sm font-medium text-[hsl(var(--text-primary))] flex-1">
                    {item.description}
                  </p>
                  <Badge variant={urgencyBadge(item.urgency) as 'error' | 'warning' | 'neutral'}>
                    {item.urgency}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="navy">{getProjectBadge(item.project_id)}</Badge>
                  <span className="text-caption">{formatRelativeTime(item.created_at)}</span>
                  {item.source && (
                    <span className="text-caption">from {item.source}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {hasMore && (
            <div className="flex justify-center pt-2">
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-body-sm font-medium text-[hsl(var(--accent-coral))] flex items-center gap-1 bg-transparent border-none cursor-pointer hover:underline"
              >
                {showAll ? (
                  <>
                    Collapse
                    <ChevronUp size={14} />
                  </>
                ) : (
                  <>
                    View all ({openItems.length})
                    <ChevronDown size={14} />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </Card>
    </motion.div>
  )
}
