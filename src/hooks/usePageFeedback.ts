import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export interface PageFeedback {
  id: string
  page: string
  feedback_type: 'fix' | 'suggestion'
  content: string
  status: 'open' | 'in_progress' | 'done'
  resolution: string | null
  created_at: string
  resolved_at: string | null
}

export function usePageFeedback(filter?: 'open' | 'done') {
  return useQuery<PageFeedback[]>({
    queryKey: ['page_feedback', filter],
    queryFn: async () => {
      if (!isSupabaseConfigured) return []
      // page_feedback is not in the generated Database type -- cast to bypass
      const base = supabase.from('page_feedback') as ReturnType<typeof supabase.from>
      let query = base.select('*').order('created_at', { ascending: false })
      if (filter === 'open') query = query.in('status', ['open', 'in_progress'])
      if (filter === 'done') query = query.eq('status', 'done')
      const { data, error } = await query
      if (error) throw error
      return (data ?? []) as PageFeedback[]
    },
  })
}

export function useSubmitFeedback() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: { page: string; feedback_type: 'fix' | 'suggestion'; content: string }) => {
      if (!isSupabaseConfigured) return
      // page_feedback is not in the generated Database type -- cast to bypass
      const { error } = await (supabase.from('page_feedback') as ReturnType<typeof supabase.from>).insert(input as never)
      if (error) throw error
    },
    onSuccess: () => {
      toast.success('Feedback saved')
      queryClient.invalidateQueries({ queryKey: ['page_feedback'] })
    },
    onError: () => {
      toast.error('Failed to save feedback')
    },
  })
}
