import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface SkeletonBlockProps {
  width?: string | number
  height?: string | number
  className?: string
  style?: React.CSSProperties
}

export function SkeletonBlock({ width, height = 16, className, style }: SkeletonBlockProps) {
  const w = typeof width === 'number' ? `${width}px` : width
  const h = typeof height === 'number' ? `${height}px` : height

  return (
    <Skeleton
      className={cn(className)}
      style={{
        width: w,
        height: h,
        ...style,
      }}
    />
  )
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <Card className={cn('p-6', className)} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Skeleton className="h-[18px] w-[60%]" />
      <Skeleton className="h-[12px] w-full" />
      <Skeleton className="h-[12px] w-[80%]" />
      <Skeleton className="h-[12px] w-[40%]" />
    </Card>
  )
}
