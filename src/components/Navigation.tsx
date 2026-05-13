'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, Moon, Sun, ArrowUpRight } from 'lucide-react';
import { useTheme } from 'next-themes';
import * as Dialog from '@radix-ui/react-dialog';
import { siteConfig } from '@/lib/data';

const navLinks = [
  { href: '#work', label: '作品集' },
  { href: '#about', label: '关于我' },
  { href: '#experience', label: '经历' },
  { href: '#contact', label: '联系' },
];

export default function Navigation() {
  const [activeSection, setActiveSection] = useState('#work');
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      const sections = ['work', 'about', 'experience', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(`#${section}`);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get initials from name
  const initials = siteConfig.name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <nav className="mx-auto max-w-5xl">
        {/* Desktop Navigation - Floating Pill */}
        <div className="hidden md:flex items-center justify-between bg-secondary/80 backdrop-blur-xl rounded-full px-3 py-2 shadow-lg shadow-black/5 dark:shadow-black/20">
          {/* Left - Avatar & Name */}
          <Link href="/" className="flex items-center gap-3 pl-1 transition-opacity hover:opacity-70">
            <div className="flex items-center justify-center h-9 w-9 rounded-full bg-muted text-muted-foreground text-xs font-medium">
              {initials}
            </div>
            <span className="text-sm font-semibold tracking-tight text-foreground uppercase">
              {siteConfig.name}
            </span>
          </Link>

          {/* Center - Navigation Links */}
          <div className="flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
                {activeSection === link.href && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-foreground rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Right - Theme Toggle & CTA */}
          <div className="flex items-center gap-2">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-foreground/5 transition-colors"
                aria-label="切换主题"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>
            )}
            <Link
              href="#contact"
              className="inline-flex items-center gap-1.5 rounded-full px-5 h-9 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 transition-colors"
            >
              联系我
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center justify-between bg-secondary/80 backdrop-blur-xl rounded-full px-3 py-2 shadow-lg shadow-black/5 dark:shadow-black/20">
          {/* Left - Avatar & Name */}
          <Link href="/" className="flex items-center gap-2 pl-1">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-muted-foreground text-xs font-medium">
              {initials}
            </div>
            <span className="text-sm font-semibold tracking-tight text-foreground uppercase">
              {siteConfig.name}
            </span>
          </Link>

          {/* Right - Theme Toggle & Menu */}
          <div className="flex items-center gap-1">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-foreground/5 transition-colors"
                aria-label="切换主题"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>
            )}

            <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
              <Dialog.Trigger asChild>
                <button className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-foreground/5 transition-colors">
                  <Menu className="h-5 w-5" />
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50" />
                <Dialog.Content className="fixed right-0 top-0 h-full w-80 bg-background border-l border-border z-50 p-6 pt-8 animate-in slide-in-from-right">
                  <Dialog.Title className="sr-only">导航菜单</Dialog.Title>
                  <Dialog.Description className="sr-only">网站导航链接</Dialog.Description>
                  <div className="flex flex-col gap-6 mt-8">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="text-lg font-medium text-foreground transition-colors hover:text-accent"
                      >
                        {link.label}
                      </Link>
                    ))}
                    <Link
                      href="#contact"
                      onClick={() => setIsOpen(false)}
                      className="inline-flex items-center gap-2 text-lg font-medium text-accent"
                    >
                      联系我
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <Dialog.Close asChild>
                    <button className="absolute top-4 right-4 flex items-center justify-center h-8 w-8 rounded-full hover:bg-foreground/5 transition-colors" aria-label="关闭菜单">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </Dialog.Close>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>
      </nav>
    </header>
  );
}
