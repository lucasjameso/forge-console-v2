import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SkeletonBlock } from '@/components/ui/SkeletonBlock'
import { useAiRefinement } from '@/hooks/useAiRefinement'
import { Sparkles, Hash, Copy, X, Check } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { AiSuggestion, AiRefinementResult } from '@/types/database'

interface AiRefinementPanelProps {
  caption: string
  onApplySuggestion: (original: string, revised: string) => void
}

const suggestionTypeColors: Record<AiSuggestion['type'], string> = {
  tighten: 'bg-blue-100 text-blue-800',
  strengthen: 'bg-emerald-100 text-emerald-800',
  cut: 'bg-red-100 text-red-800',
  restructure: 'bg-purple-100 text-purple-800',
  cta: 'bg-amber-100 text-amber-800',
}

export function AiRefinementPanel({ caption, onApplySuggestion }: AiRefinementPanelProps) {
  const refinement = useAiRefinement()
  const [suggestions, setSuggestions] = useState<AiSuggestion[]>([])
  const [rangeWarning, setRangeWarning] = useState<string | null>(null)
  const [hashtags, setHashtags] = useState<string[]>([])
  const [mode, setMode] = useState<'idle' | 'refine' | 'hashtags'>('idle')

  const handleRefine = () => {
    setMode('refine')
    setHashtags([])
    refinement.mutate(
      { caption, action: 'refine' },
      {
        onSuccess: (data) => {
          const result = data as AiRefinementResult
          setSuggestions(result.suggestions ?? [])
          if (!result.in_range && result.range_note) {
            setRangeWarning(result.range_note)
          } else {
            setRangeWarning(null)
          }
        },
      },
    )
  }

  const handleHashtags = () => {
    setMode('hashtags')
    setSuggestions([])
    setRangeWarning(null)
    refinement.mutate(
      { caption, action: 'hashtags' },
      {
        onSuccess: (data) => {
          const result = data as { hashtags: string[] }
          setHashtags(result.hashtags ?? [])
        },
      },
    )
  }

  const dismissSuggestion = (idx: number) => {
    setSuggestions((prev) => prev.filter((_, i) => i !== idx))
  }

  const copyHashtag = async (tag: string) => {
    try {
      await navigator.clipboard.writeText(tag)
      toast.success(`Copied ${tag}`)
    } catch {
      toast.error('Failed to copy')
    }
  }

  const copyAllHashtags = async () => {
    try {
      await navigator.clipboard.writeText(hashtags.join(' '))
      toast.success('All hashtags copied')
    } catch {
      toast.error('Failed to copy')
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefine}
          disabled={refinement.isPending || !caption}
        >
          <Sparkles className="w-3.5 h-3.5 mr-1.5" />
          Refine Caption
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleHashtags}
          disabled={refinement.isPending || !caption}
        >
          <Hash className="w-3.5 h-3.5 mr-1.5" />
          Suggest Hashtags
        </Button>
      </div>

      {/* Loading state */}
      {refinement.isPending && (
        <div className="space-y-2">
          <span className="text-xs text-[hsl(var(--text-tertiary))]">
            {mode === 'refine' ? 'Analyzing caption...' : 'Finding hashtags...'}
          </span>
          <SkeletonBlock className="h-24" />
        </div>
      )}

      {/* Range warning */}
      {rangeWarning && (
        <div className="p-3 bg-[hsl(var(--status-warning)/0.1)] border border-[hsl(var(--status-warning)/0.3)] rounded-[var(--radius-md)] text-sm text-[hsl(var(--status-warning))]">
          {rangeWarning}
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-3">
          {suggestions.map((suggestion, idx) => (
            <div
              key={`${suggestion.type}-${idx}`}
              className="border border-[hsl(var(--border-subtle))] rounded-[var(--radius-md)] p-3 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className={cn('text-[10px] uppercase', suggestionTypeColors[suggestion.type])}>
                    {suggestion.type}
                  </Badge>
                  <span className="text-sm text-[hsl(var(--text-secondary))]">
                    {suggestion.description}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  onClick={() => dismissSuggestion(idx)}
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="p-2 rounded-[var(--radius-sm)] bg-[hsl(var(--status-error)/0.08)]">
                  <span className="block text-[10px] uppercase tracking-wide text-[hsl(var(--text-tertiary))] mb-1">
                    Original
                  </span>
                  {suggestion.original}
                </div>
                <div className="p-2 rounded-[var(--radius-sm)] bg-[hsl(var(--status-success)/0.08)]">
                  <span className="block text-[10px] uppercase tracking-wide text-[hsl(var(--text-tertiary))] mb-1">
                    Revised
                  </span>
                  {suggestion.revised}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onApplySuggestion(suggestion.original, suggestion.revised)
                    dismissSuggestion(idx)
                  }}
                >
                  <Check className="w-3.5 h-3.5 mr-1" /> Apply
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dismissSuggestion(idx)}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hashtags */}
      {hashtags.length > 0 && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {hashtags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="cursor-pointer hover:bg-[hsl(var(--bg-elevated))] transition-colors"
                onClick={() => void copyHashtag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={() => void copyAllHashtags()}>
            <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy All
          </Button>
        </div>
      )}
    </div>
  )
}
