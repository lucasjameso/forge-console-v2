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
import { Badge } from '@/components/ui/badge'
import { PriorityBadge } from '@/components/ui/PriorityBadge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
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
import type { Priority } from '@/lib/colors'

// ----- Section wrapper -----
function Section({ icon: Icon, title, children }: { icon: React.ComponentType<{ size?: number; className?: string }>; title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center gap-2 mb-3.5">
        <Icon size={15} className="text-[hsl(var(--text-tertiary))]" />
        <span className="text-section-header">{title}</span>
      </div>
      {children}
    </motion.div>
  )
}

// ----- Kanban Column -----
const statusDotClass: Record<TaskStatus, string> = {
  todo: 'bg-[hsl(var(--text-tertiary))]',
  in_progress: 'bg-[hsl(var(--status-warning))]',
  done: 'bg-[hsl(var(--status-success))]',
}

function KanbanColumn({ title, tasks, status, onDrop }: { title: string; tasks: Task[]; status: TaskStatus; onDrop: (taskId: string, newStatus: TaskStatus) => void }) {
  return (
    <div
      className="flex-1 min-w-0"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        const taskId = e.dataTransfer.getData('taskId')
        if (taskId) onDrop(taskId, status)
      }}
    >
      <div className="flex items-center gap-2 mb-2.5">
        <div className={`w-2 h-2 rounded-full ${statusDotClass[status]}`} />
        <span className="text-body-sm font-semibold text-[hsl(var(--text-primary))]">{title}</span>
        <span className="text-caption">({tasks.length})</span>
      </div>
      <div className="flex flex-col gap-2 min-h-[60px] p-2 rounded-[10px] bg-[hsl(var(--bg-elevated))] border border-dashed border-[hsl(var(--border-subtle))]">
        {tasks.map((task) => (
          <div
            key={task.id}
            draggable
            onDragStart={(e) => e.dataTransfer.setData('taskId', task.id)}
            className="text-body-sm font-medium py-2.5 px-3 rounded-lg bg-[hsl(var(--bg-surface))] border border-[hsl(var(--border-subtle))] cursor-grab text-[hsl(var(--text-primary))]"
          >
            <div className="mb-1">{task.title}</div>
            <div className="flex items-center gap-1.5">
              <PriorityBadge priority={task.priority as Priority} />
              {task.assignee && <span className="text-caption">{task.assignee}</span>}
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <p className="text-caption text-center p-2">No tasks</p>
        )}
      </div>
    </div>
  )
}

// ----- Milestone status -----
const milestoneNodeClass: Record<MilestoneStatus, string> = {
  done: 'bg-[hsl(var(--status-success))]',
  in_progress: 'bg-[hsl(var(--accent-coral))]',
  upcoming: 'bg-[hsl(var(--text-tertiary))]',
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
        <div className="flex flex-col gap-6">
          {[0, 1, 2].map(i => <SkeletonCard key={i} />)}
        </div>
      </PageShell>
    )
  }

  if (!project) {
    return (
      <PageShell title="Project Not Found">
        <Card className="p-6 text-center py-12">
          <p className="text-body">No project found with slug "{slug}".</p>
          <Link to="/projects" className="text-body text-[hsl(var(--accent-coral))] mt-3 inline-block no-underline">
            Back to Projects
          </Link>
        </Card>
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

  return (
    <PageShell
      title={project.name}
      subtitle={project.description}
      actions={
        <Link
          to="/projects"
          className="text-body-sm flex items-center gap-1.5 text-[hsl(var(--text-secondary))] no-underline"
        >
          <ArrowLeft size={14} />
          Back to Projects
        </Link>
      }
    >
      <div className="flex flex-col gap-8">

        {/* Row 1: Action Items */}
        {openActions.length > 0 && (
          <Section icon={AlertCircle} title="Needs Your Attention">
            <div className="flex flex-col gap-2">
              {openActions.map((item) => (
                <div
                  key={item.id}
                  className={`py-3 px-4 rounded-[10px] border border-[hsl(var(--border-subtle))] flex items-center justify-between gap-3 ${
                    item.urgency === 'high'
                      ? 'bg-[hsl(var(--status-error-bg))]'
                      : 'bg-[hsl(var(--bg-elevated))]'
                  }`}
                >
                  <p className="text-body-sm font-medium text-[hsl(var(--text-primary))] m-0">
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
          <Card className="p-6">
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-body">{project.current_phase ?? 'No phase set'}</span>
                <span className="text-xl font-bold text-[hsl(var(--text-primary))]">{project.progress_pct}%</span>
              </div>
              <div className="w-full h-2.5 rounded-[5px] bg-[hsl(var(--bg-elevated))] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress_pct}%` }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-[5px] bg-[hsl(var(--accent-coral))]"
                />
              </div>
            </div>

            {/* Milestone timeline */}
            {milestones && milestones.length > 0 && (
              <div className="flex items-start relative">
                {/* Connecting line */}
                <div className="absolute top-[10px] left-[10px] right-[10px] h-0.5 bg-[hsl(var(--bg-elevated))] z-0" />
                {milestones.map((ms, idx) => (
                  <div
                    key={ms.id}
                    className={`flex-1 flex flex-col relative z-[1] ${
                      idx === 0
                        ? 'items-start'
                        : idx === milestones.length - 1
                        ? 'items-end'
                        : 'items-center'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-[3px] border-[hsl(var(--bg-surface))] flex items-center justify-center ${milestoneNodeClass[ms.status]}`}
                    >
                      {ms.status === 'done' && (
                        <Check size={10} className="text-white" />
                      )}
                    </div>
                    <span className="text-caption font-medium text-[hsl(var(--text-primary))] mt-1.5 text-center">
                      {ms.title}
                    </span>
                    {ms.target_date && (
                      <span className="text-caption mt-0.5">
                        {formatShortDate(ms.target_date)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </Section>

        {/* Row 3: Recent Activity */}
        <Section icon={Activity} title="Recent Activity">
          <Card className="p-0">
            {recentActivity.length === 0 ? (
              <p className="text-caption text-center p-6">No recent activity</p>
            ) : (
              recentActivity.map((entry, idx) => (
                <div
                  key={entry.id}
                  className={`py-3 px-5 flex items-center justify-between gap-3 ${
                    idx < recentActivity.length - 1
                      ? 'border-b border-[hsl(var(--border-subtle))]'
                      : ''
                  }`}
                >
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <Badge variant="navy">{entry.tool ?? entry.session_type}</Badge>
                    <p className="text-body-sm text-[hsl(var(--text-primary))] m-0 overflow-hidden text-ellipsis whitespace-nowrap">
                      {entry.summary}
                    </p>
                  </div>
                  <span className="text-caption shrink-0">{formatRelativeTime(entry.created_at)}</span>
                </div>
              ))
            )}
          </Card>
        </Section>

        {/* Row 4: Mini Kanban */}
        <Section icon={Columns3} title="Tasks">
          <div className="grid grid-cols-3 gap-4">
            <KanbanColumn title="To Do" tasks={todoTasks} status="todo" onDrop={handleDrop} />
            <KanbanColumn title="In Progress" tasks={inProgressTasks} status="in_progress" onDrop={handleDrop} />
            <KanbanColumn title="Done" tasks={doneTasks} status="done" onDrop={handleDrop} />
          </div>
        </Section>

        {/* Row 5: Notes */}
        <Section icon={StickyNote} title="Notes & Decisions">
          <Card className="p-6 flex flex-col gap-3">
            {(notes ?? []).map((note) => (
              <div
                key={note.id}
                className="py-2.5 px-3.5 rounded-lg bg-[hsl(var(--bg-elevated))] flex items-start justify-between gap-2.5"
              >
                <p className="text-body-sm text-[hsl(var(--text-primary))] m-0 leading-relaxed">
                  {note.content}
                </p>
                <div className="flex items-center gap-1.5 shrink-0">
                  {note.tag && <Badge variant="navy">{note.tag}</Badge>}
                  <span className="text-caption">{formatRelativeTime(note.created_at)}</span>
                </div>
              </div>
            ))}
            {(notes ?? []).length === 0 && (
              <p className="text-caption text-center p-3">No notes yet</p>
            )}

            {/* Add note form */}
            <div className="flex gap-2 mt-1">
              <input
                className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-coral focus:ring-2 focus:ring-coral/10 placeholder:text-muted-foreground font-[inherit]"
                placeholder="Add a note..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddNote() }}
              />
              <Button onClick={handleAddNote} disabled={!noteText.trim()}>
                <Plus size={14} />
                Add
              </Button>
            </div>
          </Card>
        </Section>

        {/* Row 6: Quick Actions / Linked Resources */}
        <Section icon={Zap} title="Linked Resources">
          <div className="flex gap-3">
            {project.github_url && (
              <Button variant="outline" asChild>
                <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                  <Github size={14} />
                  GitHub
                  <ExternalLink size={12} />
                </a>
              </Button>
            )}
            {project.cloudflare_url && (
              <Button variant="outline" asChild>
                <a href={project.cloudflare_url} target="_blank" rel="noopener noreferrer">
                  <Globe size={14} />
                  Cloudflare
                  <ExternalLink size={12} />
                </a>
              </Button>
            )}
            {project.supabase_ref && (
              <Button variant="outline" asChild>
                <a href={`https://supabase.com/dashboard/project/${project.supabase_ref}`} target="_blank" rel="noopener noreferrer">
                  <Database size={14} />
                  Supabase
                  <ExternalLink size={12} />
                </a>
              </Button>
            )}
            {!project.github_url && !project.cloudflare_url && !project.supabase_ref && (
              <p className="text-caption">No linked resources</p>
            )}
          </div>
        </Section>

        {/* Row 7: Next Session Prompt */}
        {sessionPrompt && (
          <Section icon={Copy} title="Next Session Prompt">
            <Card
              className="p-6 cursor-pointer relative"
              onClick={handleCopyPrompt}
            >
              <p className="text-body-sm text-[hsl(var(--text-primary))] leading-relaxed m-0 pr-8">
                {sessionPrompt.prompt_text}
              </p>
              <div
                className={`text-caption absolute top-4 right-4 flex items-center gap-1 ${
                  copied
                    ? 'text-[hsl(var(--status-success))]'
                    : 'text-[hsl(var(--text-tertiary))]'
                }`}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Click to copy'}
              </div>
            </Card>
          </Section>
        )}
      </div>
    </PageShell>
  )
}
