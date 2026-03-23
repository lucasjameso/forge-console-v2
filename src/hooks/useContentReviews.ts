import { useQuery, useMutation, useQueryClient, type UseQueryResult } from '@tanstack/react-query'
import { toast } from 'sonner'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { mockContentReviews } from '@/data/mock'
import type { ContentReview, ContentType } from '@/types/database'

// Re-export UseQueryResult for downstream consumers
export type { UseQueryResult }

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
    onSuccess: (_data, variables) => {
      void qc.invalidateQueries({ queryKey: ['content-reviews'] })
      toast.success(`Content ${variables.status === 'approved' ? 'approved' : 'updated'}`)
    },
    onError: (error: Error) => {
      toast.error('Failed to update content status', { description: error.message })
    },
  })
}

export function useCreateContent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: {
      post_title: string
      caption: string | null
      content_type: ContentType
      scheduled_date: string | null
      day_label: string
      week_number: number | null
      platforms: string[]
      series: string | null
      notes: string | null
    }) => {
      if (!isSupabaseConfigured) return
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('content_reviews')
        .insert({
          post_title: input.post_title,
          caption: input.caption,
          content_type: input.content_type,
          scheduled_date: input.scheduled_date,
          day_label: input.day_label,
          week_number: input.week_number ?? 0,
          platforms: input.platforms,
          series: input.series,
          notes: input.notes,
          status: 'draft',
          revision: 1,
          slide_count: 0,
          export_paths: [],
          excalidraw_paths: [],
        })
      if (error) throw error
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['content-reviews'] })
      toast.success('Content created as draft')
    },
    onError: (error: Error) => {
      toast.error('Failed to create content', { description: error.message })
    },
  })
}

export function useUpdateCaption() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, caption }: { id: string; caption: string }) => {
      if (!isSupabaseConfigured) return
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('content_reviews')
        .update({ caption })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['content-reviews'] })
    },
    onError: (error: Error) => {
      toast.error('Failed to save caption', { description: error.message })
    },
  })
}

export function useUpdateScheduledDate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, scheduled_date }: { id: string; scheduled_date: string }) => {
      if (!isSupabaseConfigured) return
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('content_reviews')
        .update({ scheduled_date })
        .eq('id', id)
      if (error) throw error
    },
    onMutate: async ({ id, scheduled_date }) => {
      await qc.cancelQueries({ queryKey: ['content-reviews'] })
      const previous = qc.getQueryData<ContentReview[]>(['content-reviews'])
      qc.setQueryData<ContentReview[]>(['content-reviews'], (old) =>
        old?.map((item) => (item.id === id ? { ...item, scheduled_date } : item))
      )
      return { previous }
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        qc.setQueryData(['content-reviews'], context.previous)
      }
      toast.error('Failed to reschedule content')
    },
    onSuccess: () => {
      toast.success('Content rescheduled')
    },
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: ['content-reviews'] })
    },
  })
}
