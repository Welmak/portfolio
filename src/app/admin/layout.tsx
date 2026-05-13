'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

const sidebarLinks = [
  { href: '/admin', label: 'Dashboard', icon: '⌂' },
  { href: '/admin/projects', label: 'Projects', icon: '▤' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (pathname === '/admin/login') {
      setAuthorized(true)
      setLoading(false)
      return
    }
    fetch('/api/admin/check')
      .then(r => { if (r.ok) setAuthorized(true); else router.push('/admin/login') })
      .catch(() => router.push('/admin/login'))
      .finally(() => setLoading(false))
  }, [pathname, router])

  function handleLogout() {
    fetch('/api/admin/logout', { method: 'POST' }).then(() => router.push('/admin/login'))
  }

  if (pathname === '/admin/login') return <>{children}</>
  if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500">Loading...</div>
  if (!authorized) return null

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-56 border-r border-zinc-800 flex flex-col">
        <div className="p-5 border-b border-zinc-800">
          <Link href="/admin" className="text-lg font-semibold tracking-tight">Portfolio Admin</Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                pathname === link.href ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <span>{link.icon}</span> {link.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-zinc-800">
          <button onClick={handleLogout} className="text-sm text-zinc-500 hover:text-white transition-colors w-full text-left px-3 py-2">
            ← Sign Out
          </button>
        </div>
      </aside>
      {/* Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-5xl">{children}</div>
      </main>
    </div>
  )
}
