import Link from 'next/link'
import { fetchProjectById } from '@/lib/supabase/data'
import { projects as staticProjects } from '@/lib/data'
import ContentRenderer from '@/components/ContentRenderer'
import type { Project } from '@/lib/data'

export const dynamic = 'force-dynamic'

async function getProject(id: string): Promise<Project | null> {
  const p = await fetchProjectById(id)
  if (p && p.title) return p
  return staticProjects.find(p => p.id === id) || null
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = await getProject(id)

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project not found</h1>
          <Link href="/" className="text-accent hover:underline">← Back home</Link>
        </div>
      </div>
    )
  }

  const hasContent = project.content && project.content.length > 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-8 sm:pb-12">
        <Link href="/#work" className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-6 sm:mb-8">
          ← Back to projects
        </Link>
        <span
          className="inline-block text-xs font-medium tracking-wider uppercase px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full mb-4 sm:mb-6"
          style={{ background: `${project.color}15`, color: project.color }}
        >
          {project.category}
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
          {project.title}
        </h1>
        <p className="text-base sm:text-lg text-muted max-w-2xl">{project.description}</p>
        <p className="text-sm text-muted mt-3 sm:mt-4">{project.year}</p>
      </div>

      {/* ====== COVER IMAGE (Hero) ====== */}
      <div className="max-w-6xl mx-auto px-0 sm:px-6 pb-16 sm:pb-20">
        <div className="relative overflow-hidden sm:rounded-2xl shadow-2xl bg-card-bg">
          <img
            src={project.image}
            alt={project.title}
            className="w-full object-contain"
            style={{ maxHeight: '80vh', display: 'block' }}
          />
          {/* Gradient overlay at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* ====== CONTENT BODY ====== */}
      {hasContent ? (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-20 sm:pb-24">
          {/* Section label */}
          <div className="flex items-center gap-3 mb-10 sm:mb-12">
            <div className="flex-1 h-px bg-border/50" />
            <span className="text-xs tracking-[0.2em] uppercase text-muted">Project Story</span>
            <div className="flex-1 h-px bg-border/50" />
          </div>
          <ContentRenderer content={project.content!} />
        </div>
      ) : (
        (project as any).videoUrl && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-20">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Project Video</h2>
            <div className="aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-card-bg">
              <iframe src={(project as any).videoUrl} className="w-full h-full" allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
            </div>
          </div>
        )
      )}

      {/* CTA */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-20 sm:pb-24 text-center">
        <div className="section-divider mb-10 sm:mb-12" />
        <Link
          href="/#contact"
          className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-foreground text-background text-sm sm:text-base font-medium hover:bg-foreground/90 transition-all hover:scale-105 active:scale-95"
        >
          Let&apos;s work together
        </Link>
      </div>
    </div>
  );
}
