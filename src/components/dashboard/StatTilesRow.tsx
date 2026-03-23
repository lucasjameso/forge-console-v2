import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { SkeletonBlock } from '@/components/ui/SkeletonBlock'
import { useProjects } from '@/hooks/useProjects'
import { useContentReviews } from '@/hooks/useContentReviews'
import { useProjectLastActivity } from '@/hooks/useDashboardStats'
import { getRecencyColor } from '@/lib/colors'

const recencyBorderClass = {
  success: 'border-l-4 border-l-[hsl(var(--status-success))]',
  warning: 'border-l-4 border-l-[hsl(var(--status-warning))]',
  error: 'border-l-4 border-l-[hsl(var(--status-error))]',
} as const

interface StatTile {
  value: string
  label: string
  borderClass?: string
  valueClass?: string
  pulse?: boolean
  sublabel?: string
}

export function StatTilesRow() {
  const { data: projects, isLoading: loadingProjects } = useProjects()
  const { data: reviews, isLoading: loadingReviews } = useContentReviews()
  const { data: recencyData } = useProjectLastActivity()

  const isLoading = loadingProjects || loadingReviews

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[0, 1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6 flex flex-col items-center justify-center gap-1">
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

  // Determine CLARITY countdown urgency
  let clarityValueClass = ''
  let clarityPulse = false
  let claritySublabel: string | undefined
  let clarityValue: string
  let clarityBorderClass = ''

  if (daysUntilLaunch <= 0) {
    clarityValue = daysUntilLaunch === 0 ? 'Today!' : 'Launched'
    clarityValueClass = 'text-[hsl(var(--status-success))]'
  } else if (daysUntilLaunch < 14) {
    clarityValue = `${daysUntilLaunch}d`
    clarityValueClass = 'text-[hsl(var(--status-error))]'
    clarityPulse = true
    claritySublabel = launchDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    clarityBorderClass = 'border-l-4 border-l-[hsl(var(--status-error))]'
  } else if (daysUntilLaunch <= 30) {
    clarityValue = `${daysUntilLaunch}d`
    clarityValueClass = 'text-[hsl(var(--status-warning))]'
    claritySublabel = launchDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    clarityBorderClass = 'border-l-4 border-l-[hsl(var(--status-warning))]'
  } else {
    clarityValue = `${daysUntilLaunch}d`
  }

  // Recency borders for project tiles
  function getProjectBorder(slug: string): string {
    const recency = recencyData?.[slug]
    if (recency?.lastActivityDate) {
      const level = getRecencyColor(recency.lastActivityDate)
      return recencyBorderClass[level]
    }
    return ''
  }

  const tiles: StatTile[] = [
    {
      value: `${ridgeline?.progress_pct ?? 0}%`,
      label: 'Ridgeline Intelligence',
      borderClass: getProjectBorder('ridgeline'),
    },
    {
      value: `${clarity?.progress_pct ?? 0}%`,
      label: 'CLARITY Book Launch',
      borderClass: getProjectBorder('clarity'),
    },
    {
      value: `${forge?.progress_pct ?? 0}%`,
      label: 'Forge Console',
      borderClass: getProjectBorder('forge'),
    },
    {
      value: String(pendingCount),
      label: 'Pending Approvals',
    },
    {
      value: clarityValue,
      label: 'CLARITY Launch',
      borderClass: clarityBorderClass,
      valueClass: clarityValueClass,
      pulse: clarityPulse,
      sublabel: claritySublabel,
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {tiles.map((tile, idx) => (
        <motion.div
          key={tile.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.05 }}
          className={idx === 4 ? 'col-span-2 md:col-span-1' : ''}
        >
          <Card
            className={`p-6 flex flex-col items-center justify-center gap-1 text-center ${tile.borderClass ?? ''} ${tile.pulse ? 'animate-pulse' : ''}`}
          >
            {tile.pulse ? (
              <motion.span
                className={`text-stat ${tile.valueClass ?? ''}`}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ repeat: Infinity, duration: 5 }}
              >
                {tile.value}
              </motion.span>
            ) : (
              <span className={`text-stat ${tile.valueClass ?? ''}`}>{tile.value}</span>
            )}
            <span className="text-caption">{tile.label}</span>
            {tile.sublabel && (
              <span className="text-caption text-[hsl(var(--text-tertiary))]">{tile.sublabel}</span>
            )}
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
