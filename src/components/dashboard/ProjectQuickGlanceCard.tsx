import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FolderKanban, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { PriorityBadge } from '@/components/ui/PriorityBadge'
import { SkeletonBlock } from '@/components/ui/SkeletonBlock'
import { useProjects, useActionItems } from '@/hooks/useProjects'
import { useProjectLastActivity } from '@/hooks/useDashboardStats'
import { formatRelativeTime } from '@/lib/utils'
import type { Priority } from '@/lib/colors'

const recencyBorderClass = {
  green: 'border-l-[hsl(var(--status-success))]',
  amber: 'border-l-[hsl(var(--status-warning))]',
  red: 'border-l-[hsl(var(--status-error))]',
} as const

const progressBarClass = {
  green: 'bg-[hsl(var(--status-success))]',
  amber: 'bg-[hsl(var(--status-warning))]',
  red: 'bg-[hsl(var(--status-error))]',
} as const

const recencyTextClass = {
  green: 'text-[hsl(var(--status-success))]',
  amber: 'text-[hsl(var(--status-warning))]',
  red: 'text-[hsl(var(--status-error))]',
} as const

function getProgressHealth(
  progressPct: number,
  projectId: string,
  actionItems: Array<{ project_id: string; urgency: string; status: string; created_at: string }>,
): 'green' | 'amber' | 'red' {
  const projectItems = actionItems.filter(
    (a) => a.project_id === projectId && a.status === 'open',
  )
  const hasOverdueHigh = projectItems.some(
    (a) => a.urgency === 'high',
  )
  const hasOverdue = projectItems.length > 0

  if (hasOverdueHigh) return 'red'
  if (hasOverdue && progressPct < 50) return 'amber'
  if (progressPct < 30) return 'red'
  if (progressPct < 70) return 'amber'
  return 'green'
}

export function ProjectQuickGlanceCard() {
  const { data: projects, isLoading } = useProjects()
  const { data: recencyData } = useProjectLastActivity()
  const { data: allActionItems } = useActionItems()

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center gap-2 mb-4">
          <SkeletonBlock width={15} height={15} className="rounded-full" />
          <SkeletonBlock width="30%" height={16} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[0, 1, 2].map(i => (
            <Card key={i} className="p-6 flex flex-col gap-3">
              <SkeletonBlock width="70%" height={16} />
              <SkeletonBlock width="100%" height={8} className="rounded" />
              <SkeletonBlock width="50%" height={12} />
              <SkeletonBlock width="60%" height={12} />
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const data = projects ?? []
  const actionItems = allActionItems ?? []

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <FolderKanban size={15} className="text-[hsl(var(--text-tertiary))]" />
        <span className="text-section-header">Projects</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((project, idx) => {
          const recency = recencyData?.[project.slug]
          const borderClass = recencyBorderClass[recency?.recencyLevel ?? 'green']
          const healthLevel = getProgressHealth(project.progress_pct, project.id, actionItems)
          const barClass = progressBarClass[healthLevel]
          const textClass = recencyTextClass[recency?.recencyLevel ?? 'green']

          return (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              to={`/projects/${project.slug}`}
              className="no-underline block"
            >
              <Card
                className={`p-6 transition-shadow hover:shadow-card-hover cursor-pointer flex flex-col gap-3.5 h-full border-l-[3px] ${borderClass}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-card-title">
                    {project.name}
                  </span>
                  <PriorityBadge priority={project.priority as Priority} />
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-caption">Progress</span>
                    <span className="text-body-sm font-semibold text-[hsl(var(--text-primary))]">
                      {project.progress_pct}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-sm bg-[hsl(var(--bg-elevated))] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${project.progress_pct}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className={`h-full rounded-sm ${barClass}`}
                    />
                  </div>
                </div>

                {/* Phase */}
                {project.current_phase && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-caption">Phase:</span>
                    <span className="text-caption font-medium text-[hsl(var(--text-secondary))]">
                      {project.current_phase}
                    </span>
                  </div>
                )}

                {/* Last activity + link */}
                <div className="flex items-center justify-between mt-auto">
                  <span
                    className={`text-caption font-medium ${textClass}`}
                  >
                    {recency?.lastActivityDate
                      ? formatRelativeTime(recency.lastActivityDate)
                      : formatRelativeTime(project.updated_at)}
                  </span>
                  <ArrowRight
                    size={14}
                    className="text-[hsl(var(--text-tertiary))]"
                  />
                </div>
              </Card>
            </Link>
          </motion.div>
          )
        })}
      </div>
    </div>
  )
}
