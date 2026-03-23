import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { ContentPerformance } from '@/types/database'

export function useContentPerformance(contentId: string) {
  return useQuery<ContentPerformance | null>({
    queryKey: ['content-performance', contentId],
    queryFn: async () => {
      if (!isSupabaseConfigured) return null
      const { data, error } = await supabase
        .from('content_performance')
        .select('*')
        .eq('content_id', contentId)
        .maybeSingle()
      if (error) throw error
      return data ? (data as ContentPerformance) : null
    },
    enabled: Boolean(contentId),
  })
}

export function useUpsertPerformance() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: Omit<ContentPerformance, 'id' | 'recorded_at'>) => {
      if (!isSupabaseConfigured) return
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('content_performance')
        .upsert(input, { onConflict: 'content_id' })
      if (error) throw error
    },
    onSuccess: (_data, variables) => {
      void qc.invalidateQueries({ queryKey: ['content-performance', variables.content_id] })
      toast.success('Performance metrics saved')
    },
    onError: (error: Error) => {
      toast.error('Failed to save performance metrics', { description: error.message })
    },
  })
}
