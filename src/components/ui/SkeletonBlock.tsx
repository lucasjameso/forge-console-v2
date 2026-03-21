import { cn } from '@/lib/utils'

interface SkeletonBlockProps {
  width?: string | number
  height?: string | number
  className?: string
  style?: React.CSSProperties
}

export function SkeletonBlock({ width, height = 16, className, style }: SkeletonBlockProps) {
  return (
    <div
      className={cn('skeleton', className)}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        ...style,
      }}
    />
  )
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('card', className)} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SkeletonBlock width="60%" height={18} />
      <SkeletonBlock width="100%" height={12} />
      <SkeletonBlock width="80%" height={12} />
      <SkeletonBlock width="40%" height={12} />
    </div>
  )
}
