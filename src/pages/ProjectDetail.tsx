import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  AlertCircle,
  Activity,
  Target,
  Columns3,
  StickyNote,
  Zap,
  ExternalLink,
  Copy,
  Check,
  Plus,
  Github,
  Globe,
  Database,
} from 'lucide-react'
import { PageShell } from '@/components/layout/PageShell'
import { Badge } from '@/components/ui/Badge'
import { SkeletonCard } from '@/components/ui/SkeletonBlock'
import {
  useProject,
  useActionItems,
  useTasks,
  useMilestones,
  useProjectNotes,
  useNextSessionPrompt,
  useUpdateTask,
  useAddNote,
} from '@/hooks/useProjects'
import { useActivityLog } from '@/hooks/useActivityLog'
import { formatRelativeTime, formatShortDate } from '@/lib/utils'
import type { Task, TaskStatus, MilestoneStatus } from '@/types/database'

// ----- Section wrapper -----
function Section({ icon: Icon, title, children }: { icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>; title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <Icon size={15} style={{ color: 'hsl(var(--text-tertiary))' }} />
        <span className="text-section-header">{title}</span>
      </div>
      {children}
    </motion.div>
  )
}

// ----- Kanban Column -----
function KanbanColumn({ title, tasks, status, onDrop }: { title: string; tasks: Task[]; status: TaskStatus; onDrop: (taskId: string, newStatus: TaskStatus) => void }) {
  const statusColors: Record<TaskStatus, string> = {
    todo: 'hsl(var(--text-tertiary))',
    in_progress: 'hsl(var(--status-warning))',
    done: 'hsl(var(--status-success))',
  }

  return (
    <div
      style={{ flex: 1, minWidth: 0 }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        const taskId = e.dataTransfer.getData('taskId')
        if (taskId) onDrop(taskId, status)
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: statusColors[status] }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: 'hsl(var(--text-primary))' }}>{title}</span>
        <span className="text-caption">({tasks.length})</span>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          minHeight: 60,
          padding: 8,
          borderRadius: 10,
          backgroundColor: 'hsl(var(--bg-elevated))',
          border: '1px dashed var(--border-subtle)',
        }}
      >
        {tasks.map((task) => (
          <div
            key={task.id}
            draggable
            onDragStart={(e) => e.dataTransfer.setData('taskId', task.id)}
            style={{
              padding: '10px 12px',
              borderRadius: 8,
              backgroundColor: 'hsl(var(--bg-surface))',
              border: '1px solid hsl(var(--border-subtle))',
              cursor: 'grab',
              fontSize: 13,
              color: 'hsl(var(--text-primary))',
              fontWeight: 500,
            }}
          >
            <div style={{ marginBottom: 4 }}>{task.title}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Badge variant={task.priority === 'high' ? 'coral' : task.priority === 'medium' ? 'warning' : 'neutral'}>
                {task.priority}
              </Badge>
              {task.assignee && <span className="text-caption">{task.assignee}</span>}
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <p className="text-caption" style={{ textAlign: 'center', padding: 8 }}>No tasks</p>
        )}
      </div>
    </div>
  )
}

// ----- Main component -----
export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { data: project, isLoading: loadingProject } = useProject(slug ?? '')
  const projectId = project?.id ?? ''

  const { data: actionItems } = useActionItems(projectId || undefined)
  const { data: tasks } = useTasks(projectId)
  const { data: milestones } = useMilestones(projectId)
  const { data: notes } = useProjectNotes(projectId)
  const { data: sessionPrompt } = useNextSessionPrompt(projectId)
  const { data: activity } = useActivityLog({ project: project?.slug })
  const updateTask = useUpdateTask()
  const addNote = useAddNote()

  const [copied, setCopied] = useState(false)
  const [noteText, setNoteText] = useState('')

  if (loadingProject) {
    return (
      <PageShell title="Loading...">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {[0, 1, 2].map(i => <SkeletonCard key={i} />)}
        </div>
      </PageShell>
    )
  }

  if (!project) {
    return (
      <PageShell title="Project Not Found">
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <p className="text-body">No project found with slug "{slug}".</p>
          <Link to="/projects" style={{ color: 'hsl(var(--accent-coral))', fontSize: 14, marginTop: 12, display: 'inline-block' }}>
            Back to Projects
          </Link>
        </div>
      </PageShell>
    )
  }

  const openActions = (actionItems ?? []).filter(a => a.status === 'open')
  const todoTasks = (tasks ?? []).filter(t => t.status === 'todo')
  const inProgressTasks = (tasks ?? []).filter(t => t.status === 'in_progress')
  const doneTasks = (tasks ?? []).filter(t => t.status === 'done')
  const recentActivity = (activity ?? []).slice(0, 5)

  const handleDrop = (taskId: string, newStatus: TaskStatus) => {
    updateTask.mutate({ id: taskId, status: newStatus })
  }

  const handleAddNote = () => {
    if (!noteText.trim()) return
    addNote.mutate({ project_id: projectId, content: noteText.trim() })
    setNoteText('')
  }

  const handleCopyPrompt = () => {
    if (sessionPrompt?.prompt_text) {
      void navigator.clipboard.writeText(sessionPrompt.prompt_text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const milestoneStatusColor: Record<MilestoneStatus, string> = {
    done: 'hsl(var(--status-success))',
    in_progress: 'hsl(var(--accent-coral))',
    upcoming: 'hsl(var(--text-tertiary))',
  }

  return (
    <PageShell
      title={project.name}
      subtitle={project.description}
      actions={
        <Link
          to="/projects"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 13,
            color: 'hsl(var(--text-secondary))',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={14} />
          Back to Projects
        </Link>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

        {/* Row 1: Action Items */}
        {openActions.length > 0 && (
          <Section icon={AlertCircle} title="Needs Your Attention">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {openActions.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 10,
                    border: '1px solid hsl(var(--border-subtle))',
                    backgroundColor: item.urgency === 'high' ? 'hsl(var(--status-error-bg))' : 'hsl(var(--bg-elevated))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                  }}
                >
                  <p style={{ fontSize: 13, fontWeight: 500, color: 'hsl(var(--text-primary))', margin: 0 }}>
                    {item.description}
                  </p>
                  <Badge variant={item.urgency === 'high' ? 'error' : item.urgency === 'medium' ? 'warning' : 'neutral'}>
                    {item.urgency}
                  </Badge>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Row 2: Progress + Milestone Timeline */}
        <Section icon={Target} title="Progress">
          <div className="card">
            {/* Progress bar */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span className="text-body">{project.current_phase ?? 'No phase set'}</span>
                <span style={{ fontSize: 20, fontWeight: 700, color: 'hsl(var(--text-primary))' }}>{project.progress_pct}%</span>
              </div>
              <div style={{ width: '100%', height: 10, borderRadius: 5, backgroundColor: 'hsl(var(--bg-elevated))', overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress_pct}%` }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  style={{ height: '100%', borderRadius: 5, backgroundColor: 'hsl(var(--accent-coral))' }}
                />
              </div>
            </div>

            {/* Milestone timeline */}
            {milestones && milestones.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, position: 'relative' }}>
                {/* Connecting line */}
                <div
                  style={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    right: 10,
                    height: 2,
                    backgroundColor: 'hsl(var(--bg-elevated))',
                    zIndex: 0,
                  }}
                />
                {milestones.map((ms, idx) => (
                  <div
                    key={ms.id}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: idx === 0 ? 'flex-start' : idx === milestones.length - 1 ? 'flex-end' : 'center',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        backgroundColor: milestoneStatusColor[ms.status],
                        border: '3px solid hsl(var(--bg-surface))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {ms.status === 'done' && (
                        <Check size={10} style={{ color: 'white' }} />
                      )}
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 500, color: 'hsl(var(--text-primary))', marginTop: 6, textAlign: 'center' }}>
                      {ms.title}
                    </span>
                    {ms.target_date && (
                      <span className="text-caption" style={{ marginTop: 2 }}>
                        {formatShortDate(ms.target_date)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Section>

        {/* Row 3: Recent Activity */}
        <Section icon={Activity} title="Recent Activity">
          <div className="card" style={{ padding: 0 }}>
            {recentActivity.length === 0 ? (
              <p className="text-caption" style={{ textAlign: 'center', padding: 24 }}>No recent activity</p>
            ) : (
              recentActivity.map((entry, idx) => (
                <div
                  key={entry.id}
                  style={{
                    padding: '12px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    borderBottom: idx < recentActivity.length - 1 ? '1px solid hsl(var(--border-subtle))' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                    <Badge variant="navy">{entry.tool ?? entry.session_type}</Badge>
                    <p style={{ fontSize: 13, color: 'hsl(var(--text-primary))', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {entry.summary}
                    </p>
                  </div>
                  <span className="text-caption" style={{ flexShrink: 0 }}>{formatRelativeTime(entry.created_at)}</span>
                </div>
              ))
            )}
          </div>
        </Section>

        {/* Row 4: Mini Kanban */}
        <Section icon={Columns3} title="Tasks">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <KanbanColumn title="To Do" tasks={todoTasks} status="todo" onDrop={handleDrop} />
            <KanbanColumn title="In Progress" tasks={inProgressTasks} status="in_progress" onDrop={handleDrop} />
            <KanbanColumn title="Done" tasks={doneTasks} status="done" onDrop={handleDrop} />
          </div>
        </Section>

        {/* Row 5: Notes */}
        <Section icon={StickyNote} title="Notes & Decisions">
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(notes ?? []).map((note) => (
              <div
                key={note.id}
                style={{
                  padding: '10px 14px',
                  borderRadius: 8,
                  backgroundColor: 'hsl(var(--bg-elevated))',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 10,
                }}
              >
                <p style={{ fontSize: 13, color: 'hsl(var(--text-primary))', margin: 0, lineHeight: 1.5 }}>
                  {note.content}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  {note.tag && <Badge variant="navy">{note.tag}</Badge>}
                  <span className="text-caption">{formatRelativeTime(note.created_at)}</span>
                </div>
              </div>
            ))}
            {(notes ?? []).length === 0 && (
              <p className="text-caption" style={{ textAlign: 'center', padding: 12 }}>No notes yet</p>
            )}

            {/* Add note form */}
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <input
                className="input"
                placeholder="Add a note..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddNote() }}
              />
              <button className="btn-primary" onClick={handleAddNote} disabled={!noteText.trim()}>
                <Plus size={14} />
                Add
              </button>
            </div>
          </div>
        </Section>

        {/* Row 6: Quick Actions / Linked Resources */}
        <Section icon={Zap} title="Linked Resources">
          <div style={{ display: 'flex', gap: 12 }}>
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                <Github size={14} />
                GitHub
                <ExternalLink size={12} />
              </a>
            )}
            {project.cloudflare_url && (
              <a
                href={project.cloudflare_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                <Globe size={14} />
                Cloudflare
                <ExternalLink size={12} />
              </a>
            )}
            {project.supabase_ref && (
              <a
                href={`https://supabase.com/dashboard/project/${project.supabase_ref}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                <Database size={14} />
                Supabase
                <ExternalLink size={12} />
              </a>
            )}
            {!project.github_url && !project.cloudflare_url && !project.supabase_ref && (
              <p className="text-caption">No linked resources</p>
            )}
          </div>
        </Section>

        {/* Row 7: Next Session Prompt */}
        {sessionPrompt && (
          <Section icon={Copy} title="Next Session Prompt">
            <div
              className="card"
              style={{ cursor: 'pointer', position: 'relative' }}
              onClick={handleCopyPrompt}
            >
              <p style={{ fontSize: 13, color: 'hsl(var(--text-primary))', lineHeight: 1.6, margin: 0, paddingRight: 32 }}>
                {sessionPrompt.prompt_text}
              </p>
              <div
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  color: copied ? 'hsl(var(--status-success))' : 'hsl(var(--text-tertiary))',
                  fontSize: 12,
                }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Click to copy'}
              </div>
            </div>
          </Section>
        )}
      </div>
    </PageShell>
  )
}
