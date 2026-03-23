import { useDroppable } from '@dnd-kit/core'
import { Inbox } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface DroppableColumnProps {
  id: string
  label: string
  count: number
  children: React.ReactNode
}

export function DroppableColumn({ id, label, count, children }: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div>
      {/* Column header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-semibold text-[hsl(var(--text-primary))]">{label}</span>
        <Badge variant="neutral">{count}</Badge>
      </div>

      {/* Column body */}
      <div
        ref={setNodeRef}
        className={`max-h-[calc(100vh-280px)] overflow-y-auto rounded-lg p-2 min-h-[100px] transition-colors ${
          isOver
            ? 'bg-[hsl(var(--accent-coral)/0.05)] border-2 border-[hsl(var(--accent-coral)/0.3)]'
            : 'bg-[hsl(var(--bg-elevated))] border-2 border-transparent'
        }`}
      >
        {count === 0 ? (
          <div className="border-2 border-dashed border-[hsl(var(--border-subtle))] rounded-lg p-8 flex flex-col items-center justify-center gap-2">
            <Inbox size={24} className="text-[hsl(var(--text-tertiary))] opacity-40" />
            <span className="text-[13px] text-[hsl(var(--text-tertiary))]">No items</span>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}
