import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { isToday, isYesterday, format } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const target = new Date(date)
  const diffMs = now.getTime() - target.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHour < 24) return `${diffHour}h ago`
  if (diffDay < 7) return `${diffDay}d ago`
  return target.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatShortDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export function formatTime(date: string | Date): string {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export interface DayGroup<T> {
  label: string
  date: Date
  items: T[]
}

export function groupByDay<T extends { created_at: string }>(items: T[]): DayGroup<T>[] {
  const groups = new Map<string, T[]>()
  for (const item of items) {
    const date = new Date(item.created_at)
    const key = format(date, 'yyyy-MM-dd')
    const existing = groups.get(key) ?? []
    existing.push(item)
    groups.set(key, existing)
  }
  return Array.from(groups.entries()).map(([key, groupItems]) => {
    const date = new Date(key)
    let label: string
    if (isToday(date)) label = 'Today'
    else if (isYesterday(date)) label = 'Yesterday'
    else label = format(date, 'MMMM d, yyyy')
    return { label, date, items: groupItems }
  })
}
