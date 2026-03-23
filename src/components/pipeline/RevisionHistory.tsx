import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useContentVersions, useRevertVersion } from '@/hooks/useContentVersions'
import { ChevronDown, ChevronUp, GitCompare, RotateCcw } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { diffWords } from 'diff'
import { cn } from '@/lib/utils'

interface RevisionHistoryProps {
  contentId: string
  currentCaption: string | null
}

export function RevisionHistory({ contentId, currentCaption }: RevisionHistoryProps) {
  const { data: versions = [] } = useContentVersions(contentId)
  const revertVersion = useRevertVersion()
  const [expanded, setExpanded] = useState(false)
  const [comparingId, setComparingId] = useState<string | null>(null)
  const [confirmRevertId, setConfirmRevertId] = useState<string | null>(null)

  if (versions.length === 0) {
    return (
      <div className="text-sm text-[hsl(var(--text-tertiary))]">
        No revision history yet
      </div>
    )
  }

  const maxRevision = Math.max(...versions.map((v) => v.revision))

  return (
    <div className="border border-[hsl(var(--border-subtle))] rounded-[var(--radius-md)]">
      {/* Collapsible header */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full p-3 text-left hover:bg-[hsl(var(--bg-elevated))] transition-colors rounded-[var(--radius-md)]"
      >
        <span className="text-sm font-medium text-[hsl(var(--text-primary))]">
          Revision History ({versions.length})
        </span>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-[hsl(var(--text-tertiary))]" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[hsl(var(--text-tertiary))]" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-[hsl(var(--border-subtle))]">
          {versions.map((version) => {
            const isComparing = comparingId === version.id
            const isLatest = version.revision === maxRevision

            return (
              <div
                key={version.id}
                className="border-b border-[hsl(var(--border-subtle))] last:border-b-0"
              >
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">
                      v{version.revision}
                    </Badge>
                    <span className="text-xs text-[hsl(var(--text-tertiary))]">
                      {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
                    </span>
                    <span className="text-sm text-[hsl(var(--text-secondary))]">
                      {version.change_summary ?? 'Initial version'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setComparingId(isComparing ? null : version.id)}
                      className="h-7 text-xs"
                    >
                      <GitCompare className="w-3 h-3 mr-1" />
                      {isComparing ? 'Hide' : 'Compare'}
                    </Button>
                    {!isLatest && (
                      <>
                        {confirmRevertId === version.id ? (
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs text-[hsl(var(--status-error))]"
                              disabled={revertVersion.isPending}
                              onClick={() => {
                                revertVersion.mutate({
                                  contentId,
                                  versionId: version.id,
                                  caption: version.caption ?? '',
                                  revision: maxRevision,
                                })
                                setConfirmRevertId(null)
                              }}
                            >
                              Confirm
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => setConfirmRevertId(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setConfirmRevertId(version.id)}
                            className="h-7 text-xs"
                          >
                            <RotateCcw className="w-3 h-3 mr-1" />
                            Revert
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Diff view */}
                {isComparing && (
                  <div className="px-3 pb-3">
                    <DiffView
                      oldText={version.caption ?? ''}
                      newText={currentCaption ?? ''}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function DiffView({ oldText, newText }: { oldText: string; newText: string }) {
  const changes = diffWords(oldText, newText)

  return (
    <div className="p-3 bg-[hsl(var(--bg-elevated))] rounded-[var(--radius-sm)] text-sm leading-relaxed whitespace-pre-wrap">
      {changes.map((part, idx) => (
        <span
          key={idx}
          className={cn(
            part.added && 'bg-[hsl(var(--status-success)/0.15)] text-[hsl(var(--status-success))]',
            part.removed && 'bg-[hsl(var(--status-error)/0.15)] text-[hsl(var(--status-error))] line-through',
          )}
        >
          {part.value}
        </span>
      ))}
    </div>
  )
}
