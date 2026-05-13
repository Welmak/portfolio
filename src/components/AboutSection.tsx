'use client';

import { aboutData } from '@/lib/data';
import ScrollReveal from './ScrollReveal';

export default function AboutSection() {
  return (
    <section id="about" className="py-24 sm:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <ScrollReveal>
            <p className="text-muted text-sm tracking-[0.2em] uppercase mb-4">{aboutData.subtitle}</p>
            <h2 className="font-bold tracking-tight">
              <span className="text-xl sm:text-2xl md:text-3xl text-muted font-semibold">品牌设计师</span>
              <span className="block text-3xl sm:text-4xl md:text-5xl text-foreground mt-3">跨境视觉专家</span>
            </h2>
          </ScrollReveal>

          <div>
            {aboutData.paragraphs.map((p, i) => (
              <ScrollReveal key={i} delay={i * 0.08}>
                <p className="text-lg text-muted leading-relaxed mb-6">{p}</p>
              </ScrollReveal>
            ))}

            <ScrollReveal delay={0.3}>
              <div className="flex flex-wrap gap-2.5 mt-10">
                {aboutData.skills.map((skill) => (
                  <span key={skill} className="skill-tag inline-block px-4 py-2 text-sm rounded-full bg-card-bg border border-border/50 cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-24">
        <div className="section-divider" />
      </div>
    </section>
  );
}
