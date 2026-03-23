import { useState, useCallback, useMemo } from 'react'

export function useBulkSelection() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const toggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const selectAll = useCallback((ids: string[]) => {
    setSelectedIds(new Set(ids))
  }, [])

  const deselectAll = useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  const isSelected = useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds]
  )

  const count = useMemo(() => selectedIds.size, [selectedIds])

  return { selectedIds, toggle, selectAll, deselectAll, count, isSelected }
}
