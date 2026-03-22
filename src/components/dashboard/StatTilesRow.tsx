import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { SkeletonBlock } from '@/components/ui/SkeletonBlock'
import { useProjects } from '@/hooks/useProjects'
import { useContentReviews } from '@/hooks/useContentReviews'

interface StatTile {
  value: string
  label: string
}

export function StatTilesRow() {
  const { data: projects, isLoading: loadingProjects } = useProjects()
  const { data: reviews, isLoading: loadingReviews } = useContentReviews()

  const isLoading = loadingProjects || loadingReviews

  if (isLoading) {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 16,
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <SkeletonBlock width={64} height={36} />
            <SkeletonBlock width={96} height={12} />
          </Card>
        ))}
      </div>
    )
  }

  const ridgeline = (projects ?? []).find((p) => p.slug === 'ridgeline')
  const clarity = (projects ?? []).find((p) => p.slug === 'clarity')
  const forge = (projects ?? []).find((p) => p.slug === 'forge')

  const pendingCount = (reviews ?? []).filter((r) => r.status === 'pending').length

  const launchDate = new Date('2026-04-17')
  const daysUntilLaunch = Math.ceil((launchDate.getTime() - Date.now()) / 86400000)

  const tiles: StatTile[] = [
    {
      value: `${ridgeline?.progress_pct ?? 0}%`,
      label: 'Ridgeline Intelligence',
    },
    {
      value: `${clarity?.progress_pct ?? 0}%`,
      label: 'CLARITY Book Launch',
    },
    {
      value: `${forge?.progress_pct ?? 0}%`,
      label: 'Forge Console',
    },
    {
      value: String(pendingCount),
      label: 'Pending Approvals',
    },
    {
      value: `${daysUntilLaunch}d`,
      label: 'CLARITY Launch',
    },
  ]

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 16,
      }}
      className="stat-tiles-grid"
    >
      {tiles.map((tile, idx) => (
        <motion.div
          key={tile.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.05 }}
        >
          <Card
            className="p-6"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              textAlign: 'center',
            }}
          >
            <span className="text-stat">{tile.value}</span>
            <span className="text-caption">{tile.label}</span>
          </Card>
        </motion.div>
      ))}

      <style>{`
        @media (max-width: 768px) {
          .stat-tiles-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .stat-tiles-grid > :nth-child(5) {
            grid-column: 1 / -1;
          }
        }
      `}</style>
    </div>
  )
}
