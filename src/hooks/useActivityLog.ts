import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { mockActivity } from '@/data/mock'
import type { ActivityEntry, SessionType } from '@/types/database'

interface ActivityFilters {
  project?: string
  sessionType?: SessionType
  search?: string
}

export function useActivityLog(filters?: ActivityFilters) {
  return useQuery<ActivityEntry[]>({
    queryKey: ['activity-log', filters],
    queryFn: async () => {
      if (!isSupabaseConfigured) {
        let results = mockActivity
        if (filters?.project && filters.project !== 'all') {
          results = results.filter(e => e.project === filters.project)
        }
        if (filters?.sessionType) {
          results = results.filter(e => e.session_type === filters.sessionType)
        }
        if (filters?.search) {
          const q = filters.search.toLowerCase()
          results = results.filter(e => e.summary.toLowerCase().includes(q))
        }
        return results
      }

      let query = supabase
        .from('activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)

      if (filters?.project && filters.project !== 'all') {
        query = query.eq('project', filters.project)
      }
      if (filters?.sessionType) {
        query = query.eq('session_type', filters.sessionType)
      }
      if (filters?.search) {
        query = query.ilike('summary', `%${filters.search}%`)
      }

      const { data, error } = await query
      if (error) throw error
      return data as ActivityEntry[]
    },
  })
}

export function useLogActivity() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: {
      session_type: SessionType
      project: string | null
      tool: string | null
      summary: string
      metadata: Record<string, unknown> | null
    }) => {
      if (!isSupabaseConfigured) return
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('activity_log')
        .insert({
          session_type: input.session_type,
          project: input.project,
          tool: input.tool,
          summary: input.summary,
          metadata: input.metadata,
        })
      if (error) throw error
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['activity-log'] })
      toast.success('Activity logged')
    },
    onError: (error: Error) => {
      toast.error('Failed to log activity', { description: error.message })
    },
  })
}
