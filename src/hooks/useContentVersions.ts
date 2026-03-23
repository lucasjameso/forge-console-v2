import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { ContentVersion } from '@/types/database'

export function useContentVersions(contentId: string) {
  return useQuery<ContentVersion[]>({
    queryKey: ['content-versions', contentId],
    queryFn: async () => {
      if (!isSupabaseConfigured) return []
      const { data, error } = await supabase
        .from('content_versions')
        .select('*')
        .eq('content_id', contentId)
        .order('revision', { ascending: false })
      if (error) throw error
      return data as ContentVersion[]
    },
    enabled: Boolean(contentId),
  })
}

export function useCreateVersion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: {
      content_id: string
      revision: number
      caption: string | null
      change_summary: string | null
    }) => {
      if (!isSupabaseConfigured) return
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('content_versions')
        .insert(input)
      if (error) throw error
    },
    onSuccess: (_data, variables) => {
      void qc.invalidateQueries({ queryKey: ['content-versions', variables.content_id] })
    },
  })
}

export function useRevertVersion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      contentId,
      versionId: _versionId,
      caption,
      revision,
    }: {
      contentId: string
      versionId: string
      caption: string
      revision: number
    }) => {
      if (!isSupabaseConfigured) return

      // Update the content review caption
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: updateError } = await (supabase as any)
        .from('content_reviews')
        .update({ caption })
        .eq('id', contentId)
      if (updateError) throw updateError

      // Create a new version row recording the revert
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: insertError } = await (supabase as any)
        .from('content_versions')
        .insert({
          content_id: contentId,
          revision: revision + 1,
          caption,
          change_summary: `Reverted to version ${revision}`,
        })
      if (insertError) throw insertError
    },
    onSuccess: (_data, variables) => {
      void qc.invalidateQueries({ queryKey: ['content-reviews'] })
      void qc.invalidateQueries({ queryKey: ['content-versions', variables.contentId] })
      toast.success(`Reverted to version ${variables.revision}`)
    },
    onError: (error: Error) => {
      toast.error('Failed to revert version', { description: error.message })
    },
  })
}
