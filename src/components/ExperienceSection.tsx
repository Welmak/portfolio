'use client';

import { experienceData, aboutData } from '@/lib/data';
import ScrollReveal from './ScrollReveal';

export default function ExperienceSection() {
  return (
    <section id="experience" className="py-24 sm:py-32 px-6 bg-card-bg/50">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="mb-16 sm:mb-20">
            <p className="text-muted text-sm tracking-[0.2em] uppercase mb-4">{experienceData.subtitle}</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">{experienceData.title}</h2>
          </div>
        </ScrollReveal>

        <div className="space-y-16">
          {experienceData.jobs.map((job, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6 lg:gap-12">
                <div><p className="text-sm text-muted font-medium mb-1">{job.period}</p></div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold tracking-tight mb-1">{job.role}</h3>
                  <p className="text-base text-accent font-medium mb-5">{job.company}</p>
                  <ul className="space-y-2.5">
                    {job.highlights.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-muted">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent/40 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ScrollReveal>
          ))}

          <div className="section-divider" />

          <ScrollReveal>
            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6 lg:gap-12">
              <div><p className="text-sm text-muted font-medium mb-1">Education</p></div>
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold tracking-tight mb-1">{aboutData.education.school}</h3>
                <p className="text-base text-muted">{aboutData.education.degree}</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
