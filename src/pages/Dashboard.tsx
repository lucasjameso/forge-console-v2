import { useState, useEffect } from 'react'
import { PageShell } from '@/components/layout/PageShell'
import { StatTilesRow } from '@/components/dashboard/StatTilesRow'
import { SystemHealthStrip } from '@/components/dashboard/SystemHealthStrip'
import { ActionItemsCard } from '@/components/dashboard/ActionItemsCard'
import { ProjectQuickGlanceCard } from '@/components/dashboard/ProjectQuickGlanceCard'
import { ContentCalendarStrip } from '@/components/dashboard/ContentCalendarStrip'
import { getGreeting, getDynamicSubtitle, formatDate, formatTime } from '@/lib/utils'
import { useActionItems } from '@/hooks/useProjects'

export function Dashboard() {
  const [now, setNow] = useState(new Date())
  const { data: actionItems } = useActionItems()

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(interval)
  }, [])

  const openItems = (actionItems ?? []).filter(a => a.status === 'open')
  const launchDate = new Date('2026-04-17')
  const daysUntilLaunch = Math.ceil((launchDate.getTime() - Date.now()) / 86400000)

  const subtitle = getDynamicSubtitle({
    actionItemCount: openItems.length,
    upcomingDeadlineDays: daysUntilLaunch > 0 ? daysUntilLaunch : undefined,
    upcomingDeadlineProject: 'CLARITY',
  })

  return (
    <PageShell
      title={`${getGreeting()}, Lucas`}
      subtitle={subtitle}
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
