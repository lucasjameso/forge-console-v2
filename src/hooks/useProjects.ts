import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import {
  mockProjects,
  mockTasks,
  mockMilestones,
  mockActionItems,
  mockNotes,
  mockNextSessionPrompts,
} from '@/data/mock'
import type { Project, Task, ProjectNote, ProjectMilestone, ProjectActionItem, NextSessionPrompt } from '@/types/database'

export function useProjects() {
  return useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      if (!isSupabaseConfigured) return mockProjects
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('priority', { ascending: true })
      if (error) throw error
      return data as Project[]
    },
  })
}

export function useProject(slug: string) {
  return useQuery<Project | null>({
    queryKey: ['project', slug],
    queryFn: async () => {
      if (!isSupabaseConfigured) {
        return mockProjects.find(p => p.slug === slug) ?? null
      }
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .single()
      if (error) throw error
      return data as Project
    },
  })
}

export function useTasks(projectId: string) {
  return useQuery<Task[]>({
    queryKey: ['tasks', projectId],
    queryFn: async () => {
      if (!isSupabaseConfigured) return mockTasks[projectId] ?? []
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('column_order', { ascending: true })
      if (error) throw error
      return data as Task[]
    },
  })
}

export function useMilestones(projectId: string) {
  return useQuery<ProjectMilestone[]>({
    queryKey: ['milestones', projectId],
    queryFn: async () => {
      if (!isSupabaseConfigured) return mockMilestones[projectId] ?? []
      const { data, error } = await supabase
        .from('project_milestones')
        .select('*')
        .eq('project_id', projectId)
        .order('phase_number', { ascending: true })
      if (error) throw error
      return data as ProjectMilestone[]
    },
  })
}

export function useActionItems(projectId?: string) {
  return useQuery<ProjectActionItem[]>({
    queryKey: ['action-items', projectId ?? 'all'],
    queryFn: async () => {
      if (!isSupabaseConfigured) {
        if (!projectId) {
          return Object.values(mockActionItems).flat()
        }
        return mockActionItems[projectId] ?? []
      }
      let query = supabase
        .from('project_action_items')
        .select('*')
        .eq('status', 'open')
        .order('urgency', { ascending: false })
      if (projectId) {
        query = query.eq('project_id', projectId)
      }
      const { data, error } = await query
      if (error) throw error
      return data as ProjectActionItem[]
    },
  })
}

export function useProjectNotes(projectId: string) {
  return useQuery<ProjectNote[]>({
    queryKey: ['notes', projectId],
    queryFn: async () => {
      if (!isSupabaseConfigured) return mockNotes[projectId] ?? []
      const { data, error } = await supabase
        .from('project_notes')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as ProjectNote[]
    },
  })
}

export function useNextSessionPrompt(projectId: string) {
  return useQuery<NextSessionPrompt | null>({
    queryKey: ['next-session-prompt', projectId],
    queryFn: async () => {
      if (!isSupabaseConfigured) return mockNextSessionPrompts[projectId] ?? null
      const { data, error } = await supabase
        .from('next_session_prompts')
        .select('*')
        .eq('project_id', projectId)
        .single()
      if (error && error.code !== 'PGRST116') throw error
      return data as NextSessionPrompt | null
    },
  })
}

export function useUpdateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Task['status'] }) => {
      if (!isSupabaseConfigured) return
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('tasks')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export function useAddNote() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ project_id, content, tag }: { project_id: string; content: string; tag?: string }) => {
      if (!isSupabaseConfigured) return
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('project_notes')
        .insert({ project_id, content, tag })
      if (error) throw error
    },
    onSuccess: (_data, vars) => {
      void qc.invalidateQueries({ queryKey: ['notes', vars.project_id] })
    },
  })
}
