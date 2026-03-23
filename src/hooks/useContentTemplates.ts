import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { addDays } from 'date-fns'
import { toast } from 'sonner'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { mockContentTemplates } from '@/data/mock'
import type { ContentTemplate } from '@/types/database'

export function useContentTemplates() {
  return useQuery<ContentTemplate[]>({
    queryKey: ['content-templates'],
    queryFn: async () => {
      if (!isSupabaseConfigured) return mockContentTemplates
      const { data, error } = await supabase
        .from('content_templates')
        .select('*')
        .order('sort_order', { ascending: true })
      if (error) throw error
      return data as ContentTemplate[]
    },
  })
}

export function useCreateTemplate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: Omit<ContentTemplate, 'id' | 'created_at' | 'updated_at'>) => {
      if (!isSupabaseConfigured) return
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('content_templates')
        .insert(input)
      if (error) throw error
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['content-templates'] })
      toast.success('Template created')
    },
    onError: (error: Error) => {
      toast.error('Failed to create template', { description: error.message })
    },
  })
}

export function useUpdateTemplate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ContentTemplate> & { id: string }) => {
      if (!isSupabaseConfigured) return
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('content_templates')
        .update(updates)
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['content-templates'] })
      toast.success('Template updated')
    },
    onError: (error: Error) => {
      toast.error('Failed to update template', { description: error.message })
    },
  })
}

export function useDeleteTemplate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      if (!isSupabaseConfigured) return
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('content_templates')
        .delete()
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['content-templates'] })
      toast.success('Template deleted')
    },
    onError: (error: Error) => {
      toast.error('Failed to delete template', { description: error.message })
    },
  })
}

export function useGenerateWeek() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      templates,
      weekStartDate,
    }: {
      templates: ContentTemplate[]
      weekStartDate: string
    }) => {
      const startDate = new Date(weekStartDate)
      const rows = templates
        .filter((t) => t.is_active)
        .map((t) => ({
          post_title: t.title_pattern,
          caption: t.default_caption,
          content_type: t.content_type,
          scheduled_date: addDays(startDate, t.day_of_week).toISOString().slice(0, 10),
          day_label: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][t.day_of_week] ?? 'Monday',
          week_number: 0,
          slide_count: t.suggested_slide_count,
          revision: 1,
          status: 'draft' as const,
          export_paths: [] as string[],
          excalidraw_paths: [] as string[],
          platforms: [t.platform],
          series: t.series,
        }))

      if (!isSupabaseConfigured) return rows.length

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('content_reviews')
        .insert(rows)
      if (error) throw error
      return rows.length
    },
    onSuccess: (count) => {
      void qc.invalidateQueries({ queryKey: ['content-reviews'] })
      toast.success(`Week generated with ${count ?? 0} items`)
    },
    onError: (error: Error) => {
      toast.error('Failed to generate week', { description: error.message })
    },
  })
}
