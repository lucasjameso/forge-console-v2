import { useState, useEffect } from 'react'
import { PageShell } from '@/components/layout/PageShell'
import { StatTilesRow } from '@/components/dashboard/StatTilesRow'
import { SystemHealthStrip } from '@/components/dashboard/SystemHealthStrip'
import { ActionItemsCard } from '@/components/dashboard/ActionItemsCard'
import { ProjectQuickGlanceCard } from '@/components/dashboard/ProjectQuickGlanceCard'
import { UpcomingContentCard } from '@/components/dashboard/UpcomingContentCard'
import { getGreeting, formatDate, formatTime } from '@/lib/utils'

export function Dashboard() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(interval)
  }, [])

  return (
    <PageShell
      title={`${getGreeting()}, Lucas`}
      subtitle="Here is what needs your attention today."
      actions={
        <div style={{ textAlign: 'right' }}>
          <div className="text-body-sm font-medium" style={{ color: 'hsl(var(--text-primary))' }}>
            {formatTime(now)}
          </div>
          <div className="text-caption">{formatDate(now)}</div>
        </div>
      }
    >
      <div className="flex flex-col" style={{ gap: 32 }}>
        <StatTilesRow />
        <SystemHealthStrip />
        <ActionItemsCard />
        <ProjectQuickGlanceCard />
        <UpcomingContentCard />
      </div>
    </PageShell>
  )
}
