import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Linkedin,
  BookOpen,
  ShoppingBag,
  ExternalLink,
  Users,
  Clock,
  Globe,
} from 'lucide-react'
import { PageShell } from '@/components/layout/PageShell'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { SkeletonBlock } from '@/components/ui/SkeletonBlock'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSocialPlatforms } from '@/hooks/useSocialPlatforms'
import { PLATFORM_ICONS } from '@/lib/icons'
import { formatRelativeTime } from '@/lib/utils'
import type { SocialPlatform } from '@/types/database'

type SortBy = 'priority' | 'alpha' | 'followers' | 'active'

const LINKEDIN_GOAL = 10000

const CLARITY_LAUNCH_PLATFORMS = ['goodreads', 'amazon author central', 'bookbub']

function getPlatformIcon(platform: SocialPlatform) {
  const key = platform.platform_name?.toLowerCase() ?? ''
  const brandIcon = PLATFORM_ICONS[key]
  if (brandIcon) return brandIcon

  // Fallback to Lucide icons for platforms not in the brand icon set
  const fallbackMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    linkedin: Linkedin,
    goodreads: BookOpen,
    'amazon author central': ShoppingBag,
  }
  return fallbackMap[key] ?? Globe
}

function isLaunchCritical(name: string): boolean {
  return CLARITY_LAUNCH_PLATFORMS.includes(name.toLowerCase())
}

function isActivePlatform(p: SocialPlatform): boolean {
  return p.status === 'active' || (p.follower_count !== null && p.follower_count > 0)
}

function sortPlatforms(platforms: SocialPlatform[], sortBy: SortBy): SocialPlatform[] {
  const sorted = [...platforms]
  switch (sortBy) {
    case 'priority':
      return sorted.sort((a, b) => {
        const aActive = isActivePlatform(a) ? 0 : 1
        const bActive = isActivePlatform(b) ? 0 : 1
        if (aActive !== bActive) return aActive - bActive
        const aLaunch = isLaunchCritical(a.platform_name) ? 0 : 1
        const bLaunch = isLaunchCritical(b.platform_name) ? 0 : 1
        if (aLaunch !== bLaunch) return aLaunch - bLaunch
        return a.platform_name.localeCompare(b.platform_name)
      })
    case 'alpha':
      return sorted.sort((a, b) => a.platform_name.localeCompare(b.platform_name))
    case 'followers':
      return sorted.sort((a, b) => (b.follower_count ?? 0) - (a.follower_count ?? 0))
    case 'active':
      return sorted.sort((a, b) => {
        const aDate = a.last_post_date ? new Date(a.last_post_date).getTime() : 0
        const bDate = b.last_post_date ? new Date(b.last_post_date).getTime() : 0
        return bDate - aDate
      })
  }
}

function ActivePlatformCard({ platform, index }: { platform: SocialPlatform; index: number }) {
  const Icon = getPlatformIcon(platform)
  const hasUrl = Boolean(platform.profile_url)
  const isLinkedIn = platform.platform_name.toLowerCase() === 'linkedin'
  const meta = platform.metadata as Record<string, unknown> | null
  const goal = isLinkedIn ? LINKEDIN_GOAL : (typeof meta?.target === 'number' ? meta.target : null)
  const percentage = goal && platform.follower_count ? Math.round((platform.follower_count / goal) * 100) : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="flex"
    >
      <Card className="p-6 flex flex-col gap-3.5 flex-1">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[10px] bg-[hsl(var(--bg-elevated))] flex items-center justify-center">
              <Icon size={18} className="text-[hsl(var(--accent-navy))]" />
            </div>
            <div>
              <h3 className="text-card-title text-[hsl(var(--text-primary))] m-0">
                {platform.platform_name}
              </h3>
              {platform.handle && (
                <span className="text-caption">{platform.handle}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isLaunchCritical(platform.platform_name) && (
              <Badge variant="coral">Needed for launch</Badge>
            )}
            <Badge variant="success">Active</Badge>
            {hasUrl && (
              <a
                href={platform.profile_url!}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[hsl(var(--text-tertiary))] hover:text-[hsl(var(--accent-coral))] transition-colors"
              >
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-5">
          {platform.follower_count !== null && (
            <div className="flex items-center gap-1.5">
              <Users size={13} className="text-[hsl(var(--text-tertiary))]" />
              <span className="text-body font-semibold text-[hsl(var(--text-primary))]">
                {platform.follower_count.toLocaleString()}
              </span>
              {goal && (
                <span className="text-caption">/ {goal.toLocaleString()} goal</span>
              )}
            </div>
          )}
          {platform.last_post_date && (
            <div className="flex items-center gap-1.5">
              <Clock size={13} className="text-[hsl(var(--text-tertiary))]" />
              <span className="text-caption">
                Last post {formatRelativeTime(platform.last_post_date)}
              </span>
            </div>
          )}
        </div>

        {/* LinkedIn follower goal progress bar */}
        {percentage !== null && goal && (
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-caption">
                {platform.follower_count?.toLocaleString()} / {goal.toLocaleString()}
              </span>
              <span className="text-caption font-bold text-[hsl(var(--status-success))]">
                {percentage}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-[hsl(var(--bg-elevated))]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(percentage, 100)}%` }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="h-2 rounded-full bg-[hsl(var(--status-success))]"
              />
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  )
}

function SetupPlatformCard({ platform, index }: { platform: SocialPlatform; index: number }) {
  const Icon = getPlatformIcon(platform)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="flex"
    >
      <Card className="p-4 flex items-center gap-3 flex-1 border-l-4 border-l-[hsl(var(--status-warning))]">
        <div className="w-9 h-9 rounded-[10px] bg-[hsl(var(--bg-elevated))] flex items-center justify-center shrink-0">
          <Icon size={18} className="text-[hsl(var(--accent-navy))]" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-card-title text-[hsl(var(--text-primary))] m-0 truncate">
            {platform.platform_name}
          </h3>
          {platform.handle && (
            <span className="text-caption truncate block">{platform.handle}</span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isLaunchCritical(platform.platform_name) && (
            <Badge variant="coral">Needed for launch</Badge>
          )}
          <Badge variant="warning">Setup Needed</Badge>
        </div>
      </Card>
    </motion.div>
  )
}

export function SocialMedia() {
  const { data: platforms, isLoading } = useSocialPlatforms()
  const [sortBy, setSortBy] = useState<SortBy>('priority')

  const allPlatforms = useMemo(() => platforms ?? [], [platforms])

  const sorted = useMemo(() => sortPlatforms(allPlatforms, sortBy), [allPlatforms, sortBy])

  const activePlatforms = useMemo(() => sorted.filter(isActivePlatform), [sorted])
  const setupPlatforms = useMemo(() => sorted.filter(p => !isActivePlatform(p)), [sorted])

  const activeCount = activePlatforms.length
  const setupCount = setupPlatforms.length
  const totalFollowers = allPlatforms.reduce((sum, p) => sum + (p.follower_count ?? 0), 0)

  const dynamicSubtitle = `${activeCount} active, ${setupCount} need setup. ${totalFollowers.toLocaleString()} total followers.`

  return (
    <PageShell
      title="Social Media"
      subtitle={dynamicSubtitle}
      actions={
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortBy)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="alpha">Alphabetical</SelectItem>
            <SelectItem value="followers">Followers</SelectItem>
            <SelectItem value="active">Last Active</SelectItem>
          </SelectContent>
        </Select>
      }
    >
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[0, 1, 2, 3].map(i => (
            <Card key={i} className="p-6 flex flex-col gap-3">
              <SkeletonBlock width="50%" height={18} />
              <SkeletonBlock width="70%" height={14} />
              <SkeletonBlock width="40%" height={14} />
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Hero stat row */}
          <div className="flex gap-4">
            <Card className="p-4 rounded-lg flex-1">
              <div className="text-stat">{activeCount}</div>
              <div className="flex items-center gap-1.5">
                <span className="text-caption">Active Platforms</span>
                {activeCount > 0 && <Badge variant="success">{activeCount}</Badge>}
              </div>
            </Card>
            <Card className="p-4 rounded-lg flex-1">
              <div className="text-stat">{totalFollowers.toLocaleString()}</div>
              <span className="text-caption">Total Followers</span>
            </Card>
            <Card className="p-4 rounded-lg flex-1">
              <div className="text-stat">{setupCount}</div>
              <div className="flex items-center gap-1.5">
                <span className="text-caption">Need Setup</span>
                {setupCount > 0 && <Badge variant="warning">{setupCount}</Badge>}
              </div>
            </Card>
          </div>

          {/* Active Platforms section */}
          {activePlatforms.length > 0 && (
            <div>
              <h2 className="text-[18px] font-semibold text-[hsl(var(--text-primary))] mb-3">
                Active Platforms <span className="text-caption font-normal">({activeCount})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {activePlatforms.map((platform, idx) => (
                  <ActivePlatformCard key={platform.id} platform={platform} index={idx} />
                ))}
              </div>
            </div>
          )}

          {/* Needs Setup section */}
          {setupPlatforms.length > 0 && (
            <div>
              <h2 className="text-[18px] font-semibold text-[hsl(var(--text-primary))] mb-3">
                Needs Setup <span className="text-caption font-normal">({setupCount})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {setupPlatforms.map((platform, idx) => (
                  <SetupPlatformCard key={platform.id} platform={platform} index={idx} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </PageShell>
  )
}
