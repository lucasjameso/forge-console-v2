export interface Database {
  public: {
    Tables: {
      projects: {
        Row: Project
        Insert: Omit<Project, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Project, 'id' | 'created_at'>>
      }
      tasks: {
        Row: Task
        Insert: Omit<Task, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Task, 'id' | 'created_at'>>
      }
      project_notes: {
        Row: ProjectNote
        Insert: Omit<ProjectNote, 'id' | 'created_at'>
        Update: Partial<Omit<ProjectNote, 'id' | 'created_at'>>
      }
      project_milestones: {
        Row: ProjectMilestone
        Insert: Omit<ProjectMilestone, 'id' | 'created_at'>
        Update: Partial<Omit<ProjectMilestone, 'id' | 'created_at'>>
      }
      project_action_items: {
        Row: ProjectActionItem
        Insert: Omit<ProjectActionItem, 'id' | 'created_at'>
        Update: Partial<Omit<ProjectActionItem, 'id' | 'created_at'>>
      }
      brain_dumps: {
        Row: BrainDump
        Insert: Omit<BrainDump, 'id' | 'created_at'>
        Update: Partial<Omit<BrainDump, 'id' | 'created_at'>>
      }
      brain_dump_tasks: {
        Row: BrainDumpTask
        Insert: Omit<BrainDumpTask, 'id' | 'created_at'>
        Update: Partial<Omit<BrainDumpTask, 'id' | 'created_at'>>
      }
      content_reviews: {
        Row: ContentReview
        Insert: Omit<ContentReview, 'id' | 'created_at'>
        Update: Partial<Omit<ContentReview, 'id' | 'created_at'>>
      }
      social_platforms: {
        Row: SocialPlatform
        Insert: Omit<SocialPlatform, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<SocialPlatform, 'id' | 'created_at'>>
      }
      podcast_tracker: {
        Row: PodcastEntry
        Insert: Omit<PodcastEntry, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<PodcastEntry, 'id' | 'created_at'>>
      }
      activity_log: {
        Row: ActivityEntry
        Insert: Omit<ActivityEntry, 'id' | 'created_at'>
        Update: Partial<Omit<ActivityEntry, 'id'>>
      }
      system_health: {
        Row: SystemHealth
        Insert: Omit<SystemHealth, 'id'>
        Update: Partial<Omit<SystemHealth, 'id'>>
      }
      settings: {
        Row: Setting
        Insert: Omit<Setting, 'id'>
        Update: Partial<Omit<Setting, 'id'>>
      }
      next_session_prompts: {
        Row: NextSessionPrompt
        Insert: Omit<NextSessionPrompt, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<NextSessionPrompt, 'id' | 'created_at'>>
      }
      page_feedback: {
        Row: PageFeedback
        Insert: Omit<PageFeedback, 'id' | 'created_at'>
        Update: Partial<Omit<PageFeedback, 'id' | 'created_at'>>
      }
    }
  }
}

export type ProjectStatus = 'active' | 'paused' | 'completed' | 'archived'
export type ProjectPriority = 'high' | 'medium' | 'low'
export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type MilestoneStatus = 'upcoming' | 'in_progress' | 'done'
export type ActionItemStatus = 'open' | 'resolved' | 'snoozed'
export type Urgency = 'high' | 'medium' | 'low'
export type BrainDumpStatus = 'pending' | 'processed' | 'dismissed'
export type BrainDumpTaskStatus = 'pending' | 'assigned' | 'done'
export type ContentStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'posted'
export type SocialPlatformStatus = 'active' | 'setup_needed' | 'inactive'
export type PodcastStatus = 'outreach' | 'scheduled' | 'recorded' | 'published'
export type SessionType = 'claude_code' | 'n8n' | 'slack' | 'cowork' | 'system' | 'manual'
export type HealthStatus = 'healthy' | 'degraded' | 'down'

export interface PageFeedback {
  id: string
  page: string
  type: 'fix' | 'suggestion'
  content: string
  status: 'open' | 'done' | 'deferred'
  priority?: string
  created_at: string
}

export interface Project {
  id: string
  name: string
  slug: string
  description: string
  status: ProjectStatus
  priority: ProjectPriority
  progress_pct: number
  color?: string
  current_phase: string | null
  metadata: Record<string, unknown> | null
  github_url: string | null
  supabase_ref: string | null
  cloudflare_url: string | null
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  project_id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: ProjectPriority
  assignee: string | null
  column_order: number
  created_at: string
  updated_at: string
  resolved_at: string | null
}

export interface ProjectNote {
  id: string
  project_id: string
  content: string
  tag: string | null
  created_at: string
}

export interface ProjectMilestone {
  id: string
  project_id: string
  title: string
  target_date: string | null
  status: MilestoneStatus
  phase_number: number
  created_at: string
}

export interface ProjectActionItem {
  id: string
  project_id: string
  description: string
  urgency: Urgency
  source: string | null
  status: ActionItemStatus
  created_at: string
  resolved_at: string | null
}

export interface BrainDump {
  id: string
  raw_text: string
  parsed_output: ParsedBrainDump | null
  project_hint: string | null
  status: BrainDumpStatus
  created_at: string
}

export interface ParsedBrainDump {
  tasks: ParsedTask[]
  summary: string
}

export interface ParsedTask {
  description: string
  project: string
  priority: ProjectPriority
  deadline: string | null
}

export interface BrainDumpTask {
  id: string
  brain_dump_id: string
  description: string
  project: string
  priority: ProjectPriority
  status: BrainDumpTaskStatus
  created_at: string
  resolved_at: string | null
}

export interface ContentReview {
  id: string
  post_title: string
  caption: string | null
  week_number: number
  day_label: string
  scheduled_date: string | null
  slide_count: number
  revision: number
  status: ContentStatus
  export_paths: string[]
  excalidraw_paths: string[]
  platforms: string[]
  feedback: string | null
  slack_ts: string | null
  slack_channel: string | null
  created_at: string
  resolved_at: string | null
  posted_at: string | null
}

export interface SocialPlatform {
  id: string
  platform_name: string
  handle: string | null
  profile_url: string | null
  icon_name: string
  follower_count: number | null
  last_post_date: string | null
  status: SocialPlatformStatus
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export interface PodcastEntry {
  id: string
  podcast_name: string
  host_name: string | null
  status: PodcastStatus
  recording_date: string | null
  publish_date: string | null
  episode_url: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface ActivityEntry {
  id: string
  session_type: SessionType
  project: string | null
  tool: string | null
  summary: string
  metadata: Record<string, unknown> | null
  created_at: string
}

export interface SystemHealth {
  id: string
  service: string
  status: HealthStatus
  metadata: Record<string, unknown> | null
  checked_at: string
}

export interface Setting {
  id: string
  key: string
  value: unknown
  updated_at: string
}

export interface NextSessionPrompt {
  id: string
  project_id: string
  prompt_text: string
  created_at: string
  updated_at: string
}
