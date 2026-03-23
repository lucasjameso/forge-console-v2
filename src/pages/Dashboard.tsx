import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageShell } from '@/components/layout/PageShell'
import { StatTilesRow } from '@/components/dashboard/StatTilesRow'
import { SystemHealthStrip } from '@/components/dashboard/SystemHealthStrip'
import { ActionItemsCard } from '@/components/dashboard/ActionItemsCard'
import { ProjectQuickGlanceCard } from '@/components/dashboard/ProjectQuickGlanceCard'
import { ContentCalendarStrip } from '@/components/dashboard/ContentCalendarStrip'
import { getGreeting, formatDate, formatTime } from '@/lib/utils'
import { useActionItems, useProjects } from '@/hooks/useProjects'
import { useContentReviews } from '@/hooks/useContentReviews'

interface Insight {
  priority: number
  text: string
}

function useRotatingInsights() {
  const { data: actionItems } = useActionItems()
  const { data: projects } = useProjects()
  const { data: reviews } = useContentReviews()

  const launchDate = new Date('2026-04-17')
  const daysUntilLaunch = Math.ceil((launchDate.getTime() - Date.now()) / 86400000)

  const insights = useMemo(() => {
    const openItems = (actionItems ?? []).filter(a => a.status === 'open')
    const highPriorityCount = openItems.filter(a => a.urgency === 'high').length
    const pendingApprovals = (reviews ?? []).filter(r => r.status === 'pending').length

    // Find stale project (no recent activity heuristic based on progress)
    const projectList = projects ?? []
    const staleProject = projectList.find(p => p.progress_pct !== undefined && p.progress_pct < 50)

    const list: Insight[] = [
      {
        priority: daysUntilLaunch > 0 && daysUntilLaunch < 30 ? 1 : 5,
        text: daysUntilLaunch > 0
          ? `CLARITY launches in ${daysUntilLaunch} days`
          : 'CLARITY has launched!',
      },
      {
        priority: staleProject ? 2 : 6,
        text: staleProject
          ? `${staleProject.name} needs attention`
          : 'All projects on track',
      },
      {
        priority: pendingApprovals > 0 ? 3 : 7,
        text: `${pendingApprovals} content pieces need approval`,
      },
      {
        priority: highPriorityCount > 0 ? 4 : 8,
        text: highPriorityCount > 0
          ? `${highPriorityCount} high-priority items across projects`
          : `${openItems.length} open action items`,
      },
    ]

    return list.sort((a, b) => a.priority - b.priority).slice(0, 3)
  }, [actionItems, projects, reviews, daysUntilLaunch])

  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (insights.length <= 1) return
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % insights.length)
    }, 10_000)
    return () => clearInterval(interval)
  }, [insights.length])

  return insights.length > 0 ? insights[index % insights.length] : null
}

export function Dashboard() {
  const [now, setNow] = useState(new Date())
  const currentInsight = useRotatingInsights()

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(interval)
  }, [])

  return (
    <PageShell
      title={`${getGreeting()}, Lucas`}
      subtitle={
        <AnimatePresence mode="wait">
          <motion.span
            key={currentInsight?.text ?? 'default'}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
          >
            {currentInsight?.text ?? 'All clear -- time for deep work'}
          </motion.span>
        </AnimatePresence>
      }
      actions={
        <div className="text-right">
          <div className="text-body-sm font-medium text-[hsl(var(--text-primary))]">
            {formatTime(now)}
          </div>
          <div className="text-caption">{formatDate(now)}</div>
        </div>
      }
    >
      <div className="flex flex-col gap-8">
        <StatTilesRow />
        <SystemHealthStrip />
        <ActionItemsCard />
        <ProjectQuickGlanceCard />
        <ContentCalendarStrip />
      </div>
    </PageShell>
  )
}
