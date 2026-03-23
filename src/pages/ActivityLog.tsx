import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Filter,
  Code2,
  Zap,
  MessageSquare,
  Settings,
  PenLine,
  Users,
  ChevronDown,
  X,
} from 'lucide-react'
import { format, subDays, startOfDay, isToday, isYesterday, isAfter } from 'date-fns'
import { PageShell } from '@/components/layout/PageShell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ProjectBadge } from '@/components/ui/ProjectBadge'
import { SkeletonBlock } from '@/components/ui/SkeletonBlock'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useActivityLog } from '@/hooks/useActivityLog'
import { useProjects } from '@/hooks/useProjects'
import { useDebounce } from '@/hooks/useDebounce'
import {
  formatRelativeTime,
  formatTime,
  groupByDay,
  cn,
} from '@/lib/utils'
import { getToolColor, getProjectColorVar } from '@/lib/colors'
import type { SessionType, ActivityEntry } from '@/types/database'

// ---------- constants ----------

const sessionTypes: { key: SessionType | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'claude_code', label: 'Claude Code' },
  { key: 'n8n', label: 'n8n' },
  { key: 'slack', label: 'Slack' },
  { key: 'system', label: 'System' },
  { key: 'manual', label: 'Manual' },
  { key: 'cowork', label: 'Cowork' },
]

const TOOL_ICONS: Record<string, React.ElementType> = {
  'Claude Code': Code2,
  n8n: Zap,
  Slack: MessageSquare,
  System: Settings,
  Manual: PenLine,
  Cowork: Users,
}

const datePresets = [
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'Last 7d', value: '7d' },
  { label: 'Last 30d', value: '30d' },
  { label: 'All', value: 'all' },
]

// ---------- helpers ----------

type EntryTier = 'major' | 'standard' | 'background'

function getEntryTier(entry: ActivityEntry): EntryTier {
  const s = entry.summary.toLowerCase()
  if (
    (entry.session_type === 'system' &&
      /phase|deploy|milestone|complete/i.test(s)) ||
    /phase\s+\d+\s+complete|deployed|milestone\s+reached/i.test(s)
  ) {
    return 'major'
  }
  if (/health|ping|check|heartbeat/i.test(s)) {
    return 'background'
  }
  return 'standard'
}

function isSignificantEvent(entry: ActivityEntry): boolean {
  return /phase|deploy|milestone/i.test(entry.summary)
}

function boldFirstPhrase(text: string): { bold: string; rest: string } {
  const match = text.match(/^([^.!?\-]+[.!?\-])(.*)$/)
  if (match) return { bold: match[1].trim(), rest: match[2].trim() }
  return { bold: text, rest: '' }
}

function filterByDateRange(entries: ActivityEntry[], range: string): ActivityEntry[] {
  if (range === 'all') return entries
  return entries.filter(entry => {
    const entryDate = new Date(entry.created_at)
    switch (range) {
      case 'today': return isToday(entryDate)
      case 'yesterday': return isYesterday(entryDate)
      case '7d': return isAfter(entryDate, subDays(startOfDay(new Date()), 7))
      case '30d': return isAfter(entryDate, subDays(startOfDay(new Date()), 30))
      default: return true
    }
  })
}

// ---------- component ----------

export function ActivityLog() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [projectFilter, setProjectFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState<SessionType | 'all'>('all')
  const [dateRange, setDateRange] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [expandedEntries] = useState<Set<string>>(new Set())
  const [showLogForm, setShowLogForm] = useState(false)
  const [logSummary, setLogSummary] = useState('')
  const [logProject, setLogProject] = useState('')
  const [logTool, setLogTool] = useState('manual')
  const [logEventType, setLogEventType] = useState('note')
  const [logLinkUrl, setLogLinkUrl] = useState('')

  const debouncedSearch = useDebounce(searchQuery, 300)

  const { data: projects } = useProjects()
  const { data: rawEntries, isLoading } = useActivityLog({
    project: projectFilter !== 'all' ? projectFilter : undefined,
    sessionType: typeFilter !== 'all' ? (typeFilter as SessionType) : undefined,
  })

  // --- client-side search + date filter ---
  const filteredEntries = useMemo(() => {
    if (!rawEntries) return []
    let results = rawEntries
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase()
      results = results.filter((e) => e.summary.toLowerCase().includes(q))
    }
    results = filterByDateRange(results, dateRange)
    return results
  }, [rawEntries, debouncedSearch, dateRange])

  // --- pagination ---
  const PAGE_SIZE = 20
  const paginatedEntries = useMemo(
    () => filteredEntries.slice(0, page * PAGE_SIZE),
    [filteredEntries, page],
  )
  const hasMore = paginatedEntries.length < filteredEntries.length

  // --- day groups ---
  const dayGroups = useMemo(
    () => groupByDay(paginatedEntries),
    [paginatedEntries],
  )

  // --- 14-day density chart ---
  const densityData = useMemo(() => {
    if (!rawEntries) return []
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    const days: {
      date: Date
      label: string
      projectCounts: { slug: string; count: number }[]
      total: number
    }[] = []

    for (let i = 13; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const dateStr = format(d, 'yyyy-MM-dd')
      const dayEntries = rawEntries.filter(
        (e) => format(new Date(e.created_at), 'yyyy-MM-dd') === dateStr,
      )
      const slugMap = new Map<string, number>()
      for (const e of dayEntries) {
        const slug = e.project ?? 'system'
        slugMap.set(slug, (slugMap.get(slug) ?? 0) + 1)
      }
      const projectCounts = Array.from(slugMap.entries()).map(([slug, count]) => ({
        slug,
        count,
      }))
      days.push({
        date: d,
        label: format(d, 'EEE'),
        projectCounts,
        total: dayEntries.length,
      })
    }
    return days
  }, [rawEntries])

  const maxDayCount = useMemo(
    () => Math.max(1, ...densityData.map((d) => d.total)),
    [densityData],
  )

  // --- tool type counts for filter chips ---
  const toolCounts = useMemo(() => {
    if (!rawEntries) return new Map<string, number>()
    const counts = new Map<string, number>()
    for (const e of rawEntries) {
      counts.set(e.session_type, (counts.get(e.session_type) ?? 0) + 1)
    }
    return counts
  }, [rawEntries])

  const handleEntryClick = (entry: ActivityEntry) => {
    if (entry.project) {
      navigate(`/projects/${entry.project}`)
    }
  }

  const handleLogSubmit = () => {
    // In a real implementation, this would call a mutation
    setShowLogForm(false)
    setLogSummary('')
    setLogProject('')
    setLogTool('manual')
    setLogEventType('note')
    setLogLinkUrl('')
  }

  return (
    <TooltipProvider>
      <PageShell
        title="Activity Log"
        subtitle="Every action across your entire system."
      >
        <div className="flex flex-col gap-5">
          {/* Filters + search */}
          <Card className="px-5 py-3.5">
            <div className="flex flex-col gap-3">
              {/* Top row: search + log button */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Search
                    size={14}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[hsl(var(--text-tertiary))]"
                  />
                  <Input
                    placeholder="Search activities..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setPage(1)
                    }}
                    className="pl-8 h-8 text-sm"
                  />
                  {searchQuery && searchQuery !== debouncedSearch && (
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[hsl(var(--accent-coral))] animate-pulse" />
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLogForm((v) => !v)}
                >
                  <PenLine className="w-4 h-4 mr-1.5" />
                  Log activity
                </Button>
              </div>

              {/* Search result count */}
              {debouncedSearch && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[hsl(var(--text-tertiary))]">
                    {filteredEntries.length} results for &quot;{debouncedSearch}&quot;
                  </span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-[hsl(var(--text-tertiary))] hover:text-[hsl(var(--text-primary))] transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}

              {/* Filter chips */}
              <div className="flex items-center gap-4 flex-wrap">
                {/* Project filters */}
                <div className="flex items-center gap-2">
                  <Filter
                    size={13}
                    className="text-[hsl(var(--text-tertiary))]"
                  />
                  <div className="flex flex-wrap gap-2">
                    <FilterChip
                      label="All Projects"
                      active={projectFilter === 'all'}
                      onClick={() => {
                        setProjectFilter('all')
                        setPage(1)
                      }}
                    />
                    {(projects ?? []).map((p) => (
                      <FilterChip
                        key={p.slug}
                        label={p.name.split(' ')[0]}
                        active={projectFilter === p.slug}
                        onClick={() => {
                          setProjectFilter(p.slug)
                          setPage(1)
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="w-px h-4 bg-[hsl(var(--border-subtle))]" />

                {/* Type filters */}
                <div className="flex flex-wrap gap-2">
                  {sessionTypes.map((st) => (
                    <FilterChip
                      key={st.key}
                      label={st.label}
                      active={typeFilter === st.key}
                      count={
                        st.key !== 'all'
                          ? toolCounts.get(st.key) ?? 0
                          : undefined
                      }
                      onClick={() => {
                        setTypeFilter(st.key as SessionType | 'all')
                        setPage(1)
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Date range presets */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {datePresets.map(preset => (
                    <button
                      key={preset.value}
                      onClick={() => { setDateRange(preset.value); setPage(1) }}
                      className={cn(
                        'px-2.5 py-1 text-xs rounded-md transition-colors',
                        dateRange === preset.value
                          ? 'bg-[hsl(var(--accent-coral))] text-white'
                          : 'bg-[hsl(var(--bg-elevated))] text-[hsl(var(--text-secondary))] hover:bg-[hsl(var(--bg-active))]'
                      )}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* Divider */}
                <div className="w-px h-4 bg-[hsl(var(--border-subtle))]" />

                {/* Timeline dot legend */}
                <div className="flex items-center gap-3 text-xs text-[hsl(var(--text-tertiary))]">
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[hsl(var(--accent-coral))]" />Claude Code</span>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[hsl(var(--status-success))]" />n8n</span>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[hsl(var(--status-warning))]" />Manual</span>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[hsl(var(--text-tertiary))]" />System</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Manual entry form */}
          <AnimatePresence>
            {showLogForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <Card className="px-5 py-4">
                  <div className="flex flex-col gap-3">
                    <p className="text-sm font-semibold text-[hsl(var(--text-primary))]">
                      Log a manual activity
                    </p>
                    <div className="flex gap-3 flex-wrap">
                      <select
                        value={logProject}
                        onChange={(e) => setLogProject(e.target.value)}
                        className="h-8 rounded-md border border-input bg-transparent px-3 text-sm text-foreground"
                      >
                        <option value="">Select project</option>
                        {(projects ?? []).map((p) => (
                          <option key={p.slug} value={p.slug}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                      <Select value={logTool} onValueChange={setLogTool}>
                        <SelectTrigger className="w-[140px] h-8 text-sm">
                          <SelectValue placeholder="Tool" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="claude_code">Claude Code</SelectItem>
                          <SelectItem value="n8n">n8n</SelectItem>
                          <SelectItem value="slack">Slack</SelectItem>
                          <SelectItem value="manual">Manual</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={logEventType} onValueChange={setLogEventType}>
                        <SelectTrigger className="w-[140px] h-8 text-sm">
                          <SelectValue placeholder="Event Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="milestone">Milestone</SelectItem>
                          <SelectItem value="commit">Commit</SelectItem>
                          <SelectItem value="approval">Approval</SelectItem>
                          <SelectItem value="note">Note</SelectItem>
                          <SelectItem value="health_check">Health Check</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Activity summary..."
                        value={logSummary}
                        onChange={(e) => setLogSummary(e.target.value)}
                        className="flex-1 min-w-[240px] h-8 text-sm"
                      />
                    </div>
                    <div className="flex gap-3 items-center">
                      <Input
                        placeholder="Link URL (optional)"
                        value={logLinkUrl}
                        onChange={(e) => setLogLinkUrl(e.target.value)}
                        className="flex-1 h-8 text-sm"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleLogSubmit}
                        disabled={!logSummary.trim()}
                      >
                        Save
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShowLogForm(false)
                          setLogSummary('')
                          setLogProject('')
                          setLogTool('manual')
                          setLogEventType('note')
                          setLogLinkUrl('')
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Activity density bar chart -- 14 days */}
          {!isLoading && densityData.length > 0 && (
            <Card className="px-5 py-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-[hsl(var(--text-secondary))]">
                  14-day activity
                </span>
                <span className="text-[13px] text-[hsl(var(--text-tertiary))]">
                  {filteredEntries.length} activities across all projects
                </span>
              </div>
              <div className="flex items-end gap-1 min-h-[140px]">
                {densityData.map((day) => (
                  <Tooltip key={day.label + day.date.toISOString()}>
                    <TooltipTrigger asChild>
                      <div className="flex-1 flex flex-col-reverse h-full min-h-[140px] cursor-default">
                        {day.total === 0 ? (
                          <div className="w-full h-[2px] rounded-full bg-[hsl(var(--border-subtle))]" />
                        ) : (
                          day.projectCounts.map(({ slug, count }) => (
                            <div
                              key={slug}
                              className="w-full rounded-t-sm min-h-[2px]"
                              style={{
                                height: `${(count / maxDayCount) * 100}%`,
                                backgroundColor: getProjectColorVar(slug),
                              }}
                            />
                          ))
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {format(day.date, 'MMM d')}: {day.total} entries
                        {day.projectCounts.length > 0 && (
                          <>
                            {' '}
                            (
                            {day.projectCounts
                              .map((pc) => `${pc.count} ${pc.slug}`)
                              .join(', ')}
                            )
                          </>
                        )}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
              <div className="flex gap-1 mt-1">
                {densityData.map((day) => (
                  <div
                    key={'lbl-' + day.date.toISOString()}
                    className="flex-1 text-center text-[10px] text-[hsl(var(--text-tertiary))]"
                  >
                    {day.label}
                  </div>
                ))}
              </div>
              {/* Project color legend */}
              <div className="flex items-center gap-4 mt-2 text-xs text-[hsl(var(--text-tertiary))]">
                <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--accent-coral))]" />Forge</span>
                <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--status-info))]" />Ridgeline</span>
                <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--status-success))]" />CLARITY</span>
                <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--text-tertiary))]" />System</span>
              </div>
            </Card>
          )}

          {/* Timeline */}
          {isLoading ? (
            <div className="flex flex-col gap-3">
              {[0, 1, 2, 3, 4].map((i) => (
                <Card
                  key={i}
                  className="px-5 py-3 flex items-center gap-3"
                >
                  <SkeletonBlock width={8} height={8} className="rounded-full" />
                  <SkeletonBlock width="60%" height={14} />
                  <div className="ml-auto">
                    <SkeletonBlock width={60} height={12} />
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredEntries.length === 0 ? (
            <Card className="p-12 text-center">
              {debouncedSearch ? (
                <div className="flex flex-col items-center gap-2">
                  <p className="text-sm text-[hsl(var(--text-secondary))]">
                    No activities matching &quot;{debouncedSearch}&quot;
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchQuery('')}
                  >
                    Clear search
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-[hsl(var(--text-secondary))]">
                  No activity matches your filters.
                </p>
              )}
            </Card>
          ) : (
            <div className="space-y-8">
              {dayGroups.map((group) => (
                <div key={group.label}>
                  {/* Day sticky header */}
                  <div className="sticky top-0 z-10 flex items-center justify-between bg-[hsl(var(--bg-root))] py-3 border-b border-[hsl(var(--border-subtle))]">
                    <span className="text-[15px] font-semibold text-[hsl(var(--text-primary))]">
                      {group.label}
                    </span>
                    <span className="text-xs text-[hsl(var(--text-tertiary))]">
                      {group.items.length}{' '}
                      {group.items.length === 1 ? 'entry' : 'entries'}
                    </span>
                  </div>

                  {/* Entries within day */}
                  <div className="relative ml-2 mt-2">
                    {/* Connecting vertical line */}
                    <div className="absolute left-[3px] top-2 bottom-2 w-px bg-[hsl(var(--border-subtle))]" />

                    {group.items.map((entry, idx) => {
                      const tier = getEntryTier(entry)
                      const significant = isSignificantEvent(entry)
                      const toolColorVar = getToolColor(
                        entry.tool ?? entry.session_type,
                      )
                      const isExpanded = expandedEntries.has(entry.id)
                      const { bold, rest } = boldFirstPhrase(entry.summary)
                      const ToolIcon =
                        TOOL_ICONS[entry.tool ?? ''] ?? Settings

                      return (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.2,
                            delay: idx * 0.03,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="relative flex items-start gap-3 py-1.5"
                        >
                          {/* Timeline dot */}
                          <div className="relative z-[1] flex-shrink-0 mt-2.5">
                            <div
                              className={cn(
                                'rounded-full',
                                significant
                                  ? 'w-2.5 h-2.5 ring-2'
                                  : 'w-2 h-2',
                              )}
                              style={{
                                backgroundColor: `hsl(var(--${toolColorVar}))`,
                                ...(significant
                                  ? {
                                      boxShadow: `0 0 0 3px hsl(var(--${toolColorVar}) / 0.2)`,
                                    }
                                  : {}),
                              }}
                            />
                          </div>

                          {/* Entry content */}
                          {tier === 'major' ? (
                            <div
                              className="flex-1 p-4 rounded-lg border border-[hsl(var(--border-subtle))] shadow-sm bg-[hsl(var(--bg-surface))] cursor-pointer hover:bg-[hsl(var(--bg-elevated))] transition-colors"
                              onClick={() => handleEntryClick(entry)}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  {/* Tool badge */}
                                  <Badge className="rounded-md bg-[hsl(var(--bg-elevated))] text-[hsl(var(--text-secondary))] text-xs px-2 py-0.5 border-transparent">
                                    <ToolIcon className="w-3 h-3 mr-1" />
                                    {entry.tool ?? entry.session_type}
                                  </Badge>
                                  {entry.project && (
                                    <ProjectBadge project={entry.project}>
                                      {entry.project}
                                    </ProjectBadge>
                                  )}
                                </div>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="text-xs text-[hsl(var(--text-tertiary))] flex-shrink-0">
                                      {formatRelativeTime(entry.created_at)}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {format(
                                      new Date(entry.created_at),
                                      'EEEE, MMMM d, yyyy h:mm a',
                                    )}
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                              <p
                                className={cn(
                                  'text-[15px] text-[hsl(var(--text-primary))] mt-2',
                                  !isExpanded && 'truncate',
                                )}
                              >
                                <span className="font-semibold">{bold}</span>
                                {rest && ` ${rest}`}
                              </p>
                            </div>
                          ) : tier === 'background' ? (
                            <div
                              className="flex-1 py-1.5 opacity-60 grid grid-cols-[auto_80px_1fr_80px] items-center gap-3 cursor-pointer hover:bg-[hsl(var(--bg-elevated))] transition-colors rounded px-3"
                              onClick={() => handleEntryClick(entry)}
                            >
                              <Badge className="rounded-md bg-[hsl(var(--bg-elevated))] text-[hsl(var(--text-secondary))] text-xs px-2 py-0.5 border-transparent">
                                <ToolIcon className="w-3 h-3 mr-1" />
                                {entry.tool ?? entry.session_type}
                              </Badge>
                              <span className="text-xs text-[hsl(var(--text-tertiary))] truncate">
                                {entry.project ?? ''}
                              </span>
                              <p
                                className={cn(
                                  'text-[13px] text-[hsl(var(--text-tertiary))]',
                                  !isExpanded && 'truncate',
                                )}
                              >
                                {entry.summary}
                              </p>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="text-[11px] text-[hsl(var(--text-tertiary))] justify-self-end flex-shrink-0">
                                    {formatTime(entry.created_at)}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {format(
                                    new Date(entry.created_at),
                                    'EEEE, MMMM d, yyyy h:mm a',
                                  )}
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          ) : (
                            /* standard tier */
                            <div
                              className="flex-1 grid grid-cols-[auto_80px_80px_1fr_100px] items-center gap-3 py-2 px-3 rounded-lg bg-[hsl(var(--bg-surface))] cursor-pointer hover:bg-[hsl(var(--bg-elevated))] transition-colors"
                              onClick={() => handleEntryClick(entry)}
                            >
                              {/* Tool badge */}
                              <Badge className="rounded-md bg-[hsl(var(--bg-elevated))] text-[hsl(var(--text-secondary))] text-xs px-2 py-0.5 border-transparent">
                                <ToolIcon className="w-3 h-3 mr-1" />
                                {entry.tool ?? entry.session_type}
                              </Badge>
                              {entry.project ? (
                                <ProjectBadge project={entry.project}>
                                  {entry.project}
                                </ProjectBadge>
                              ) : (
                                <span />
                              )}
                              <span className="text-xs text-[hsl(var(--text-tertiary))] truncate justify-self-start">
                                {entry.session_type}
                              </span>
                              <p
                                className={cn(
                                  'text-[14px] text-[hsl(var(--text-primary))] truncate',
                                )}
                              >
                                <span className="font-semibold">
                                  {bold}
                                </span>
                                {rest && ` ${rest}`}
                              </p>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="text-xs text-[hsl(var(--text-tertiary))] justify-self-end flex-shrink-0">
                                    {formatRelativeTime(entry.created_at)}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {format(
                                    new Date(entry.created_at),
                                    'EEEE, MMMM d, yyyy h:mm a',
                                  )}
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          )}
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              ))}

              {/* Load more */}
              {hasMore && (
                <div className="flex justify-center pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p + 1)}
                  >
                    <ChevronDown className="w-4 h-4 mr-1.5" />
                    Load more
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </PageShell>
    </TooltipProvider>
  )
}

// ---------- filter chip ----------

function FilterChip({
  label,
  active,
  count,
  onClick,
}: {
  label: string
  active: boolean
  count?: number
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'text-[11px] px-2.5 py-1 rounded-full border whitespace-nowrap transition-all duration-150',
        active
          ? 'bg-[hsl(var(--accent-coral))] text-white border-[hsl(var(--accent-coral))] font-semibold'
          : 'border-[hsl(var(--border-default))] text-[hsl(var(--text-tertiary))] bg-transparent hover:border-[hsl(var(--border-default))] hover:text-[hsl(var(--text-secondary))]',
      )}
    >
      {label}
      {count !== undefined && count > 0 && (
        <span className="ml-1 text-xs opacity-70">({count})</span>
      )}
    </button>
  )
}
