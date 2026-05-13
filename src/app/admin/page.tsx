'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Project {
  id: string
  title: string
  category: string
  year: string
  image_url: string
  sort_order: number
}

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [deploying, setDeploying] = useState(false)
  const [deployMsg, setDeployMsg] = useState('')

  useEffect(() => {
    fetch('/api/admin/projects')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setProjects(data) })
      .catch(() => {})
  }, [])

  async function handleDeploy() {
    setDeploying(true)
    setDeployMsg('')
    const res = await fetch('/api/admin/deploy', { method: 'POST' })
    const data = await res.json()
    setDeployMsg(data.error || data.message || 'Deploy triggered!')
    setDeploying(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Dashboard</h1>
          <p className="text-zinc-500 text-sm">Manage your portfolio</p>
        </div>
        <button
          onClick={handleDeploy}
          disabled={deploying}
          className="px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-zinc-200 disabled:opacity-50 transition-colors"
        >
          {deploying ? 'Deploying...' : '🚀 Deploy'}
        </button>
      </div>
      {deployMsg && <p className="text-sm text-zinc-400 mb-4">{deployMsg}</p>}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-zinc-900 rounded-xl p-5">
          <p className="text-3xl font-bold mb-1">{projects.length}</p>
          <p className="text-sm text-zinc-500">Projects</p>
        </div>
        <div className="bg-zinc-900 rounded-xl p-5">
          <p className="text-3xl font-bold mb-1">{projects.filter(p => p.image_url).length}</p>
          <p className="text-sm text-zinc-500">With Images</p>
        </div>
      </div>

      {/* Quick links */}
      <div className="bg-zinc-900 rounded-xl p-5">
        <h2 className="text-sm font-medium text-zinc-400 mb-4">Quick Actions</h2>
        <div className="space-y-2">
          <Link href="/admin/projects" className="block px-4 py-3 bg-zinc-800 rounded-lg text-sm hover:bg-zinc-700 transition-colors">
            ✏️ Manage Projects ({projects.length})
          </Link>
          <a href="/" target="_blank" className="block px-4 py-3 bg-zinc-800 rounded-lg text-sm hover:bg-zinc-700 transition-colors">
            👁️ View Site
          </a>
        </div>
      </div>
    </div>
  )
}
