import { motion } from 'framer-motion'
import {
  Linkedin,
  BookOpen,
  FileText,
  ShoppingBag,
  ExternalLink,
  Users,
  Clock,
  AlertTriangle,
} from 'lucide-react'
import { PageShell } from '@/components/layout/PageShell'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { SkeletonBlock } from '@/components/ui/SkeletonBlock'
import { useSocialPlatforms } from '@/hooks/useSocialPlatforms'
import { formatRelativeTime } from '@/lib/utils'
import type { SocialPlatformStatus } from '@/types/database'

const platformIcons: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  Linkedin: Linkedin,
  BookOpen: BookOpen,
  FileText: FileText,
  ShoppingBag: ShoppingBag,
}

const statusBadge: Record<SocialPlatformStatus, { variant: 'success' | 'warning' | 'neutral'; label: string }> = {
  active: { variant: 'success', label: 'Active' },
  setup_needed: { variant: 'warning', label: 'Setup Needed' },
  inactive: { variant: 'neutral', label: 'Inactive' },
}

export function SocialMedia() {
  const { data: platforms, isLoading } = useSocialPlatforms()

  return (
    <PageShell title="Social Media" subtitle="All your platforms in one place.">
      {isLoading ? (
        <div className="social-grid" style={{ display: 'grid', gap: 16 }}>
          {[0, 1, 2, 3].map(i => (
            <Card key={i} className="p-6" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <SkeletonBlock width="50%" height={18} />
              <SkeletonBlock width="70%" height={14} />
              <SkeletonBlock width="40%" height={14} />
            </Card>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Platform cards */}
          <div className="social-grid" style={{ display: 'grid', gap: 16 }}>
            {(platforms ?? []).map((platform, idx) => {
              const Icon = platformIcons[platform.icon_name] ?? FileText
              const badge = statusBadge[platform.status]
              const meta = platform.metadata as Record<string, number> | null

              return (
                <motion.div
                  key={platform.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
                >
                <Card className="p-6" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          backgroundColor: 'hsl(var(--bg-elevated))',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon size={18} style={{ color: 'hsl(var(--accent-navy))' }} />
                      </div>
                      <div>
                        <h3 className="text-card-title" style={{ color: 'hsl(var(--text-primary))', margin: 0 }}>
                          {platform.platform_name}
                        </h3>
                        {platform.handle && (
                          <span className="text-caption">{platform.handle}</span>
                        )}
                      </div>
                    </div>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  </div>

                  {/* Stats */}
                  <div style={{ display: 'flex', gap: 20 }}>
                    {platform.follower_count !== null && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Users size={13} style={{ color: 'hsl(var(--text-tertiary))' }} />
                        <span className="text-body font-semibold" style={{ color: 'hsl(var(--text-primary))' }}>
                          {platform.follower_count.toLocaleString()}
                        </span>
                        {meta?.target && (
                          <span className="text-caption">/ {meta.target.toLocaleString()} goal</span>
                        )}
                      </div>
                    )}
                    {platform.last_post_date && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Clock size={13} style={{ color: 'hsl(var(--text-tertiary))' }} />
                        <span className="text-caption">
                          Last post {formatRelativeTime(platform.last_post_date)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Progress bar for follower goal */}
                  {platform.follower_count !== null && meta?.target && (
                    <div>
                      <div style={{ width: '100%', height: 6, borderRadius: 3, backgroundColor: 'hsl(var(--bg-elevated))', overflow: 'hidden' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((platform.follower_count / meta.target) * 100, 100)}%` }}
                          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                          style={{ height: '100%', borderRadius: 3, backgroundColor: 'hsl(var(--accent-coral))' }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Setup needed alert */}
                  {platform.status === 'setup_needed' && (
                    <div
                      className="text-caption"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '8px 12px',
                        borderRadius: 8,
                        backgroundColor: 'hsl(var(--status-warning-bg))',
                        color: 'hsl(var(--status-warning))',
                      }}
                    >
                      <AlertTriangle size={13} />
                      This platform needs to be set up
                    </div>
                  )}

                  {/* Link */}
                  {platform.profile_url && (
                    <a
                      href={platform.profile_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-caption font-medium"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        color: 'hsl(var(--accent-coral))',
                        textDecoration: 'none',
                        marginTop: 'auto',
                      }}
                    >
                      View profile
                      <ExternalLink size={11} />
                    </a>
                  )}
                </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Summary stats */}
          <Card className="p-6">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <span className="text-section-header">Overview</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              <div style={{ textAlign: 'center' }}>
                <div className="text-stat">
                  {(platforms ?? []).filter(p => p.status === 'active').length}
                </div>
                <span className="text-caption">Active Platforms</span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div className="text-stat">
                  {(platforms ?? []).reduce((sum, p) => sum + (p.follower_count ?? 0), 0).toLocaleString()}
                </div>
                <span className="text-caption">Total Followers</span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div className="text-stat">
                  {(platforms ?? []).filter(p => p.status === 'setup_needed').length}
                </div>
                <span className="text-caption">Need Setup</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      <style>{`
        .social-grid { grid-template-columns: repeat(2, 1fr); }
        @media (max-width: 768px) { .social-grid { grid-template-columns: 1fr; } }
      `}</style>
    </PageShell>
  )
}
