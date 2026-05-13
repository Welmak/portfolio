'use client';

import { useState, useRef, useEffect } from 'react';
import type { ContentItem } from '@/lib/content-blocks';

export default function ContentRenderer({ content }: { content: ContentItem[] }) {
  if (!content || content.length === 0) return null;

  const items = content.filter(c => {
    if (c.type === 'image' || c.type === 'video' || c.type === 'video_file') return c.value?.trim();
    if (c.type === 'heading' || c.type === 'text') return c.value?.trim();
    return false;
  });

  if (items.length === 0) return null;

  return (
    <div className="space-y-10 sm:space-y-14">
      {items.map((item, i) => {
        switch (item.type) {
          case 'heading':
            return (
              <h2 key={i} className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight pt-4">
                {item.value}
              </h2>
            );
          case 'text':
            return (
              <p key={i} className="text-base sm:text-lg leading-relaxed text-muted whitespace-pre-wrap">
                {item.value}
              </p>
            );
          case 'image':
            if (!item.value) return null;
            return (
              <figure key={i} className="overflow-hidden rounded-xl sm:rounded-2xl bg-card-bg">
                <BlurImage
                  src={item.value}
                  alt={item.caption || ''}
                  className="w-full object-contain"
                  style={{ maxHeight: '80vh', display: 'block' }}
                />
                {item.caption && (
                  <figcaption className="text-sm text-muted text-center py-3">{item.caption}</figcaption>
                )}
              </figure>
            );
          case 'video':
            if (!item.value) return null;
            return (
              <figure key={i}>
                <div className="aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-card-bg shadow-md">
                  <iframe src={item.value} className="w-full h-full" allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
                </div>
                {item.caption && (
                  <figcaption className="text-sm text-muted text-center mt-3">{item.caption}</figcaption>
                )}
              </figure>
            );
          case 'video_file':
            if (!item.value) return null;
            return (
              <figure key={i} className="overflow-hidden rounded-xl sm:rounded-2xl bg-card-bg">
                <video
                  src={item.value}
                  controls
                  muted
                  loop
                  playsInline
                  className="w-full max-h-[70vh]"
                  style={{ display: 'block' }}
                />
                {item.caption && (
                  <figcaption className="text-sm text-muted text-center py-3">{item.caption}</figcaption>
                )}
              </figure>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

function BlurImage({ src, alt, className, style }: { src: string; alt: string; className: string; style?: React.CSSProperties }) {
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
      style={style}
      className={`${className} ${loaded ? 'loaded' : ''}`}
      loading="lazy"
      onLoad={() => setLoaded(true)}
    />
  );
}
