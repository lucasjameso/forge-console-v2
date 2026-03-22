import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, ChevronDown, ChevronRight, Clock } from 'lucide-react'
import { PageShell } from '@/components/layout/PageShell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { SkeletonBlock } from '@/components/ui/SkeletonBlock'
import { useBrainDumps, useSubmitBrainDump } from '@/hooks/useBrainDump'
import { formatRelativeTime } from '@/lib/utils'

export function BrainDump() {
  const [text, setText] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const { data: dumps, isLoading } = useBrainDumps()
  const submitMutation = useSubmitBrainDump()

  const handleSubmit = () => {
    if (!text.trim() || submitMutation.isPending) return
    submitMutation.mutate(text.trim(), {
      onSuccess: () => setText(''),
    })
  }

  const lastResult = submitMutation.data

  return (
    <PageShell title="Brain Dump" subtitle="Capture anything. Let the agent sort it out.">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

        {/* Input area */}
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <textarea
            className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-coral focus:ring-2 focus:ring-coral/10 placeholder:text-muted-foreground font-[inherit]"
            style={{
              minHeight: 140,
              resize: 'vertical',
              border: 'none',
              borderRadius: 0,
              padding: '20px 24px',
              fontSize: 15,
              lineHeight: 1.7,
            }}
            placeholder="Dump your thoughts here... tasks, ideas, reminders, anything. Hit Submit and the agent will parse it into structured tasks."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.metaKey) handleSubmit()
            }}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 24px',
              borderTop: '1px solid hsl(var(--border-subtle))',
              backgroundColor: 'hsl(var(--bg-elevated))',
            }}
          >
            <span className="text-caption">
              {submitMutation.isPending ? 'Parsing with Claude...' : 'Cmd+Enter to submit'}
            </span>
            <Button
              onClick={handleSubmit}
              disabled={!text.trim() || submitMutation.isPending}
            >
              <Send size={14} />
              {submitMutation.isPending ? 'Parsing...' : 'Submit'}
            </Button>
          </div>
        </Card>

        {/* Just-parsed result */}
        <AnimatePresence>
          {lastResult && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card className="p-6" style={{ borderLeft: '3px solid hsl(var(--accent-coral))' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <span className="text-section-header">Parsed Result</span>
                  <Badge variant="success">New</Badge>
                </div>
                <p className="text-body" style={{ marginBottom: 16 }}>
                  {lastResult.parsed.summary}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {lastResult.parsed.tasks.map((task, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: idx * 0.05 }}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 8,
                        backgroundColor: 'hsl(var(--bg-elevated))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 10,
                      }}
                    >
                      <p style={{ fontSize: 13, color: 'hsl(var(--text-primary))', margin: 0, fontWeight: 500 }}>
                        {task.description}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                        <Badge variant="navy">{task.project}</Badge>
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
          <Card className="p-6" style={{ borderLeft: '3px solid hsl(var(--status-error))' }}>
            <p style={{ fontSize: 13, color: 'hsl(var(--status-error))', margin: 0 }}>
              Failed to parse: {(submitMutation.error as Error).message}
            </p>
          </Card>
        )}

        {/* History */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Clock size={15} style={{ color: 'hsl(var(--text-tertiary))' }} />
            <span className="text-section-header">History</span>
          </div>

          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[0, 1, 2].map(i => (
                <Card key={i} className="p-6" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <SkeletonBlock width="80%" height={14} />
                  <SkeletonBlock width="40%" height={12} />
                </Card>
              ))}
            </div>
          ) : (dumps ?? []).length === 0 ? (
            <Card className="p-6" style={{ textAlign: 'center', padding: '32px 24px' }}>
              <p className="text-caption">No brain dumps yet. Start typing above.</p>
            </Card>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(dumps ?? []).map((dump) => {
                const isExpanded = expandedId === dump.id
                return (
                  <motion.div
                    key={dump.id}
                    layout
                    onClick={() => setExpandedId(isExpanded ? null : dump.id)}
                  >
                  <Card className="px-5 py-3.5 transition-shadow hover:shadow-card-hover cursor-pointer">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                        {isExpanded ? <ChevronDown size={14} style={{ color: 'hsl(var(--text-tertiary))', flexShrink: 0 }} /> : <ChevronRight size={14} style={{ color: 'hsl(var(--text-tertiary))', flexShrink: 0 }} />}
                        <p style={{
                          fontSize: 13,
                          color: 'hsl(var(--text-primary))',
                          margin: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: isExpanded ? 'normal' : 'nowrap',
                        }}>
                          {dump.raw_text}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, marginLeft: 12 }}>
                        <Badge variant={dump.status === 'processed' ? 'success' : dump.status === 'pending' ? 'warning' : 'neutral'}>
                          {dump.status}
                        </Badge>
                        <span className="text-caption">{formatRelativeTime(dump.created_at)}</span>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && dump.parsed_output && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid hsl(var(--border-subtle))' }}>
                            <p className="text-body" style={{ marginBottom: 10 }}>
                              {dump.parsed_output.summary}
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                              {dump.parsed_output.tasks.map((task, idx) => (
                                <div
                                  key={idx}
                                  style={{
                                    padding: '8px 12px',
                                    borderRadius: 6,
                                    backgroundColor: 'hsl(var(--bg-elevated))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 8,
                                  }}
                                >
                                  <span style={{ fontSize: 12, color: 'hsl(var(--text-primary))' }}>{task.description}</span>
                                  <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                                    <Badge variant="navy">{task.project}</Badge>
                                    <Badge variant={task.priority === 'high' ? 'coral' : 'neutral'}>{task.priority}</Badge>
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
          )}
        </div>
      </div>
    </PageShell>
  )
}
