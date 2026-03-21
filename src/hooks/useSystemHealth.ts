import { useQuery } from '@tanstack/react-query'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { mockSystemHealth } from '@/data/mock'
import type { SystemHealth } from '@/types/database'

export function useSystemHealth() {
  return useQuery<SystemHealth[]>({
    queryKey: ['system-health'],
    queryFn: async () => {
      if (!isSupabaseConfigured) return mockSystemHealth

      const { data, error } = await supabase
        .from('system_health')
        .select('*')
        .order('checked_at', { ascending: false })

      if (error) throw error

      // Return latest per service
      const seen = new Set<string>()
      const latest: SystemHealth[] = []
      for (const row of (data as SystemHealth[])) {
        if (!seen.has(row.service)) {
          seen.add(row.service)
          latest.push(row)
        }
      }
      return latest
    },
    staleTime: 1000 * 60, // 1 min
    refetchInterval: 1000 * 60 * 5, // refetch every 5 min
  })
}
