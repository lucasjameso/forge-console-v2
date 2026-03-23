// Project color config (per D-07, D-09, D-10)
export const PROJECT_COLORS: Record<string, string> = {
  ridgeline: 'project-ridgeline',
  clarity: 'project-clarity',
  forge: 'project-forge',
  'forge-console': 'project-forge',
  meridian: 'project-meridian',
  atlas: 'project-atlas',
}

export function getProjectColor(slug: string): string {
  const normalized = slug.toLowerCase().replace(/\s+/g, '-')
  return PROJECT_COLORS[normalized] ?? 'project-atlas'
}

export function getProjectColorVar(slug: string): string {
  return `hsl(var(--${getProjectColor(slug)}))`
}

export function getProjectBgVar(slug: string): string {
  return `hsl(var(--${getProjectColor(slug)}-bg))`
}

// Page identity colors (static map per D-11)
export const PAGE_COLORS: Record<string, string> = {
  dashboard: 'page-dashboard',
  projects: 'page-projects',
  'brain-dump': 'page-brain-dump',
  'content-pipeline': 'page-content-pipeline',
  'social-media': 'page-social-media',
  'activity-log': 'page-activity-log',
  settings: 'page-settings',
}

export function getPageColor(page: string): string {
  return PAGE_COLORS[page] ?? 'page-settings'
}

export function getPageColorVar(page: string): string {
  return `hsl(var(--${getPageColor(page)}))`
}

// Priority color helpers (DFIX-01)
export const PRIORITY_COLORS = {
  high: { text: 'status-error', bg: 'status-error-bg' },
  medium: { text: 'status-warning', bg: 'status-warning-bg' },
  low: { text: 'status-success', bg: 'status-success-bg' },
} as const

export type Priority = keyof typeof PRIORITY_COLORS

// Content status colors (CFIX-09)
export const CONTENT_STATUS_COLORS = {
  draft: { text: 'text-tertiary', bg: 'bg-elevated' },
  pending: { text: 'status-warning', bg: 'status-warning-bg' },
  approved: { text: 'status-success', bg: 'status-success-bg' },
  rejected: { text: 'status-error', bg: 'status-error-bg' },
  posted: { text: 'status-info', bg: 'status-info-bg' },
} as const

export type ContentStatus = keyof typeof CONTENT_STATUS_COLORS

// Tool colors for Activity Log (AFIX-02)
export const TOOL_COLORS: Record<string, string> = {
  'claude-code': 'accent-coral',
  'n8n': 'status-success',
  'slack': 'status-warning',
  'system': 'text-tertiary',
  'manual': 'accent-navy',
  'cowork': 'status-info',
}

export function getToolColor(tool: string): string {
  const normalized = tool.toLowerCase().replace(/\s+/g, '-')
  return TOOL_COLORS[normalized] ?? 'text-tertiary'
}

// Recency thresholds (D-20, DFIX-07)
export function getRecencyColor(lastActivityDate: string | Date): 'success' | 'warning' | 'error' {
  const now = new Date()
  const last = new Date(lastActivityDate)
  const diffMs = now.getTime() - last.getTime()
  const diffHours = diffMs / (1000 * 60 * 60)
  if (diffHours < 48) return 'success'
  if (diffHours < 120) return 'warning' // 5 days
  return 'error'
}
