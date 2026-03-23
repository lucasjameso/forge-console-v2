import { motion, AnimatePresence } from 'framer-motion'
import { Check, FileText, CalendarDays, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface BulkActionBarProps {
  count: number
  onApproveAll: () => void
  onMoveToDraft: () => void
  onReschedule: () => void
  onDelete: () => void
  onDeselectAll: () => void
}

export function BulkActionBar({
  count,
  onApproveAll,
  onMoveToDraft,
  onReschedule,
  onDelete,
  onDeselectAll,
}: BulkActionBarProps) {
  const handleReschedule = () => {
    toast.info('Reschedule coming soon')
    onReschedule()
  }

  const handleDelete = () => {
    const confirmed = window.confirm(`Delete ${count} item${count > 1 ? 's' : ''}?`)
    if (confirmed) {
      onDelete()
    }
  }

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-[var(--radius-lg)] bg-[hsl(var(--bg-surface))] border border-[hsl(var(--border-default))] shadow-xl"
        >
          <span className="text-sm font-medium text-[hsl(var(--text-primary))] whitespace-nowrap">
            {count} selected
          </span>

          <Button size="sm" onClick={onApproveAll} className="gap-1.5 bg-[hsl(var(--accent-coral))] hover:bg-[hsl(var(--accent-coral-hover))] text-white">
            <Check size={14} />
            Approve All
          </Button>

          <Button variant="outline" size="sm" onClick={onMoveToDraft} className="gap-1.5">
            <FileText size={14} />
            Move to Draft
          </Button>

          <Button variant="outline" size="sm" onClick={handleReschedule} className="gap-1.5">
            <CalendarDays size={14} />
            Reschedule
          </Button>

          <Button variant="destructive" size="sm" onClick={handleDelete} className="gap-1.5">
            <Trash2 size={14} />
            Delete
          </Button>

          <Button variant="ghost" size="sm" onClick={onDeselectAll} className="gap-1.5">
            <X size={14} />
            Deselect
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
