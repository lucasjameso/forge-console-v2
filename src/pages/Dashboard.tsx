import { useState, useEffect } from 'react'
import { PageShell } from '@/components/layout/PageShell'
import { ActionItemsCard } from '@/components/dashboard/ActionItemsCard'
import { SystemHealthCard } from '@/components/dashboard/SystemHealthCard'
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
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
            {formatTime(now)}
          </div>
          <div className="text-caption">{formatDate(now)}</div>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {/* Row 1: Action Items + System Health */}
        <div className="dashboard-top-grid">
          <ActionItemsCard />
          <SystemHealthCard />
        </div>

        {/* Row 2: Project Quick Glance */}
        <ProjectQuickGlanceCard />

        {/* Row 3: Upcoming Content */}
        <UpcomingContentCard />
      </div>

      <style>{`
        .dashboard-top-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 20px;
        }
        @media (max-width: 768px) {
          .dashboard-top-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </PageShell>
  )
}
