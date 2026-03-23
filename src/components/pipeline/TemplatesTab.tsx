import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Layers,
  Plus,
  Trash2,
  Pencil,
  Check,
  X,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import { format, startOfWeek, addWeeks, subWeeks, addDays, parseISO } from 'date-fns'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  useContentTemplates,
  useCreateTemplate,
  useUpdateTemplate,
  useDeleteTemplate,
  useGenerateWeek,
} from '@/hooks/useContentTemplates'
import { useContentReviews } from '@/hooks/useContentReviews'
import type { ContentTemplate, ContentType } from '@/types/database'

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const DAY_COLORS: Record<number, string> = {
  0: 'border-l-blue-400',
  1: 'border-l-emerald-400',
  2: 'border-l-violet-400',
  3: 'border-l-amber-400',
  4: 'border-l-rose-400',
  5: 'border-l-cyan-400',
  6: 'border-l-gray-300',
}

const CONTENT_TYPE_OPTIONS: { value: ContentType; label: string }[] = [
  { value: 'text', label: 'Text Post' },
  { value: 'carousel', label: 'Carousel' },
  { value: 'poll', label: 'Poll' },
  { value: 'visual_quote', label: 'Visual Quote' },
]

const PLATFORM_OPTIONS = ['linkedin', 'facebook', 'x', 'instagram', 'tiktok']

function platformDisplayName(p: string): string {
  if (p === 'x') return 'X/Twitter'
  return p.charAt(0).toUpperCase() + p.slice(1)
}

// ---- Template Row ----
function TemplateRow({
  template,
  onUpdate,
  onDelete,
}: {
  template: ContentTemplate
  onUpdate: (updates: Partial<ContentTemplate> & { id: string }) => void
  onDelete: (id: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [editState, setEditState] = useState({
    title_pattern: template.title_pattern,
    default_caption: template.default_caption ?? '',
    content_type: template.content_type,
    platform: template.platform,
    target_char_min: template.target_char_min,
    target_char_max: template.target_char_max,
    suggested_slide_count: template.suggested_slide_count,
    series: template.series ?? '',
  })

  const handleSaveEdit = () => {
    onUpdate({
      id: template.id,
      title_pattern: editState.title_pattern,
      default_caption: editState.default_caption || null,
      content_type: editState.content_type,
      platform: editState.platform,
      target_char_min: editState.target_char_min,
      target_char_max: editState.target_char_max,
      suggested_slide_count: editState.suggested_slide_count,
      series: editState.series || null,
    })
    setEditing(false)
  }

  const handleCancelEdit = () => {
    setEditState({
      title_pattern: template.title_pattern,
      default_caption: template.default_caption ?? '',
      content_type: template.content_type,
      platform: template.platform,
      target_char_min: template.target_char_min,
      target_char_max: template.target_char_max,
      suggested_slide_count: template.suggested_slide_count,
      series: template.series ?? '',
    })
    setEditing(false)
  }

  const handleTitleBlur = (value: string) => {
    if (value !== template.title_pattern) {
      onUpdate({ id: template.id, title_pattern: value })
    }
  }

  const handleToggleActive = (checked: boolean) => {
    onUpdate({ id: template.id, is_active: checked })
  }

  const handleDelete = () => {
    if (window.confirm(`Delete template for ${DAY_NAMES[template.day_of_week]}?`)) {
      onDelete(template.id)
    }
  }

  return (
    <Card
      className={cn(
        'border-l-4 p-4 transition-opacity',
        DAY_COLORS[template.day_of_week] ?? 'border-l-gray-300',
        !template.is_active && 'opacity-50'
      )}
    >
      {/* Main row */}
      <div className="flex items-center gap-3">
        <div className="w-20 shrink-0">
          <span className="text-sm font-semibold text-[hsl(var(--text-primary))]">
            {DAY_NAMES[template.day_of_week]}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <input
            type="text"
            className="w-full bg-transparent text-sm text-[hsl(var(--text-primary))] outline-none border-b border-transparent focus:border-[hsl(var(--border-default))] transition-colors px-1 py-0.5"
            defaultValue={template.title_pattern}
            onBlur={(e) => handleTitleBlur(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="outline" className="text-[10px] capitalize">
            {template.content_type.replace('_', ' ')}
          </Badge>
          <Badge variant="outline" className="text-[10px] capitalize">
            {platformDisplayName(template.platform)}
          </Badge>
          {template.content_type === 'carousel' && template.suggested_slide_count > 0 && (
            <span className="flex items-center gap-0.5 text-xs text-[hsl(var(--text-secondary))]">
              <Layers size={11} />
              {template.suggested_slide_count} slides
            </span>
          )}
          <Switch
            checked={template.is_active}
            onCheckedChange={handleToggleActive}
          />
          <button
            onClick={() => setEditing(!editing)}
            className="h-7 w-7 flex items-center justify-center rounded-[var(--radius-sm)] hover:bg-[hsl(var(--bg-elevated))] transition-colors"
            title="Edit template"
          >
            <Pencil size={13} className="text-[hsl(var(--text-tertiary))]" />
          </button>
          <button
            onClick={handleDelete}
            className="h-7 w-7 flex items-center justify-center rounded-[var(--radius-sm)] hover:bg-[hsl(var(--status-error)/0.1)] transition-colors"
            title="Delete template"
          >
            <Trash2 size={13} className="text-[hsl(var(--text-tertiary))]" />
          </button>
        </div>
      </div>

      {/* Expanded edit form */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-[hsl(var(--border-subtle))] flex flex-col gap-3">
              {/* Title pattern */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-wide text-[hsl(var(--text-tertiary))] mb-1">Title Pattern</label>
                <input
                  type="text"
                  className="w-full rounded-[var(--radius-md)] border border-input bg-card px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-coral focus:ring-2 focus:ring-coral/10"
                  value={editState.title_pattern}
                  onChange={(e) => setEditState((s) => ({ ...s, title_pattern: e.target.value }))}
                />
              </div>

              {/* Default caption */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-wide text-[hsl(var(--text-tertiary))] mb-1">Default Caption</label>
                <textarea
                  rows={4}
                  className="w-full resize-y rounded-[var(--radius-md)] border border-input bg-card px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-coral focus:ring-2 focus:ring-coral/10 font-[inherit]"
                  value={editState.default_caption}
                  onChange={(e) => setEditState((s) => ({ ...s, default_caption: e.target.value }))}
                />
              </div>

              {/* Type + Platform */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wide text-[hsl(var(--text-tertiary))] mb-1">Content Type</label>
                  <Select
                    value={editState.content_type}
                    onValueChange={(v: ContentType) => setEditState((s) => ({ ...s, content_type: v }))}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CONTENT_TYPE_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wide text-[hsl(var(--text-tertiary))] mb-1">Platform</label>
                  <Select
                    value={editState.platform}
                    onValueChange={(v) => setEditState((s) => ({ ...s, platform: v }))}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PLATFORM_OPTIONS.map((p) => (
                        <SelectItem key={p} value={p}>{platformDisplayName(p)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Char limits + slide count */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wide text-[hsl(var(--text-tertiary))] mb-1">Min Characters</label>
                  <input
                    type="number"
                    className="w-full rounded-[var(--radius-md)] border border-input bg-card px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-coral focus:ring-2 focus:ring-coral/10"
                    value={editState.target_char_min}
                    onChange={(e) => setEditState((s) => ({ ...s, target_char_min: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wide text-[hsl(var(--text-tertiary))] mb-1">Max Characters</label>
                  <input
                    type="number"
                    className="w-full rounded-[var(--radius-md)] border border-input bg-card px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-coral focus:ring-2 focus:ring-coral/10"
                    value={editState.target_char_max}
                    onChange={(e) => setEditState((s) => ({ ...s, target_char_max: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wide text-[hsl(var(--text-tertiary))] mb-1">Slide Count</label>
                  <input
                    type="number"
                    className="w-full rounded-[var(--radius-md)] border border-input bg-card px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-coral focus:ring-2 focus:ring-coral/10"
                    value={editState.suggested_slide_count}
                    onChange={(e) => setEditState((s) => ({ ...s, suggested_slide_count: Number(e.target.value) }))}
                  />
                </div>
              </div>

              {/* Series */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-wide text-[hsl(var(--text-tertiary))] mb-1">Series</label>
                <input
                  type="text"
                  className="w-full rounded-[var(--radius-md)] border border-input bg-card px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-coral focus:ring-2 focus:ring-coral/10 placeholder:text-muted-foreground"
                  placeholder="e.g., Weekly Arc, CLARITY Launch"
                  value={editState.series}
                  onChange={(e) => setEditState((s) => ({ ...s, series: e.target.value }))}
                />
              </div>

              {/* Save / Cancel */}
              <div className="flex items-center gap-2 justify-end">
                <Button variant="ghost" size="sm" onClick={handleCancelEdit} className="gap-1">
                  <X size={13} /> Cancel
                </Button>
                <Button size="sm" onClick={handleSaveEdit} className="gap-1 bg-[hsl(var(--accent-coral))] hover:bg-[hsl(var(--accent-coral-hover))] text-white">
                  <Check size={13} /> Save
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

// ---- Sunday Rest Row ----
function SundayRestRow() {
  return (
    <Card className="border-l-4 border-l-gray-300 p-4 opacity-50">
      <div className="flex items-center gap-3">
        <div className="w-20 shrink-0">
          <span className="text-sm font-semibold text-[hsl(var(--text-primary))]">Sunday</span>
        </div>
        <span className="text-sm italic text-[hsl(var(--text-tertiary))]">
          Rest day -- no template
        </span>
      </div>
    </Card>
  )
}

// ---- Generate Week Section ----
function GenerateWeekSection({
  templates,
}: {
  templates: ContentTemplate[]
}) {
  const [selectedWeek, setSelectedWeek] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  )
  const [generatedCount, setGeneratedCount] = useState<number | null>(null)
  const generateWeek = useGenerateWeek()
  const { data: reviews } = useContentReviews()

  const activeTemplates = templates.filter((t) => t.is_active)

  // Count existing content for the selected week
  const existingDayCount = useMemo(() => {
    if (!reviews) return 0
    const weekStart = selectedWeek
    const weekEnd = addDays(weekStart, 6)
    return reviews.filter((r) => {
      if (!r.scheduled_date) return false
      const d = parseISO(r.scheduled_date)
      return d >= weekStart && d <= weekEnd
    }).length
  }, [reviews, selectedWeek])

  const handleGenerate = () => {
    generateWeek.mutate(
      {
        templates: activeTemplates,
        weekStartDate: format(selectedWeek, 'yyyy-MM-dd'),
      },
      {
        onSuccess: (count) => {
          setGeneratedCount(count ?? activeTemplates.length)
        },
      }
    )
  }

  return (
    <Card className="p-5 flex flex-col gap-4 h-fit sticky top-4">
      <h3 className="text-base font-semibold text-[hsl(var(--text-primary))] flex items-center gap-2">
        <Sparkles size={16} className="text-[hsl(var(--accent-coral))]" />
        Generate Content Week
      </h3>

      {/* Week picker */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => setSelectedWeek((w) => subWeeks(w, 1))}
        >
          <ChevronLeft size={14} />
        </Button>
        <span className="text-sm font-medium text-[hsl(var(--text-primary))] flex-1 text-center">
          Week of {format(selectedWeek, 'MMM d, yyyy')}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => setSelectedWeek((w) => addWeeks(w, 1))}
        >
          <ChevronRight size={14} />
        </Button>
      </div>

      {/* Preview */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium uppercase tracking-wide text-[hsl(var(--text-tertiary))]">
          Will generate {activeTemplates.length} items:
        </span>
        {activeTemplates.length === 0 ? (
          <p className="text-sm text-[hsl(var(--text-secondary))] italic">No active templates</p>
        ) : (
          activeTemplates.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-2 text-sm text-[hsl(var(--text-secondary))] py-0.5"
            >
              <span className="w-16 text-xs font-medium text-[hsl(var(--text-tertiary))]">
                {DAY_NAMES[t.day_of_week]?.slice(0, 3)}
              </span>
              <span className="truncate">{t.title_pattern}</span>
            </div>
          ))
        )}
      </div>

      {/* Warning for existing content */}
      {existingDayCount > 0 && (
        <p className="text-xs text-[hsl(var(--status-warning))] bg-[hsl(var(--status-warning)/0.08)] rounded-[var(--radius-sm)] px-3 py-2">
          Note: {existingDayCount} day{existingDayCount !== 1 ? 's' : ''} already{' '}
          {existingDayCount !== 1 ? 'have' : 'has'} scheduled content
        </p>
      )}

      {/* Generate button */}
      <Button
        onClick={handleGenerate}
        disabled={generateWeek.isPending || activeTemplates.length === 0}
        className="bg-[hsl(var(--accent-coral))] hover:bg-[hsl(var(--accent-coral-hover))] text-white gap-1.5 w-full"
      >
        <Sparkles size={14} />
        {generateWeek.isPending ? 'Generating...' : 'Generate Week'}
      </Button>

      {/* Success message */}
      <AnimatePresence>
        {generatedCount !== null && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-1 text-sm text-[hsl(var(--status-success))] bg-[hsl(var(--status-success)/0.08)] rounded-[var(--radius-md)] px-3 py-2"
          >
            <span>Successfully generated {generatedCount} content items!</span>
            <button
              onClick={() => setGeneratedCount(null)}
              className="text-xs text-[hsl(var(--accent-coral))] hover:underline flex items-center gap-1 self-start mt-0.5"
            >
              Switch to Month view <ArrowRight size={11} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

// ---- Main TemplatesTab ----
export function TemplatesTab() {
  const { data: templates, isLoading } = useContentTemplates()
  const createTemplate = useCreateTemplate()
  const updateTemplate = useUpdateTemplate()
  const deleteTemplate = useDeleteTemplate()

  const sorted = useMemo(() => {
    if (!templates) return []
    return [...templates].sort((a, b) => a.day_of_week - b.day_of_week)
  }, [templates])

  // Check if Sunday has a template
  const hasSundayTemplate = sorted.some((t) => t.day_of_week === 6)

  const handleUpdate = (updates: Partial<ContentTemplate> & { id: string }) => {
    updateTemplate.mutate(updates)
  }

  const handleDelete = (id: string) => {
    deleteTemplate.mutate(id)
  }

  const handleAddTemplate = () => {
    const usedDays = new Set(sorted.map((t) => t.day_of_week))
    let nextDay = 0
    while (usedDays.has(nextDay) && nextDay < 6) nextDay++
    if (nextDay >= 6) nextDay = 0

    createTemplate.mutate({
      day_of_week: nextDay,
      title_pattern: `New Template: [Topic]`,
      default_caption: null,
      content_type: 'text',
      platform: 'linkedin',
      target_char_min: 1200,
      target_char_max: 1600,
      suggested_slide_count: 0,
      series: null,
      sort_order: sorted.length,
      is_active: true,
    })
  }

  if (isLoading) {
    return (
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="p-4 h-16 animate-pulse bg-[hsl(var(--bg-elevated))]" />
          ))}
        </div>
        <Card className="p-5 h-64 animate-pulse bg-[hsl(var(--bg-elevated))]" />
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Left: Template List */}
      <div className="flex flex-col gap-3">
        <h3 className="text-base font-semibold text-[hsl(var(--text-primary))]">
          Weekly Arc Templates
        </h3>

        {sorted.map((template, idx) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.04 }}
          >
            <TemplateRow
              template={template}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          </motion.div>
        ))}

        {/* Sunday rest row if no Sunday template */}
        {!hasSundayTemplate && <SundayRestRow />}

        {/* Add template button */}
        <Button
          variant="outline"
          onClick={handleAddTemplate}
          disabled={createTemplate.isPending}
          className="gap-1.5 self-start"
        >
          <Plus size={14} />
          Add Template
        </Button>
      </div>

      {/* Right: Generate Week */}
      <GenerateWeekSection templates={sorted} />
    </div>
  )
}
