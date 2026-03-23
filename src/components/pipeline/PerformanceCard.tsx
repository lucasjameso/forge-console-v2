import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useContentPerformance, useUpsertPerformance } from '@/hooks/useContentPerformance'
import { BarChart3, Pencil } from 'lucide-react'
import { SkeletonBlock } from '@/components/ui/SkeletonBlock'

interface PerformanceCardProps {
  contentId: string
}

interface FormData {
  impressions: string
  likes: string
  comments: string
  shares: string
  engagement_rate: string
}

const defaultForm: FormData = {
  impressions: '',
  likes: '',
  comments: '',
  shares: '',
  engagement_rate: '',
}

export function PerformanceCard({ contentId }: PerformanceCardProps) {
  const { data: performance, isLoading } = useContentPerformance(contentId)
  const upsertPerformance = useUpsertPerformance()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<FormData>(defaultForm)

  if (isLoading) return <SkeletonBlock className="h-32" />

  const handleEdit = () => {
    if (performance) {
      setForm({
        impressions: String(performance.impressions),
        likes: String(performance.likes),
        comments: String(performance.comments),
        shares: String(performance.shares),
        engagement_rate: String(performance.engagement_rate),
      })
    }
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    upsertPerformance.mutate(
      {
        content_id: contentId,
        impressions: Number(form.impressions) || 0,
        likes: Number(form.likes) || 0,
        comments: Number(form.comments) || 0,
        shares: Number(form.shares) || 0,
        engagement_rate: Number(form.engagement_rate) || 0,
        click_through_rate: 0,
      },
      {
        onSuccess: () => setShowForm(false),
      },
    )
  }

  const updateField = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  // Show form for adding or editing
  if (showForm || !performance) {
    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        {!performance && !showForm && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowForm(true)}
          >
            <BarChart3 className="w-3.5 h-3.5 mr-1.5" />
            Add Performance Metrics
          </Button>
        )}
        {(showForm || performance) && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[hsl(var(--text-tertiary))] mb-1">
                  Impressions
                </label>
                <Input
                  type="number"
                  min={0}
                  value={form.impressions}
                  onChange={(e) => updateField('impressions', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[hsl(var(--text-tertiary))] mb-1">
                  Likes
                </label>
                <Input
                  type="number"
                  min={0}
                  value={form.likes}
                  onChange={(e) => updateField('likes', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[hsl(var(--text-tertiary))] mb-1">
                  Comments
                </label>
                <Input
                  type="number"
                  min={0}
                  value={form.comments}
                  onChange={(e) => updateField('comments', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[hsl(var(--text-tertiary))] mb-1">
                  Shares
                </label>
                <Input
                  type="number"
                  min={0}
                  value={form.shares}
                  onChange={(e) => updateField('shares', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-[hsl(var(--text-tertiary))] mb-1">
                  Engagement Rate (%)
                </label>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  value={form.engagement_rate}
                  onChange={(e) => updateField('engagement_rate', e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={upsertPerformance.isPending}>
                Save Metrics
              </Button>
              {performance && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              )}
            </div>
          </>
        )}
      </form>
    )
  }

  // Display mode: compact stat grid
  const stats = [
    { label: 'Impressions', value: performance.impressions.toLocaleString() },
    { label: 'Likes', value: performance.likes.toLocaleString() },
    { label: 'Comments', value: performance.comments.toLocaleString() },
    { label: 'Shares', value: performance.shares.toLocaleString() },
    { label: 'Engagement', value: `${performance.engagement_rate.toFixed(1)}%` },
    { label: 'CTR', value: `${performance.click_through_rate.toFixed(1)}%` },
  ]

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-2.5 bg-[hsl(var(--bg-elevated))] rounded-[var(--radius-sm)] text-center"
          >
            <div className="text-lg font-semibold text-[hsl(var(--text-primary))]">
              {stat.value}
            </div>
            <div className="text-[10px] uppercase tracking-wide text-[hsl(var(--text-tertiary))]">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
      <Button variant="ghost" size="sm" onClick={handleEdit}>
        <Pencil className="w-3 h-3 mr-1" /> Edit
      </Button>
    </div>
  )
}
