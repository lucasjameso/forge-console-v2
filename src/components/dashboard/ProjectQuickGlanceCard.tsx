import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FolderKanban, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { SkeletonBlock } from '@/components/ui/SkeletonBlock'
import { useProjects } from '@/hooks/useProjects'
import { formatRelativeTime } from '@/lib/utils'

export function ProjectQuickGlanceCard() {
  const { data: projects, isLoading } = useProjects()

  if (isLoading) {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <SkeletonBlock width={15} height={15} style={{ borderRadius: '50%' }} />
          <SkeletonBlock width="30%" height={16} />
        </div>
        <div className="project-glance-grid" style={{ display: 'grid', gap: 16 }}>
          {[0, 1, 2].map(i => (
            <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <SkeletonBlock width="70%" height={16} />
              <SkeletonBlock width="100%" height={8} style={{ borderRadius: 4 }} />
              <SkeletonBlock width="50%" height={12} />
              <SkeletonBlock width="60%" height={12} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const data = projects ?? []

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <FolderKanban size={15} style={{ color: 'hsl(var(--text-tertiary))' }} />
        <span className="text-section-header">Projects</span>
      </div>

      <div className="project-glance-grid" style={{ display: 'grid', gap: 16 }}>
        {data.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              to={`/projects/${project.slug}`}
              style={{ textDecoration: 'none', display: 'block' }}
            >
              <div
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                  cursor: 'pointer',
                  height: '100%',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="text-card-title" style={{ fontSize: 15 }}>
                    {project.name}
                  </span>
                  <Badge
                    variant={
                      project.priority === 'high'
                        ? 'coral'
                        : project.priority === 'medium'
                        ? 'warning'
                        : 'neutral'
                    }
                  >
                    {project.priority}
                  </Badge>
                </div>

                {/* Progress bar */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 6,
                    }}
                  >
                    <span className="text-caption">Progress</span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: 'hsl(var(--text-primary))',
                      }}
                    >
                      {project.progress_pct}%
                    </span>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: 'hsl(var(--bg-elevated))',
                      overflow: 'hidden',
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${project.progress_pct}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        height: '100%',
                        borderRadius: 3,
                        backgroundColor: 'hsl(var(--accent-coral))',
                      }}
                    />
                  </div>
                </div>

                {/* Phase */}
                {project.current_phase && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="text-caption">Phase:</span>
                    <span style={{ fontSize: 12, fontWeight: 500, color: 'hsl(var(--text-secondary))' }}>
                      {project.current_phase}
                    </span>
                  </div>
                )}

                {/* Last activity + link */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 'auto',
                  }}
                >
                  <span className="text-caption">
                    Updated {formatRelativeTime(project.updated_at)}
                  </span>
                  <ArrowRight
                    size={14}
                    style={{ color: 'hsl(var(--text-tertiary))' }}
                  />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <style>{`
        .project-glance-grid { grid-template-columns: repeat(3, 1fr); }
        @media (max-width: 1024px) { .project-glance-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .project-glance-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  )
}
