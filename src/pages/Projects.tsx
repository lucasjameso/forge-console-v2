import { PageShell } from '@/components/layout/PageShell'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { SkeletonCard } from '@/components/ui/SkeletonBlock'
import { Card } from '@/components/ui/card'
import { useProjects } from '@/hooks/useProjects'

export function Projects() {
  const { data: projects, isLoading } = useProjects()

  return (
    <PageShell title="Projects" subtitle="Your three active builds.">
      <div className="flex flex-col gap-5">
        {isLoading ? (
          [0, 1, 2].map(i => <SkeletonCard key={i} />)
        ) : (
          (projects ?? []).map((project, idx) => (
            <ProjectCard key={project.id} project={project} index={idx} />
          ))
        )}
        {!isLoading && (projects ?? []).length === 0 && (
          <Card className="p-6" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <p className="text-body">No projects yet.</p>
          </Card>
        )}
      </div>
    </PageShell>
  )
}
