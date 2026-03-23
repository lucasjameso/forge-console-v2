import { Badge } from '@/components/ui/badge'
import { getProjectColorVar, getProjectBgVar } from '@/lib/colors'
import { cn } from '@/lib/utils'

interface ProjectBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  project: string
}

export function ProjectBadge({ project, className, ...props }: ProjectBadgeProps) {
  return (
    <Badge
      className={cn('border-transparent', className)}
      style={{
        color: getProjectColorVar(project),
        backgroundColor: getProjectBgVar(project),
      }}
      {...props}
    >
      {project}
    </Badge>
  )
}
