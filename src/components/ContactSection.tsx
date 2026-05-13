'use client';

import { useState, FormEvent } from 'react';
import { siteConfig } from '@/lib/data';
import ScrollReveal from './ScrollReveal';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (res.ok) { setStatus('sent'); setForm({ name: '', email: '', message: '' }); }
      else setStatus('error');
    } catch { setStatus('error'); }
  }

  return (
    <section id="contact" className="py-24 sm:py-32 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <ScrollReveal>
          <p className="text-muted text-sm tracking-[0.2em] uppercase mb-4">Get in Touch</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">Let&apos;s work together</h2>
          <p className="text-lg text-muted leading-relaxed mb-12 max-w-xl mx-auto">
            Have a project in mind? I&apos;d love to hear about it. Drop me a message.
          </p>
        </ScrollReveal>

        {status === 'sent' ? (
          <div className="py-16 text-center">
            <p className="text-2xl font-semibold mb-3">Thanks! 🎉</p>
            <p className="text-muted">I&apos;ll get back to you soon.</p>
            <button onClick={() => setStatus('idle')} className="mt-8 text-sm text-accent hover:underline">Send another message</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-5 text-left">
            {['Name', 'Email', 'Message'].map((label, i) => {
              const key = label.toLowerCase() as keyof typeof form;
              const isTextarea = label === 'Message';
              const Comp = isTextarea ? 'textarea' : 'input';
              return (
                <ScrollReveal key={label} delay={i * 0.06}>
                  <label className="block text-sm text-muted mb-2">{label}{label === 'Email' || label === 'Message' ? ' *' : ''}</label>
                  <Comp
                    type={isTextarea ? undefined : key === 'email' ? 'email' : 'text'}
                    required={key === 'email' || key === 'message'}
                    rows={isTextarea ? 4 : undefined}
                    value={form[key]}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm resize-none"
                    placeholder={label === 'Name' ? 'Your name' : label === 'Email' ? 'you@email.com' : 'Tell me about your project...'}
                  />
                </ScrollReveal>
              );
            })}
            <ScrollReveal delay={0.2}>
              <button type="submit" disabled={status === 'sending'}
                className="w-full py-3 rounded-full bg-foreground text-background font-medium hover:bg-foreground/90 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50">
                {status === 'sending' ? 'Sending...' : 'Send Message'}
              </button>
            </ScrollReveal>
            {status === 'error' && <p className="text-sm text-red-500 text-center">Something went wrong. Try emailing directly: {siteConfig.email}</p>}
          </form>
        )}

        <ScrollReveal>
          <div className="flex items-center justify-center gap-6 mt-16">
            <a href={`mailto:${siteConfig.email}`} className="text-sm text-muted hover:text-foreground transition-colors">{siteConfig.email}</a>
            {Object.entries(siteConfig.social).filter(([,u]) => u).map(([platform, url]) => (
              <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-muted hover:text-foreground transition-colors capitalize">{platform}</a>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
