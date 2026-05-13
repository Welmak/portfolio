'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { projects as staticProjects } from '@/lib/data';
import type { Project } from '@/lib/data';

const INITIAL_SHOW = 6;

export default function ProjectGrid() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>(staticProjects);
  const [showAll, setShowAll] = useState(false);

  const visibleProjects = showAll ? projects : projects.slice(0, INITIAL_SHOW);
  const hasMore = projects.length > INITIAL_SHOW;

  useEffect(() => {
    fetch('/api/public/projects')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data.map((p: any) => ({
            id: p.id,
            title: p.title,
            category: p.category,
            year: p.year,
            description: p.description,
            image: p.image,
            videoUrl: p.video_url || undefined,
            content: p.content || undefined,
            link: '/projects/' + (p.id || p.slug),
            color: p.color || '#06b6d4',
          })));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="work" className="py-32 sm:py-40 lg:py-48 px-8 sm:px-10 lg:px-14">
      <div className="max-w-[90rem] mx-auto">
        <div className="mb-20 sm:mb-28 max-w-xl reveal-on-scroll visible">
          <p className="text-muted text-xs sm:text-sm tracking-[0.3em] uppercase mb-7 reveal-on-scroll visible font-medium">
            Selected Work
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] reveal-on-scroll visible reveal-delay-1">
            Recent projects<span className="text-muted font-light"> — 精选作品</span>
          </h2>
        </div>

        <div className="masonry-grid">
          {visibleProjects.map((project, index) => {
            const ratios = ['aspect-[5/6]', 'aspect-[4/3]', 'aspect-[1/1]', 'aspect-[3/4]', 'aspect-[16/10]', 'aspect-[5/4]'];
            const aspect = ratios[index % ratios.length];

            return (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="project-card group"
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className={`relative overflow-hidden rounded-2xl mx-3 sm:mx-4 mt-3 sm:mt-4 ${aspect}`}>
                  {project.videoUrl ? (
                    <video
                      src={project.videoUrl}
                      muted loop playsInline preload="metadata"
                      className="card-image w-full h-full object-cover"
                      onMouseEnter={e => (e.target as HTMLVideoElement).play().catch(() => {})}
                      onMouseLeave={e => { (e.target as HTMLVideoElement).pause(); (e.target as HTMLVideoElement).currentTime = 0; }}
                    />
                  ) : (
                    <BlurImage
                      src={project.image}
                      alt={project.title}
                      className="card-image w-full h-full object-cover"
                    />
                  )}
                  <div
                    className={`absolute inset-0 transition-opacity duration-600 ${
                      hoveredId === project.id ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ background: `linear-gradient(180deg, transparent 40%, ${project.color}15 100%)` }}
                  />
                </div>

                <div className="px-5 sm:px-6 pt-6 sm:pt-7 pb-7 sm:pb-9">
                  <div className="flex items-center justify-between mb-4 sm:mb-5">
                    <span
                      className="text-[12px] sm:text-xs tracking-wider uppercase rounded-full px-3 py-1.5 font-medium"
                      style={{ background: `${project.color}10`, color: project.color }}
                    >
                      {project.category}
                    </span>
                    <span className="text-xs text-muted tracking-wide font-medium">{project.year}</span>
                  </div>

                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight mb-3 sm:mb-4 leading-[1.25] group-hover:text-accent transition-colors duration-400">
                    {project.title}
                  </h3>

                  <p className="text-sm sm:text-[15px] text-muted leading-relaxed line-clamp-3 max-w-prose">
                    {project.description}
                  </p>

                  <p className="text-xs font-medium text-accent mt-4 opacity-0 group-hover:opacity-100 transition-all duration-400 translate-y-1 group-hover:translate-y-0">
                    View Project →
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {hasMore && (
          <div className="text-center mt-24 sm:mt-28 reveal-on-scroll">
            {!showAll ? (
              <button
                onClick={() => setShowAll(true)}
                className="inline-flex items-center gap-3 px-10 py-4 rounded-full border border-border/60 text-sm font-medium text-muted hover:text-foreground hover:border-foreground/20 hover:bg-foreground/[0.03] transition-all duration-500 active:scale-[0.98]"
              >
                View All Projects
                <span className="text-xs text-muted/60">({projects.length - INITIAL_SHOW})</span>
              </button>
            ) : (
              <button
                onClick={() => setShowAll(false)}
                className="inline-flex items-center gap-3 px-10 py-4 rounded-full border border-border/60 text-sm font-medium text-muted hover:text-foreground hover:border-foreground/20 hover:bg-foreground/[0.03] transition-all duration-500 active:scale-[0.98]"
              >
                Show Less
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function BlurImage({ src, alt, className }: { src: string; alt: string; className: string }) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      className={`${className} ${loaded ? 'loaded' : ''}`}
      loading="lazy"
      onLoad={() => setLoaded(true)}
    />
  );
}
