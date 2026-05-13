'use client';

import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number; y: number;
  homeX: number; homeY: number;
  vx: number; vy: number;
  size: number;
  baseOpacity: number;
}

interface Ripple {
  x: number; y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
}

interface Props {
  hoverTarget: { x: number; y: number; w: number; h: number } | null;
  clickPos: { x: number; y: number } | null;
  onConsumeClick: () => void;
}

export default function HeroParticles({ hoverTarget, clickPos, onConsumeClick }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000, prevX: -1000, prevY: -1000 });
  const rafRef = useRef<number>(0);

  const initParticles = useCallback((width: number, height: number) => {
    const count = Math.min(Math.floor((width * height) / 5000), 350);
    const p: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      p.push({
        x, y,
        homeX: x, homeY: y,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2.5 + 0.5,
        baseOpacity: Math.random() * 0.3 + 0.06,
      });
    }
    particlesRef.current = p;
  }, []);

  useEffect(() => {
    if (!clickPos) return;
    const ripple: Ripple = {
      x: clickPos.x, y: clickPos.y,
      radius: 0,
      maxRadius: 300 + Math.random() * 200,
      opacity: 0.6,
    };
    ripplesRef.current.push(ripple);

    particlesRef.current.forEach(p => {
      const dx = p.x - clickPos.x;
      const dy = p.y - clickPos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 350 && dist > 0) {
        const force = (1 - dist / 350) * 8;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }
    });
    onConsumeClick();
  }, [clickPos, onConsumeClick]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(dpr, dpr);
      initParticles(window.innerWidth, window.innerHeight);
    };

    const onMouseMove = (e: MouseEvent) => {
      const m = mouseRef.current;
      m.prevX = m.x; m.prevY = m.y;
      m.x = e.clientX; m.y = e.clientY;
    };

    const onMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000, prevX: -1000, prevY: -1000 };
    };

    const animate = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const mdx = mx - mouseRef.current.prevX;
      const mdy = my - mouseRef.current.prevY;
      const ht = hoverTarget;

      // White gradient background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, '#fbfbfd');
      bgGrad.addColorStop(0.5, '#f5f5f7');
      bgGrad.addColorStop(1, '#fbfbfd');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      particlesRef.current.forEach(p => {
        // Flow toward mouse
        const dx = mx - p.x;
        const dy = my - p.y;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);

        if (distToMouse < 400 && distToMouse > 1) {
          const t = 1 - distToMouse / 400;
          const flowForce = t * t * 0.06;
          p.vx += (dx / distToMouse) * flowForce;
          p.vy += (dy / distToMouse) * flowForce;
          p.vx += mdx * 0.002 * t;
          p.vy += mdy * 0.002 * t;
        }

        // Hover target attraction
        let nearTarget = false;
        if (ht) {
          const tx = ht.x + ht.w / 2;
          const ty = ht.y + ht.h / 2;
          const tdx = tx - p.x;
          const tdy = ty - p.y;
          const tDist = Math.sqrt(tdx * tdx + tdy * tdy);
          if (tDist < ht.w && tDist > 1) {
            nearTarget = true;
            const tf = (1 - tDist / ht.w) * 0.03;
            p.vx += (tdx / tDist) * tf;
            p.vy += (tdy / tDist) * tf;
          }
        }

        // Return home
        const hdx = p.homeX - p.x;
        const hdy = p.homeY - p.y;
        p.vx += hdx * 0.0003;
        p.vy += hdy * 0.0003;

        // Ripple
        ripplesRef.current.forEach(r => {
          const rdx = p.x - r.x;
          const rdy = p.y - r.y;
          const rDist = Math.sqrt(rdx * rdx + rdy * rdy);
          const ringWidth = 30;
          if (rDist > r.radius - ringWidth && rDist < r.radius + ringWidth && rDist > 0) {
            p.vx += (rdx / rDist) * r.opacity * 2;
            p.vy += (rdy / rDist) * r.opacity * 2;
          }
        });

        // Physics
        p.vx *= 0.97;
        p.vy *= 0.97;
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 4) { p.vx = (p.vx / speed) * 4; p.vy = (p.vy / speed) * 4; }
        p.x += p.vx; p.y += p.vy;

        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        // Render — blue particles on white
        const opacity = nearTarget
          ? Math.min(p.baseOpacity + 0.35, 0.7)
          : p.baseOpacity;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = nearTarget
          ? `rgba(139, 92, 246, ${opacity})`
          : `rgba(0, 113, 227, ${opacity})`;
        ctx.fill();

        // Glow
        if (nearTarget || distToMouse < 200) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = nearTarget
            ? `rgba(139, 92, 246, ${opacity * 0.25})`
            : `rgba(0, 113, 227, ${opacity * 0.25})`;
          ctx.fill();
        }
      });

      // Ripples
      ripplesRef.current = ripplesRef.current.filter(r => r.opacity > 0.01);
      ripplesRef.current.forEach(r => {
        r.radius += 3;
        r.opacity -= 0.008;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(139, 92, 246, ${r.opacity})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 113, 227, ${r.opacity * 0.08})`;
        ctx.fill();
      });

      // Mouse glow (subtle, white bg)
      if (mx > -500) {
        const glow = ctx.createRadialGradient(mx, my, 0, mx, my, 200);
        glow.addColorStop(0, 'rgba(0, 113, 227, 0.03)');
        glow.addColorStop(0.4, 'rgba(139, 92, 246, 0.015)');
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.fillRect(mx - 200, my - 200, 400, 400);
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [initParticles, hoverTarget]);

  return <canvas ref={canvasRef} id="hero-canvas" className="absolute inset-0" />;
}
