import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { mockContentReviews } from '@/data/mock'
import type { ContentReview } from '@/types/database'

export function useContentReviews() {
  return useQuery<ContentReview[]>({
    queryKey: ['content-reviews'],
    queryFn: async () => {
      if (!isSupabaseConfigured) return mockContentReviews
      const { data, error } = await supabase
        .from('content_reviews')
        .select('*')
        .order('scheduled_date', { ascending: true })
      if (error) throw error
      return data as ContentReview[]
    },
  })
}

export function useUpdateContentStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      status,
      feedback,
    }: {
      id: string
      status: ContentReview['status']
      feedback?: string
    }) => {
      if (!isSupabaseConfigured) return
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('content_reviews')
        .update({
          status,
          feedback: feedback ?? null,
          resolved_at: ['approved', 'rejected'].includes(status) ? new Date().toISOString() : null,
        })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['content-reviews'] })
    },
  })
}
