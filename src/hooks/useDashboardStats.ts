import { useActivityLog } from '@/hooks/useActivityLog'

interface ProjectRecency {
  lastActivityDate: string | null
  hoursAgo: number | null
  recencyLevel: 'green' | 'amber' | 'red'
}

export function useProjectLastActivity(): {
  data: Record<string, ProjectRecency> | undefined
  isLoading: boolean
} {
  const { data: activities, isLoading } = useActivityLog()

  if (!activities) {
    return { data: undefined, isLoading }
  }

  const recencyMap: Record<string, ProjectRecency> = {}

  // Group by project slug and find most recent created_at per project
  const latestByProject = new Map<string, string>()
  for (const entry of activities) {
    if (!entry.project) continue
    const existing = latestByProject.get(entry.project)
    if (!existing || new Date(entry.created_at) > new Date(existing)) {
      latestByProject.set(entry.project, entry.created_at)
    }
  }

  for (const [slug, createdAt] of latestByProject) {
    const hoursAgo = (Date.now() - new Date(createdAt).getTime()) / 3600000
    let recencyLevel: 'green' | 'amber' | 'red'

    if (hoursAgo < 48) {
      recencyLevel = 'green'
    } else if (hoursAgo < 120) {
      recencyLevel = 'amber'
    } else {
      recencyLevel = 'red'
    }

    recencyMap[slug] = {
      lastActivityDate: createdAt,
      hoursAgo,
      recencyLevel,
    }
  }

  return { data: recencyMap, isLoading }
}
