'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { projects as staticProjects } from '@/lib/data';
import type { Project } from '@/lib/data';

export default function PortfolioSection() {
  const [projects, setProjects] = useState<Project[]>(staticProjects);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
            link: '/projects/' + (p.id || p.slug),
            color: p.color || '#06b6d4',
          })));
        }
      })
      .catch(() => {});
  }, []);

  const checkScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [checkScroll]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const card = scrollContainerRef.current.querySelector('li');
      if (!card) return;
      const cardWidth = card.getBoundingClientRect().width + 20;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -cardWidth : cardWidth,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 400);
    }
  };

  return (
    <section id="work" className="py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-12 md:mb-16">
          <p className="text-muted text-xs tracking-[0.25em] uppercase mb-4 font-medium">
            Selected Work
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Recent Projects
          </h2>
        </div>

        {/* Horizontal Scroll Gallery */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="flex gap-5 overflow-x-auto pb-2 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <ul className="flex gap-5 m-0 p-0 list-none" role="list">
              {projects.slice(0, 6).map((project) => (
                <FeatureCard key={project.id} project={project} />
              ))}
            </ul>
          </div>

          {/* Navigation Arrows */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="flex items-center justify-center rounded-full h-11 w-11 bg-[#e8e8ed] disabled:opacity-25 hover:bg-[#d2d2d7] transition-colors"
              aria-label="上一个"
            >
              <ChevronLeft className="h-5 w-5 text-[#1d1d1f]" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="flex items-center justify-center rounded-full h-11 w-11 bg-[#e8e8ed] disabled:opacity-25 hover:bg-[#d2d2d7] transition-colors"
              aria-label="下一个"
            >
              <ChevronRight className="h-5 w-5 text-[#1d1d1f]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Feature Card (Apple-style) ─── */
function FeatureCard({ project }: { project: Project }) {
  const [hovered, setHovered] = useState(false);

  return (
    <li
      className="flex-shrink-0 w-[244px] sm:w-[288px] md:w-[320px] snap-start group list-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        href={`/projects/${project.id}`}
        className="block relative overflow-hidden rounded-2xl bg-[#1d1d1f] h-[420px] sm:h-[480px] md:h-[540px] transition-all duration-600 will-change-transform"
        style={{ transform: hovered ? 'scale(1.016)' : 'scale(1)' }}
      >
        {/* Image — full cover, no blur */}
        <img
          src={project.image}
          alt={project.title}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-800 ${
            hovered ? 'scale-105' : 'scale-100'
          }`}
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1d1d1f]/60 via-transparent via-40% to-[#1d1d1f]/80 pointer-events-none" />

        {/* Text Content — top-left */}
        <div className="absolute inset-x-0 top-0 p-6">
          <h3 className="text-xs font-semibold tracking-[0.08em] uppercase text-white/60 mb-3">
            {project.category}
          </h3>
          <p className="text-xl md:text-2xl font-semibold text-white leading-[1.2] tracking-[-0.02em] max-w-[90%]">
            {project.title}
          </p>
        </div>

        {/* "+" Button */}
        <div className="absolute bottom-5 right-5">
          <span
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-400 ${
              hovered
                ? 'bg-white/25 scale-110'
                : 'bg-white/15'
            }`}
          >
            <svg
              className={`w-6 h-6 text-white transition-transform duration-400 ${hovered ? 'rotate-90' : ''}`}
              viewBox="0 0 36 36"
              fill="currentColor"
            >
              <path d="M24 16.5h-4.5v-4.5c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5v4.5H12c-.828 0-1.5.672-1.5 1.5s.672 1.5 1.5 1.5h4.5v4.5c0 .828.672 1.5 1.5 1.5s1.5-.672 1.5-1.5v-4.5H24c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5z" />
            </svg>
          </span>
        </div>
      </Link>
    </li>
  );
}
