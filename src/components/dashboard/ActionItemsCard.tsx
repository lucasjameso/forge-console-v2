import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { SkeletonBlock } from '@/components/ui/SkeletonBlock'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { useActionItems } from '@/hooks/useProjects'
import { useProjects } from '@/hooks/useProjects'
import { formatRelativeTime } from '@/lib/utils'
import type { ProjectActionItem } from '@/types/database'

function PriorityDot({ priority }: { priority: string }) {
  const colorClass =
    priority === 'high'
      ? 'bg-[hsl(var(--status-error))]'
      : priority === 'medium'
        ? 'bg-[hsl(var(--status-warning))]'
        : 'bg-[hsl(var(--status-success))]'

  return <span className={`w-2 h-2 rounded-full shrink-0 ${colorClass}`} />
}

export function ActionItemsCard() {
  const { data: items, isLoading: loadingItems } = useActionItems()
  const { data: projects, isLoading: loadingProjects } = useProjects()
  const [showAll, setShowAll] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ProjectActionItem | null>(null)

  const isLoading = loadingItems || loadingProjects

  if (isLoading) {
    return (
      <Card className="p-6 flex flex-col gap-4">
        <SkeletonBlock width="40%" height={18} />
        {[0, 1, 2].map(i => (
          <div key={i} className="py-2.5 px-3 flex items-center gap-3">
            <SkeletonBlock width={8} height={8} className="rounded-full" />
            <SkeletonBlock width="60%" height={14} />
            <SkeletonBlock width="15%" height={14} />
          </div>
        ))}
      </Card>
    )
  }

  const openItems = (items ?? []).filter(i => i.status === 'open')
  const visibleItems = showAll ? openItems : openItems.slice(0, 5)
  const hasMore = openItems.length > 5

  const getProjectName = (projectId: string) => {
    const proj = (projects ?? []).find(p => p.id === projectId)
    return proj?.name.split(' ')[0] ?? 'Unknown'
  }

  return (
    <>
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
            <>
              <div className="divide-y divide-[hsl(var(--border-subtle))]">
                <AnimatePresence initial={false}>
                  {visibleItems.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, delay: idx < 5 ? idx * 0.05 : 0, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="w-full flex items-center gap-3 py-2.5 px-3 hover:bg-[hsl(var(--bg-elevated))] text-left transition-colors bg-transparent border-none cursor-pointer"
                      >
                        <PriorityDot priority={item.urgency} />
                        <span className="flex-1 text-sm truncate text-[hsl(var(--text-primary))]">
                          {item.description}
                        </span>
                        <Badge variant="navy" className="text-xs shrink-0">
                          {getProjectName(item.project_id)}
                        </Badge>
                        <span className="text-xs text-[hsl(var(--text-tertiary))] shrink-0">
                          {formatRelativeTime(item.created_at)}
                        </span>
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              {hasMore && (
                <div className="flex justify-center pt-3">
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
            </>
          )}
        </Card>
      </motion.div>

      {/* Detail Dialog */}
      <Dialog open={selectedItem !== null} onOpenChange={(open) => { if (!open) setSelectedItem(null) }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[hsl(var(--text-primary))]">
              {selectedItem?.description}
            </DialogTitle>
            <DialogDescription className="flex items-center gap-2 pt-1">
              <PriorityDot priority={selectedItem?.urgency ?? 'low'} />
              <span className="capitalize">{selectedItem?.urgency} priority</span>
              {selectedItem?.source && (
                <span className="text-[hsl(var(--text-tertiary))]">
                  from {selectedItem.source}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-2">
            <div className="flex items-center gap-2">
              <span className="text-caption text-[hsl(var(--text-tertiary))]">Project:</span>
              <Badge variant="navy">
                {selectedItem ? getProjectName(selectedItem.project_id) : ''}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-caption text-[hsl(var(--text-tertiary))]">Created:</span>
              <span className="text-body-sm">
                {selectedItem ? formatRelativeTime(selectedItem.created_at) : ''}
              </span>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setSelectedItem(null)}
                className="flex-1 py-2 px-4 rounded-[var(--radius-md)] bg-[hsl(var(--status-success))] text-white text-sm font-medium border-none cursor-pointer hover:opacity-90 transition-opacity"
              >
                Mark Complete
              </button>
              <button
                onClick={() => setSelectedItem(null)}
                className="flex-1 py-2 px-4 rounded-[var(--radius-md)] bg-[hsl(var(--bg-elevated))] text-[hsl(var(--text-primary))] text-sm font-medium border border-[hsl(var(--border-default))] cursor-pointer hover:bg-[hsl(var(--bg-surface))] transition-colors"
              >
                Snooze
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
