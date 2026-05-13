'use client';

import { useEffect, useState } from 'react';

const texts = ['DESIGN', 'BRAND', 'VISUAL', 'STORY'];

export default function WatermarkParallax() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {texts.map((text, i) => {
        const yOffset = -scrollY * (0.06 + i * 0.025);
        const xBase = i % 2 === 0 ? '5%' : '55%';
        const topBase = 15 + i * 22;
        return (
          <span
            key={text}
            className="watermark-text"
            style={{
              left: xBase,
              top: `${topBase}%`,
              transform: `translateY(${yOffset}px)`,
              transition: 'transform 0.15s linear',
            }}
          >
            {text}
          </span>
        );
      })}
    </div>
  );
}
