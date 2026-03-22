import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter } from 'lucide-react'
import { PageShell } from '@/components/layout/PageShell'
import { Badge } from '@/components/ui/badge'
import { SkeletonBlock } from '@/components/ui/SkeletonBlock'
import { useActivityLog } from '@/hooks/useActivityLog'
import { useProjects } from '@/hooks/useProjects'
import { formatRelativeTime } from '@/lib/utils'
import type { SessionType } from '@/types/database'

const sessionTypes: { key: SessionType | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'claude_code', label: 'Claude Code' },
  { key: 'n8n', label: 'n8n' },
  { key: 'slack', label: 'Slack' },
  { key: 'system', label: 'System' },
  { key: 'manual', label: 'Manual' },
  { key: 'cowork', label: 'Cowork' },
]

const sessionBadge: Record<string, 'coral' | 'info' | 'warning' | 'success' | 'navy' | 'neutral'> = {
  claude_code: 'coral',
  n8n: 'info',
  slack: 'warning',
  system: 'neutral',
  manual: 'navy',
  cowork: 'success',
}

export function ActivityLog() {
  const [search, setSearch] = useState('')
  const [projectFilter, setProjectFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState<SessionType | 'all'>('all')

  const { data: projects } = useProjects()
  const { data: entries, isLoading } = useActivityLog({
    project: projectFilter !== 'all' ? projectFilter : undefined,
    sessionType: typeFilter !== 'all' ? typeFilter as SessionType : undefined,
    search: search || undefined,
  })

  return (
    <PageShell title="Activity Log" subtitle="Every action across your entire system.">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Filters */}
        <div className="rounded-lg border bg-card p-6 shadow-card" style={{ padding: '14px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            {/* Search */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 200 }}>
              <Search size={14} style={{ color: 'hsl(var(--text-tertiary))' }} />
              <input
                className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-coral focus:ring-2 focus:ring-coral/10 placeholder:text-muted-foreground font-[inherit]"
                style={{ border: 'none', padding: '4px 0', boxShadow: 'none' }}
                placeholder="Search activity..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Project filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Filter size={13} style={{ color: 'hsl(var(--text-tertiary))' }} />
              <div style={{ display: 'flex', gap: 4 }}>
                <FilterChip
                  label="All Projects"
                  active={projectFilter === 'all'}
                  onClick={() => setProjectFilter('all')}
                />
                {(projects ?? []).map(p => (
                  <FilterChip
                    key={p.slug}
                    label={p.name.split(' ')[0]}
                    active={projectFilter === p.slug}
                    onClick={() => setProjectFilter(p.slug)}
                  />
                ))}
              </div>
            </div>

            {/* Type filter */}
            <div style={{ display: 'flex', gap: 4 }}>
              {sessionTypes.map(st => (
                <FilterChip
                  key={st.key}
                  label={st.label}
                  active={typeFilter === st.key}
                  onClick={() => setTypeFilter(st.key as SessionType | 'all')}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Timeline */}
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="rounded-lg border bg-card p-6 shadow-card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px' }}>
                <SkeletonBlock width={8} height={8} style={{ borderRadius: '50%' }} />
                <SkeletonBlock width="60%" height={14} />
                <div style={{ marginLeft: 'auto' }}>
                  <SkeletonBlock width={60} height={12} />
                </div>
              </div>
            ))}
          </div>
        ) : (entries ?? []).length === 0 ? (
          <div className="rounded-lg border bg-card p-6 shadow-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <p className="text-body">No activity matches your filters.</p>
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            {/* Vertical timeline line */}
            <div
              style={{
                position: 'absolute',
                left: 19,
                top: 24,
                bottom: 24,
                width: 2,
                backgroundColor: 'hsl(var(--border-subtle))',
                zIndex: 0,
              }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {(entries ?? []).map((entry, idx) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.03, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 16,
                    padding: '14px 0',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {/* Dot */}
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: 'hsl(var(--accent-coral))',
                      border: '3px solid hsl(var(--bg-root))',
                      flexShrink: 0,
                      marginTop: 5,
                      marginLeft: 14,
                    }}
                  />

                  {/* Content */}
                  <div
                    className="rounded-lg border bg-card p-6 shadow-card"
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                      <Badge variant={sessionBadge[entry.session_type] ?? 'neutral'}>
                        {entry.tool ?? entry.session_type}
                      </Badge>
                      {entry.project && (
                        <Badge variant="navy">{entry.project}</Badge>
                      )}
                      <p style={{
                        fontSize: 13,
                        color: 'hsl(var(--text-primary))',
                        margin: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {entry.summary}
                      </p>
                    </div>
                    <span className="text-caption" style={{ flexShrink: 0 }}>
                      {formatRelativeTime(entry.created_at)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageShell>
  )
}

// Filter chip component
function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '4px 10px',
        borderRadius: 'var(--radius-pill)',
        border: '1px solid',
        borderColor: active ? 'hsl(var(--accent-coral))' : 'hsl(var(--border-default))',
        backgroundColor: active ? 'hsl(var(--accent-coral) / 0.1)' : 'transparent',
        color: active ? 'hsl(var(--accent-coral))' : 'hsl(var(--text-secondary))',
        fontSize: 11,
        fontWeight: active ? 600 : 400,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'all 0.15s ease',
      }}
    >
      {label}
    </button>
  )
}
