'use client';

import { useEffect, useState, useCallback } from 'react';

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hover, setHover] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Don't show custom cursor on admin pages or touch devices
    if (window.location.pathname.startsWith('/admin')) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    setMounted(true);
    document.documentElement.classList.add('cursor-active');

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });

      // Detect interactive elements under cursor
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (el) {
        const interactive = el.closest('a, button, [role="button"], input, select, textarea, [data-cursor-hover]');
        setHover(!!interactive);
      }
    };

    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    return () => {
      document.documentElement.classList.remove('cursor-active');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={`custom-cursor ${hover ? 'hover' : ''} ${clicking ? 'clicking' : ''}`}
      style={{ left: pos.x, top: pos.y }}
    />
  );
}
