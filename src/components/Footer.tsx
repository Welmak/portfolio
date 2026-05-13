import { siteConfig } from '@/lib/data';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="py-16 sm:py-20 px-6 border-t border-border/30">
      <div className="max-w-3xl mx-auto text-center">
        {/* Design quote */}
        <blockquote className="mb-10">
          <p className="text-xl sm:text-2xl md:text-3xl font-light italic text-muted leading-relaxed tracking-tight">
            &ldquo;好设计不仅好看，更能创造商业价值。&rdquo;
          </p>
          <cite className="block mt-4 text-sm text-muted not-italic">
            — {siteConfig.nameCN} · Brand Designer
          </cite>
        </blockquote>

        <div className="section-divider mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-muted">
          <span>© {year} {siteConfig.name}. All rights reserved.</span>
          <span className="hidden sm:inline">·</span>
          <a href={`mailto:${siteConfig.email}`} className="hover:text-foreground transition-colors">{siteConfig.email}</a>
        </div>
      </div>
    </footer>
  );
}
