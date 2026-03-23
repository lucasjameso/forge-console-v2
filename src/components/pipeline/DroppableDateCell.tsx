import { useDroppable } from '@dnd-kit/core'

interface DroppableDateCellProps {
  dateKey: string
  isCurrentMonth: boolean
  isToday: boolean
  dayNumber: string
  children: React.ReactNode
}

export function DroppableDateCell({
  dateKey,
  isCurrentMonth,
  isToday: todayCell,
  dayNumber,
  children,
}: DroppableDateCellProps) {
  const { setNodeRef, isOver } = useDroppable({ id: dateKey })

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[80px] md:min-h-[100px] lg:min-h-[120px] border p-1 md:p-2 overflow-hidden transition-colors ${
        !isCurrentMonth
          ? 'bg-[hsl(var(--bg-elevated)/0.5)] opacity-40'
          : 'bg-[hsl(var(--bg-surface))]'
      } ${
        todayCell
          ? 'border-t-2 border-t-[hsl(var(--accent-coral))] bg-[hsl(var(--accent-coral)/0.04)]'
          : 'border-[hsl(var(--border-subtle))]'
      } ${
        isOver
          ? 'bg-[hsl(var(--accent-coral)/0.08)] border-dashed border-[hsl(var(--accent-coral)/0.4)]'
          : ''
      }`}
    >
      <span className={`text-xs sm:text-sm font-semibold ${
        !isCurrentMonth
          ? 'text-[hsl(var(--text-tertiary)/0.4)]'
          : todayCell
          ? 'text-[hsl(var(--accent-coral))]'
          : 'text-[hsl(var(--text-primary))]'
      }`}>
        {dayNumber}
      </span>
      <div className="flex flex-col gap-1 mt-1">
        {children}
      </div>
    </div>
  )
}
