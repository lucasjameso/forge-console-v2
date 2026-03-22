import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Github, Globe, Database } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { StatusDot } from '@/components/ui/StatusDot'
import { formatRelativeTime } from '@/lib/utils'
import type { Project } from '@/types/database'

interface ProjectCardProps {
  project: Project
  index: number
}

const statusVariant: Record<string, 'success' | 'warning' | 'info' | 'neutral'> = {
  active: 'success',
  paused: 'warning',
  completed: 'info',
  archived: 'neutral',
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link to={`/projects/${project.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16, cursor: 'pointer' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: 'hsl(var(--text-primary))', margin: 0 }}>
                  {project.name}
                </h3>
                <Badge variant={statusVariant[project.status] ?? 'neutral'}>
                  {project.status}
                </Badge>
              </div>
              <p style={{ fontSize: 13, color: 'hsl(var(--text-secondary))', lineHeight: 1.5, margin: 0 }}>
                {project.description}
              </p>
            </div>
            <ArrowRight size={18} style={{ color: 'hsl(var(--text-tertiary))', flexShrink: 0, marginTop: 4 }} />
          </div>

          {/* Progress */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span className="text-caption">
                {project.current_phase ?? 'No phase set'}
              </span>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'hsl(var(--text-primary))' }}>
                {project.progress_pct}%
              </span>
            </div>
            <div
              style={{
                width: '100%',
                height: 8,
                borderRadius: 4,
                backgroundColor: 'hsl(var(--bg-elevated))',
                overflow: 'hidden',
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${project.progress_pct}%` }}
                transition={{ duration: 1, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  height: '100%',
                  borderRadius: 4,
                  backgroundColor: 'hsl(var(--accent-coral))',
                }}
              />
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <StatusDot status={project.priority === 'high' ? 'error' : project.priority === 'medium' ? 'warning' : 'info'} />
                <span className="text-caption" style={{ textTransform: 'capitalize' }}>{project.priority} priority</span>
              </div>
              {project.github_url && <Github size={13} style={{ color: 'hsl(var(--text-tertiary))' }} />}
              {project.cloudflare_url && <Globe size={13} style={{ color: 'hsl(var(--text-tertiary))' }} />}
              {project.supabase_ref && <Database size={13} style={{ color: 'hsl(var(--text-tertiary))' }} />}
            </div>
            <span className="text-caption">Updated {formatRelativeTime(project.updated_at)}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
