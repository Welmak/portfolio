'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { siteConfig } from '@/lib/data';
import HeroParticles from './HeroParticles';

interface HoverTarget { x: number; y: number; w: number; h: number }

export default function HeroBanner() {
  const [mounted, setMounted] = useState(false);
  const [hoverTarget, setHoverTarget] = useState<HoverTarget | null>(null);
  const [clickPos, setClickPos] = useState<{ x: number; y: number } | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  const consumeClick = useCallback(() => setClickPos(null), []);

  const handleClick = (e: React.MouseEvent) => {
    setClickPos({ x: e.clientX, y: e.clientY });
  };

  const updateHover = (el: HTMLElement | null) => {
    if (!el) { setHoverTarget(null); return; }
    const r = el.getBoundingClientRect();
    setHoverTarget({ x: r.left, y: r.top, w: r.width, h: r.height });
  };

  return (
    <section
      ref={sectionRef}
      id="home"
      onClick={handleClick}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: '#fbfbfd' }}
    >
      {mounted && (
        <HeroParticles
          hoverTarget={hoverTarget}
          clickPos={clickPos}
          onConsumeClick={consumeClick}
        />
      )}

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <p
          className="text-muted text-sm sm:text-base tracking-[0.2em] uppercase mb-6 hero-text-reveal"
          style={{ animationDelay: '0.2s' }}
        >
          {siteConfig.role}
        </p>

        <h1
          ref={nameRef}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-8 hero-text-reveal text-gradient"
          style={{ animationDelay: '0.4s' }}
          onMouseEnter={() => updateHover(nameRef.current)}
          onMouseLeave={() => updateHover(null)}
        >
          {siteConfig.name}
        </h1>

        <p
          className="text-lg sm:text-xl md:text-2xl text-muted font-light max-w-2xl mx-auto hero-text-reveal"
          style={{ animationDelay: '0.6s' }}
        >
          {siteConfig.tagline}
        </p>

        <div
          ref={ctaRef}
          className="mt-12 hero-text-reveal inline-block"
          style={{ animationDelay: '0.8s' }}
          onMouseEnter={() => updateHover(ctaRef.current)}
          onMouseLeave={() => updateHover(null)}
        >
          <a
            href="#work"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-foreground text-background text-sm sm:text-base font-medium hover:bg-foreground/90 active:scale-95 transition-all"
          >
            View My Work
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </a>
        </div>

        <p className="mt-8 text-xs text-muted/30 hero-text-reveal" style={{ animationDelay: '1s' }}>
          移动鼠标 / 悬停文字 / 点击任意位置
        </p>
      </div>
    </section>
  );
}
