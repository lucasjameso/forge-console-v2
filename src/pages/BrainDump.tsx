import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, ChevronDown, ChevronRight, Clock, Plus } from 'lucide-react'
import { PageShell } from '@/components/layout/PageShell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { SkeletonBlock } from '@/components/ui/SkeletonBlock'
import { ProjectBadge } from '@/components/ui/ProjectBadge'
import { useBrainDumps, useSubmitBrainDump } from '@/hooks/useBrainDump'
import { formatTime, groupByDay, cn } from '@/lib/utils'
import { getProjectColorVar, getProjectBgVar } from '@/lib/colors'

const PROJECT_OPTIONS = [
  { label: 'Auto-Route', value: 'auto', slug: 'auto' },
  { label: 'Ridgeline', value: 'ridgeline', slug: 'ridgeline' },
  { label: 'CLARITY', value: 'clarity', slug: 'clarity' },
  { label: 'Forge Console', value: 'forge', slug: 'forge' },
  { label: 'Meridian', value: 'meridian', slug: 'meridian' },
  { label: 'Atlas', value: 'atlas', slug: 'atlas' },
  { label: 'General', value: 'general', slug: 'general' },
] as const

type StatusStage = 'Captured' | 'Parsed' | 'Tasks Created' | 'Actioned'
const STATUS_STAGES: StatusStage[] = ['Captured', 'Parsed', 'Tasks Created', 'Actioned']

function getStatusStage(dump: { status: string; parsed_output: unknown }): StatusStage {
  if (dump.status === 'processed' || dump.parsed_output) return 'Parsed'
  return 'Captured'
}

function StatusProgression({ currentStage }: { currentStage: StatusStage }) {
  const currentIdx = STATUS_STAGES.indexOf(currentStage)

  return (
    <div className="flex items-center gap-1.5 mt-2">
      {STATUS_STAGES.map((stage, idx) => {
        const isCompleted = idx < currentIdx
        const isCurrent = idx === currentIdx
        return (
          <span
            key={stage}
            className={cn(
              'text-[11px] uppercase font-medium px-2 py-0.5 rounded-full',
              isCompleted && 'bg-[hsl(var(--status-success-bg))] text-[hsl(var(--status-success))]',
              isCurrent && 'bg-[hsl(var(--status-info-bg))] text-[hsl(var(--status-info))]',
              !isCompleted && !isCurrent && 'border border-[hsl(var(--border-subtle))] text-[hsl(var(--text-tertiary))]',
            )}
          >
            {stage}
          </span>
        )
      })}
    </div>
  )
}

export function BrainDump() {
  const [text, setText] = useState('')
  const [selectedProject, setSelectedProject] = useState<string>('auto')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { data: dumps, isLoading } = useBrainDumps()
  const submitMutation = useSubmitBrainDump()

  function handleTextareaInput() {
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = Math.min(el.scrollHeight, window.innerHeight * 0.5) + 'px'
    }
  }

  const handleSubmit = () => {
    if (!text.trim() || submitMutation.isPending) return
    submitMutation.mutate(
      { rawText: text.trim(), projectHint: selectedProject === 'auto' ? undefined : selectedProject },
      {
        onSuccess: () => setText(''),
      },
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  const lastResult = submitMutation.data
  const grouped = dumps ? groupByDay(dumps) : []

  return (
    <PageShell title="Brain Dump" subtitle="Capture thoughts, tasks, ideas -- let the agent sort it out.">
      <div className="flex flex-col gap-8">

        {/* Input area */}
        <Card className="p-0 overflow-hidden">
          {/* Project selector */}
          <div className="px-6 pt-5 pb-3">
            <span className="text-[12px] uppercase font-medium text-[hsl(var(--text-tertiary))] tracking-wide">
              Send to:
            </span>
            <div className="flex flex-wrap gap-2 mt-2">
              {PROJECT_OPTIONS.map((opt) => {
                const isSelected = selectedProject === opt.value
                const isAutoOrGeneral = opt.value === 'auto' || opt.value === 'general'
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSelectedProject(opt.value)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-[13px] font-medium transition-all',
                      'border cursor-pointer',
                      isSelected && isAutoOrGeneral && 'bg-[hsl(var(--bg-elevated))] text-[hsl(var(--text-primary))] border-[hsl(var(--border-default))]',
                      isSelected && !isAutoOrGeneral && 'border-transparent',
                      !isSelected && 'bg-[hsl(var(--bg-elevated))] text-[hsl(var(--text-secondary))] border-transparent hover:text-[hsl(var(--text-primary))]',
                    )}
                    style={
                      isSelected && !isAutoOrGeneral
                        ? {
                            backgroundColor: getProjectBgVar(opt.slug),
                            color: getProjectColorVar(opt.slug),
                          }
                        : undefined
                    }
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Textarea */}
          <div className="relative px-6 pb-1">
            <textarea
              ref={textareaRef}
              className="w-full min-h-[120px] bg-transparent text-[15px] leading-relaxed text-[hsl(var(--text-primary))] outline-none resize-none overflow-y-auto placeholder:text-[hsl(var(--text-tertiary))]"
              placeholder="What's on your mind?"
              value={text}
              onChange={(e) => {
                setText(e.target.value)
                handleTextareaInput()
              }}
              onKeyDown={handleKeyDown}
            />
            {!text && (
              <span className="absolute bottom-3 right-6 text-[11px] text-[hsl(var(--text-tertiary))] pointer-events-none">
                Cmd+Enter
              </span>
            )}
          </div>

          {/* Submit bar */}
          <div className="flex items-center justify-between px-6 py-3 border-t border-[hsl(var(--border-subtle))] bg-[hsl(var(--bg-elevated))]">
            <span className="text-[12px] text-[hsl(var(--text-tertiary))]">
              {submitMutation.isPending ? 'Parsing with Claude...' : 'Cmd+Enter to submit'}
            </span>
            <Button
              onClick={handleSubmit}
              disabled={!text.trim() || submitMutation.isPending}
              className={cn(
                'w-full md:w-auto md:min-w-[120px] transition-all duration-200',
                text.trim()
                  ? 'bg-[hsl(var(--accent-coral))] shadow-[0_0_12px_hsl(var(--accent-coral)/0.4)] hover:shadow-[0_0_20px_hsl(var(--accent-coral)/0.5)] scale-[1.02]'
                  : 'opacity-50 cursor-not-allowed',
              )}
            >
              <Send size={14} />
              {submitMutation.isPending ? 'Parsing...' : 'Submit'}
            </Button>
          </div>
        </Card>

        {/* Processing shimmer */}
        <AnimatePresence>
          {submitMutation.isPending && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
            >
              <Card className="p-6">
                <div className="flex flex-col gap-3">
                  <SkeletonBlock width="90%" height={14} />
                  <SkeletonBlock width="70%" height={14} />
                  <SkeletonBlock width="50%" height={14} />
                </div>
                <motion.p
                  className="text-[12px] text-[hsl(var(--text-tertiary))] mt-3"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Parsing with Claude...
                </motion.p>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Just-parsed result */}
        <AnimatePresence>
          {lastResult && !submitMutation.isPending && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card className="p-6 border-l-[3px] border-l-[hsl(var(--accent-coral))]">
                <div className="flex items-center gap-2 mb-3.5">
                  <span className="text-section-header">Parsed Result</span>
                  <Badge variant="success">New</Badge>
                </div>
                <p className="text-body mb-4">
                  {lastResult.parsed.summary}
                </p>
                <div className="flex flex-col gap-2">
                  {lastResult.parsed.tasks.map((task, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: idx * 0.05 }}
                      className="p-3 rounded-lg bg-[hsl(var(--bg-elevated))] flex items-center justify-between gap-2.5"
                    >
                      <p className="text-body-sm font-medium text-[hsl(var(--text-primary))] m-0">
                        {task.description}
                      </p>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <ProjectBadge project={task.project} />
                        <Badge
                          variant={
                            task.priority === 'high' ? 'coral' : task.priority === 'medium' ? 'warning' : 'neutral'
                          }
                        >
                          {task.priority}
                        </Badge>
                        {task.deadline && (
                          <span className="text-caption">{task.deadline}</span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {submitMutation.isError && (
          <Card className="p-6 border-l-[3px] border-l-[hsl(var(--status-error))]">
            <p className="text-body-sm text-[hsl(var(--status-error))] m-0">
              Failed to parse: {(submitMutation.error as Error).message}
            </p>
          </Card>
        )}

        {/* History */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clock size={15} className="text-[hsl(var(--text-tertiary))]" />
            <span className="text-section-header">History</span>
          </div>

          {isLoading ? (
            <div className="flex flex-col gap-3">
              {[0, 1, 2].map(i => (
                <Card key={i} className="p-6 flex flex-col gap-2">
                  <SkeletonBlock width="80%" height={14} />
                  <SkeletonBlock width="40%" height={12} />
                </Card>
              ))}
            </div>
          ) : grouped.length === 0 ? (
            <Card className="py-8 px-6 text-center">
              <p className="text-caption">No brain dumps yet. Start typing above.</p>
            </Card>
          ) : (
            <div className="flex flex-col gap-2">
              {grouped.map((group) => (
                <div key={group.label}>
                  {/* Day group header */}
                  <div className="sticky top-0 z-10 bg-[hsl(var(--bg-root))] py-2 text-[15px] font-semibold text-[hsl(var(--text-primary))]">
                    {group.label}
                  </div>

                  <div className="flex flex-col gap-2">
                    {group.items.map((dump) => {
                      const isExpanded = expandedId === dump.id
                      const currentStage = getStatusStage(dump)
                      const projectSlug = dump.project_hint ?? 'general'

                      return (
                        <motion.div
                          key={dump.id}
                          layout
                          onClick={() => setExpandedId(isExpanded ? null : dump.id)}
                        >
                          <Card
                            className="px-5 py-3.5 transition-shadow hover:shadow-card-hover cursor-pointer border-l-4"
                            style={{ borderLeftColor: getProjectColorVar(projectSlug) }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                {isExpanded
                                  ? <ChevronDown size={14} className="text-[hsl(var(--text-tertiary))] shrink-0" />
                                  : <ChevronRight size={14} className="text-[hsl(var(--text-tertiary))] shrink-0" />
                                }
                                <p className={cn(
                                  'text-body-sm text-[hsl(var(--text-primary))] m-0 overflow-hidden text-ellipsis',
                                  !isExpanded && 'whitespace-nowrap',
                                )}>
                                  {dump.raw_text}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 shrink-0 ml-3">
                                <Badge variant={dump.status === 'processed' ? 'success' : dump.status === 'pending' ? 'warning' : 'neutral'}>
                                  {dump.status}
                                </Badge>
                                <span className="text-caption">{formatTime(dump.created_at)}</span>
                              </div>
                            </div>

                            {/* Status progression */}
                            <StatusProgression currentStage={currentStage} />

                            {/* Expanded content */}
                            <AnimatePresence>
                              {isExpanded && dump.parsed_output && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div className="mt-3.5 pt-3.5 border-t border-[hsl(var(--border-subtle))]">
                                    {/* Original raw text */}
                                    <div className="border-l-2 border-[hsl(var(--border-subtle))] pl-4 text-[hsl(var(--text-secondary))] italic text-[13px] mb-4">
                                      {dump.raw_text}
                                    </div>

                                    <Separator className="my-4" />

                                    {/* Parsed output */}
                                    <p className="text-[13px] font-semibold text-[hsl(var(--text-primary))] mb-3">Parsed Output</p>
                                    <p className="text-body mb-3">
                                      {dump.parsed_output.summary}
                                    </p>
                                    <div className="flex flex-col gap-2">
                                      {dump.parsed_output.tasks.map((task, idx) => (
                                        <div
                                          key={idx}
                                          className="p-3 rounded-lg bg-[hsl(var(--bg-elevated))] border border-[hsl(var(--border-subtle))]"
                                        >
                                          <div className="flex items-center justify-between gap-2">
                                            <span className="text-[14px] font-medium text-[hsl(var(--text-primary))]">
                                              {task.description}
                                            </span>
                                            <div className="flex items-center gap-1.5 shrink-0">
                                              <ProjectBadge project={task.project} />
                                              <Badge
                                                variant={
                                                  task.priority === 'high' ? 'coral' : task.priority === 'medium' ? 'warning' : 'neutral'
                                                }
                                              >
                                                {task.priority}
                                              </Badge>
                                            </div>
                                          </div>
                                          <div className="mt-2">
                                            <button
                                              type="button"
                                              className="text-[12px] text-[hsl(var(--text-tertiary))] hover:text-[hsl(var(--text-secondary))] transition-colors flex items-center gap-1"
                                              onClick={(e) => e.stopPropagation()}
                                            >
                                              <Plus size={12} />
                                              Add to project
                                            </button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </Card>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  )
}
