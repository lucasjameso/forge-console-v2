import { useQuery } from '@tanstack/react-query'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { mockSocialPlatforms } from '@/data/mock'
import type { SocialPlatform } from '@/types/database'

export function useSocialPlatforms() {
  return useQuery<SocialPlatform[]>({
    queryKey: ['social-platforms'],
    queryFn: async () => {
      if (!isSupabaseConfigured) return mockSocialPlatforms
      const { data, error } = await supabase
        .from('social_platforms')
        .select('*')
        .order('platform_name', { ascending: true })
      if (error) throw error
      return data as SocialPlatform[]
    },
  })
}
