'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { ContentItem } from '@/lib/content-blocks'
import { emptyContentItem } from '@/lib/content-blocks'
import ContentRenderer from '@/components/ContentRenderer'

interface Project {
  id: string; title: string; category: string; year: string
  description: string; image_url: string; video_url?: string; slug?: string
  link: string; color: string; sort_order: number
  content?: ContentItem[]
}

const IMG_EXTS = ['jpg','jpeg','png','gif','webp','svg']
const VID_EXTS = ['mp4','webm','mov','avi','mkv']

function slugify(t: string) { return t.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-').replace(/^-+|-+$/g, '') || 'project' }
function isVideoFile(name: string) { return VID_EXTS.includes(name.split('.').pop()?.toLowerCase() || '') }

// ─── Simple content preview renderer (light background for admin) ───
function ContentPreview({ content }: { content: ContentItem[] }) {
  const items = content.filter(c => {
    if (c.type === 'image' || c.type === 'video' || c.type === 'video_file') return c.value?.trim()
    if (c.type === 'heading' || c.type === 'text') return c.value?.trim()
    return false
  })
  if (items.length === 0) return <p className="text-zinc-500 text-sm text-center py-12">暂无内容块，添加后此处可预览</p>

  return (
    <div className="space-y-8">
      {items.map((item, i) => {
        switch (item.type) {
          case 'heading':
            return <h2 key={i} className="text-xl sm:text-2xl font-bold tracking-tight text-white">{item.value}</h2>
          case 'text':
            return <p key={i} className="text-sm sm:text-base leading-relaxed text-zinc-300 whitespace-pre-wrap">{item.value}</p>
          case 'image':
            return item.value ? (
              <figure key={i}>
                <img src={item.value} alt={item.caption || ''} className="w-full rounded-xl" />
                {item.caption && <figcaption className="text-xs text-zinc-500 text-center mt-3">{item.caption}</figcaption>}
              </figure>
            ) : null
          case 'video':
            return item.value ? (
              <figure key={i}>
                <div className="aspect-video rounded-xl overflow-hidden bg-zinc-950">
                  <iframe src={item.value} className="w-full h-full" allowFullScreen />
                </div>
                {item.caption && <figcaption className="text-xs text-zinc-500 text-center mt-3">{item.caption}</figcaption>}
              </figure>
            ) : null
          case 'video_file':
            return item.value ? (
              <figure key={i}>
                <video src={item.value} controls muted loop playsInline className="w-full rounded-xl bg-zinc-950" />
                {item.caption && <figcaption className="text-xs text-zinc-500 text-center mt-3">{item.caption}</figcaption>}
              </figure>
            ) : null
          default:
            return null
        }
      })}
    </div>
  )
}

export default function AdminProjectsPage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // form
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [year, setYear] = useState('')
  const [desc, setDesc] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [coverVideoUrl, setCoverVideoUrl] = useState('')
  const [coverPreviewType, setCoverPreviewType] = useState<'image' | 'video'>('image')
  const [slug, setSlug] = useState('')
  const [color, setColor] = useState('#06b6d4')
  const [sort, setSort] = useState(0)
  const [content, setContent] = useState<ContentItem[]>([])
  const [previewMode, setPreviewMode] = useState(false)

  const [uploading, setUploading] = useState<string | null>(null)

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/admin/projects')
      const data = await res.json()
      if (Array.isArray(data)) setProjects(data)
    } catch {}
    setLoading(false)
  }
  useEffect(() => { fetchProjects() }, [])

  function resetForm() {
    setTitle(''); setCategory(''); setYear(''); setDesc('')
    setCoverUrl(''); setCoverVideoUrl(''); setCoverPreviewType('image')
    setSlug(''); setColor('#06b6d4'); setSort(projects.length); setContent([])
    setPreviewMode(false)
  }

  function openNew() { resetForm(); setEditingId('new') }
  function openEdit(p: Project) {
    setTitle(p.title); setCategory(p.category); setYear(p.year)
    setDesc(p.description)
    setCoverUrl(p.image_url); setCoverVideoUrl(p.video_url || '')
    setCoverPreviewType(p.video_url ? 'video' : 'image')
    setSlug(p.slug || ''); setColor(p.color); setSort(p.sort_order)
    setContent(Array.isArray(p.content) ? p.content : [])
    setPreviewMode(false)
    setEditingId(p.id)
  }
  function cancel() { setEditingId(null) }

  async function doUpload(file: File): Promise<string> {
    const fd = new FormData(); fd.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (data.url) return data.url
    throw new Error(data.error || 'Upload failed')
  }

  function updateContentItem(idx: number, patch: Partial<ContentItem>) {
    setContent(prev => prev.map((c, i) => i === idx ? { ...c, ...patch } : c))
  }
  function removeContentItem(idx: number) { setContent(prev => prev.filter((_, i) => i !== idx)) }
  function moveContentItem(idx: number, dir: -1 | 1) {
    const n = idx + dir; if (n < 0 || n >= content.length) return
    setContent(prev => { const a = [...prev]; [a[idx], a[n]] = [a[n], a[idx]]; return a })
  }

  async function handleSave() {
    if (!title.trim()) return alert('请输入标题')
    setSaving(true)
    const body: any = { title, category, year, description: desc, image_url: coverUrl, video_url: coverVideoUrl || null, slug: slug || slugify(title), link: '#', color, sort_order: sort, content }
    const method = editingId === 'new' ? 'POST' : 'PUT'
    if (editingId !== 'new') body.id = editingId
    const res = await fetch('/api/admin/projects', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (res.ok) { cancel(); fetchProjects(); router.refresh() }
    else { const d = await res.json().catch(() => ({})); alert('Save failed: ' + (d.error || 'Unknown error')) }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this project?')) return
    await fetch('/api/admin/projects', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    fetchProjects(); router.refresh()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-2xl font-semibold mb-1">Projects</h1><p className="text-zinc-500 text-sm">{projects.length} projects</p></div>
        {!editingId && <button onClick={openNew} className="px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-zinc-200 transition-colors">+ New Project</button>}
      </div>

      {/* ═══════ EDITOR ═══════ */}
      {editingId && (
        <div className="bg-zinc-900 rounded-xl p-6 mb-8 space-y-8">
          <h2 className="text-lg font-semibold">{editingId === 'new' ? 'New Project' : 'Edit Project'}</h2>

          {/* ── SECTION A: Basic Info + Cover ── */}
          <div className="bg-zinc-800/50 rounded-xl p-5 space-y-4 border border-zinc-800">
            <h3 className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-zinc-700 flex items-center justify-center text-xs">1</span>
              Basic Info & Cover（图片或视频）
            </h3>

            {/* Unified Cover Upload */}
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0">
                {coverPreviewType === 'video' && coverVideoUrl ? (
                  <div className="relative group w-40 h-28">
                    <video src={coverVideoUrl} className="w-full h-full object-cover rounded-lg bg-zinc-950" muted />
                    <button onClick={() => { setCoverVideoUrl(''); setCoverPreviewType(coverUrl ? 'image' : 'image') }}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">✕</button>
                  </div>
                ) : coverUrl ? (
                  <div className="relative group w-40 h-28">
                    <img src={coverUrl} className="w-full h-full object-cover rounded-lg" alt="cover" />
                    <button onClick={() => { setCoverUrl(''); setCoverPreviewType(coverVideoUrl ? 'video' : 'image') }}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">✕</button>
                  </div>
                ) : (
                  <button
                    onClick={async () => {
                      const input = fileRef.current; if (!input) return
                      setUploading('cover')
                      input.onchange = async (e: any) => {
                        const f = e.target.files?.[0]; if (!f) { setUploading(null); return }
                        try {
                          const url = await doUpload(f)
                          if (isVideoFile(f.name)) { setCoverVideoUrl(url); setCoverPreviewType('video') }
                          else { setCoverUrl(url); setCoverPreviewType('image') }
                        } catch (err: any) { alert(err.message) }
                        setUploading(null)
                      }
                      input.click()
                    }}
                    disabled={uploading === 'cover'}
                    className="w-40 h-28 border-2 border-dashed border-zinc-600 rounded-lg flex flex-col items-center justify-center text-sm text-zinc-500 hover:border-zinc-500 transition-colors disabled:opacity-50"
                  >
                    {uploading === 'cover' ? <span className="text-xs">Uploading...</span> : <><span className="text-2xl mb-1">🖼🎥</span><span className="text-xs">Upload Cover</span></>}
                  </button>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-xs text-zinc-500">Cover Image URL</label>
                <input value={coverUrl} onChange={e => setCoverUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-xs focus:outline-none focus:border-zinc-600 font-mono" placeholder="https://..." />
                <label className="text-xs text-zinc-500">Cover Video URL (optional, 3–5s micro video)</label>
                <input value={coverVideoUrl} onChange={e => setCoverVideoUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-xs focus:outline-none focus:border-zinc-600 font-mono" placeholder="https://... or /uploads/video.mp4" />
                <p className="text-[10px] text-zinc-600">Upload accepts images & videos — type auto-detected. Card shows video on hover if set.</p>
              </div>
            </div>

            {/* Title + slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-zinc-500">Title *</label>
                <input value={title} onChange={e => { setTitle(e.target.value); if (!slug) setSlug(slugify(e.target.value)) }}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-zinc-600" placeholder="Project Title" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-zinc-500">URL Slug</label>
                <input value={slug} onChange={e => setSlug(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-zinc-600 font-mono" placeholder="auto-generated" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-zinc-500">Category</label>
                <input value={category} onChange={e => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-zinc-600" placeholder="Brand Identity" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-zinc-500">Year</label>
                <input value={year} onChange={e => setYear(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-zinc-600" placeholder="2024" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-zinc-500">Color</label>
                <div className="flex gap-2">
                  <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-9 h-9 rounded cursor-pointer bg-transparent border-0 p-0" />
                  <input value={color} onChange={e => setColor(e.target.value)} className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-xs focus:outline-none focus:border-zinc-600 font-mono" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-zinc-500">Sort Order</label>
                <input type="number" value={sort} onChange={e => setSort(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-zinc-600" />
              </div>
            </div>

            {/* Short description */}
            <div className="space-y-1">
              <label className="text-xs text-zinc-500">Short Description (shown on card)</label>
              <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-zinc-600 resize-none" placeholder="Brief project summary..." />
            </div>
          </div>

          {/* ── SECTION B: Content Blocks ── */}
          <div className="bg-zinc-800/50 rounded-xl p-5 space-y-4 border border-zinc-800">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-zinc-700 flex items-center justify-center text-xs">2</span>
                Content Layout
              </h3>
              {content.length > 0 && (
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    previewMode
                      ? 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                      : 'bg-white/10 text-zinc-400 hover:bg-white/20'
                  }`}
                >
                  {previewMode ? '✎ Edit' : '👁 Preview'}
                </button>
              )}
            </div>

            {previewMode ? (
              <div className="bg-zinc-950 rounded-xl p-6 border border-zinc-800 max-h-[70vh] overflow-auto">
                <ContentPreview content={content} />
              </div>
            ) : (
              <>
                {content.length === 0 && (
                  <div className="text-center py-8 border border-dashed border-zinc-700 rounded-lg text-zinc-500 text-sm">
                    <p className="mb-3">No content blocks yet</p>
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      {(['heading', 'text', 'image', 'video', 'video_file'] as const).map(t => (
                        <button key={t} onClick={() => setContent([...content, emptyContentItem(t)])}
                          className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-xs hover:bg-zinc-700 transition-colors">
                          + {t === 'heading' ? 'Heading' : t === 'text' ? 'Text' : t === 'image' ? 'Image' : t === 'video_file' ? 'Upload Video' : 'Video Embed'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {content.map((item, idx) => (
                  <div key={idx} className="bg-zinc-800 rounded-lg p-4 border border-zinc-700 group">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-zinc-500 font-mono uppercase">
                        {item.type === 'heading' ? '📌 Heading' : item.type === 'text' ? '📝 Text' : item.type === 'image' ? '🖼 Image' : item.type === 'video_file' ? '🎥 Uploaded Video' : '🎬 Video Embed'}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => moveContentItem(idx, -1)} disabled={idx === 0} className="px-1.5 py-0.5 bg-zinc-700 rounded text-xs hover:bg-zinc-600 disabled:opacity-30">↑</button>
                        <button onClick={() => moveContentItem(idx, 1)} disabled={idx === content.length - 1} className="px-1.5 py-0.5 bg-zinc-700 rounded text-xs hover:bg-zinc-600 disabled:opacity-30">↓</button>
                        <button onClick={() => removeContentItem(idx)} className="px-1.5 py-0.5 bg-red-900/30 text-red-400 rounded text-xs hover:bg-red-900/50">✕</button>
                      </div>
                    </div>

                    {(item.type === 'heading' || item.type === 'text') && (
                      item.type === 'heading'
                        ? <input value={item.value} onChange={e => updateContentItem(idx, { value: e.target.value })}
                            placeholder="Heading" className="w-full bg-transparent text-lg font-semibold focus:outline-none text-white placeholder:text-zinc-600" />
                        : <textarea value={item.value} onChange={e => updateContentItem(idx, { value: e.target.value })}
                            placeholder="Body text" rows={3} className="w-full bg-transparent text-sm focus:outline-none text-white placeholder:text-zinc-600 resize-none" />
                    )}

                    {item.type === 'image' && (
                      <div className="space-y-3">
                        {item.value ? (
                          <img src={item.value} className="w-full max-h-48 object-contain rounded-lg bg-zinc-900" alt="" />
                        ) : (
                          <button
                            onClick={async () => {
                              const input = fileRef.current; if (!input) return
                              setUploading('content-' + idx)
                              input.onchange = async (e: any) => {
                                const f = e.target.files?.[0]; if (!f) { setUploading(null); return }
                                try { const url = await doUpload(f); updateContentItem(idx, { value: url }) } catch (err: any) { alert(err.message) }
                                setUploading(null)
                              }
                              input.click()
                            }}
                            disabled={typeof uploading === 'string' && uploading.startsWith('content-')}
                            className="w-full py-10 border-2 border-dashed border-zinc-600 rounded-lg text-sm text-zinc-500 hover:border-zinc-500 transition-colors disabled:opacity-50"
                          >
                            {uploading === 'content-' + idx ? '⏳ Uploading...' : '📷 Click to upload image'}
                          </button>
                        )}
                        <input value={item.value} onChange={e => updateContentItem(idx, { value: e.target.value })}
                          placeholder="or paste image URL" className="w-full px-3 py-2 bg-zinc-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-zinc-600 font-mono" />
                        <input value={item.caption || ''} onChange={e => updateContentItem(idx, { caption: e.target.value })}
                          placeholder="Image caption (optional)" className="w-full px-3 py-1.5 bg-zinc-800 rounded text-xs focus:outline-none focus:ring-1 focus:ring-zinc-600" />
                      </div>
                    )}

                    {item.type === 'video' && (
                      <div className="space-y-3">
                        <input value={item.value} onChange={e => updateContentItem(idx, { value: e.target.value })}
                          placeholder="YouTube / Vimeo embed URL" className="w-full px-3 py-2 bg-zinc-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-zinc-600 font-mono" />
                        {item.value && (
                          <div className="aspect-video rounded-lg overflow-hidden bg-zinc-950">
                            <iframe src={item.value} className="w-full h-full" allowFullScreen />
                          </div>
                        )}
                        <input value={item.caption || ''} onChange={e => updateContentItem(idx, { caption: e.target.value })}
                          placeholder="Video caption (optional)" className="w-full px-3 py-1.5 bg-zinc-800 rounded text-xs focus:outline-none focus:ring-1 focus:ring-zinc-600" />
                      </div>
                    )}

                    {item.type === 'video_file' && (
                      <div className="space-y-3">
                        {item.value ? (
                          <video src={item.value} controls className="w-full max-h-64 rounded-lg bg-zinc-950" />
                        ) : (
                          <button
                            onClick={async () => {
                              const input = fileRef.current; if (!input) return
                              setUploading('content-' + idx)
                              input.onchange = async (e: any) => {
                                const f = e.target.files?.[0]; if (!f) { setUploading(null); return }
                                try { const url = await doUpload(f); updateContentItem(idx, { value: url }) } catch (err: any) { alert(err.message) }
                                setUploading(null)
                              }
                              input.click()
                            }}
                            disabled={typeof uploading === 'string' && uploading.startsWith('content-')}
                            className="w-full py-10 border-2 border-dashed border-zinc-600 rounded-lg text-sm text-zinc-500 hover:border-zinc-500 transition-colors disabled:opacity-50"
                          >
                            {uploading === 'content-' + idx ? '⏳ Uploading...' : '🎥 Click to upload video (MP4, WebM)'}
                          </button>
                        )}
                        <input value={item.value} onChange={e => updateContentItem(idx, { value: e.target.value })}
                          placeholder="or paste video URL" className="w-full px-3 py-2 bg-zinc-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-zinc-600 font-mono" />
                        <input value={item.caption || ''} onChange={e => updateContentItem(idx, { caption: e.target.value })}
                          placeholder="Video caption (optional)" className="w-full px-3 py-1.5 bg-zinc-800 rounded text-xs focus:outline-none focus:ring-1 focus:ring-zinc-600" />
                      </div>
                    )}
                  </div>
                ))}

                {content.length > 0 && (
                  <div className="flex items-center gap-2 pt-2 flex-wrap">
                    {(['heading', 'text', 'image', 'video', 'video_file'] as const).map(t => (
                      <button key={t} onClick={() => setContent([...content, emptyContentItem(t)])}
                        className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-xs hover:bg-zinc-700 transition-colors">
                        + {t === 'heading' ? 'Heading' : t === 'text' ? 'Text' : t === 'image' ? 'Image' : t === 'video_file' ? 'Upload Video' : 'Video Embed'}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* ── ACTIONS ── */}
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving || !title.trim()}
              className="px-8 py-2.5 bg-white text-black text-sm font-medium rounded-lg hover:bg-zinc-200 disabled:opacity-50 transition-colors">
              {saving ? 'Saving...' : editingId === 'new' ? 'Publish Project' : 'Save Changes'}
            </button>
            <button onClick={cancel} className="px-6 py-2.5 bg-zinc-800 text-zinc-400 text-sm rounded-lg hover:bg-zinc-700 transition-colors">Cancel</button>
          </div>
        </div>
      )}

      <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" />

      {/* ═══════ PROJECT LIST ═══════ */}
      {!editingId && (
        loading ? <p className="text-zinc-500 text-sm">Loading...</p>
        : projects.length === 0 ? (
          <div className="text-center py-16 text-zinc-500">
            <p className="text-lg mb-2">No projects yet</p>
            <button onClick={openNew} className="text-sm text-accent hover:underline">Create your first project</button>
          </div>
        ) : (
          <div className="space-y-2">
            {projects.map(p => (
              <div key={p.id} className="flex items-center gap-4 bg-zinc-900 rounded-xl p-4 hover:bg-zinc-800/50 transition-colors">
                {p.image_url && <img src={p.image_url} className="w-16 h-12 object-cover rounded-lg flex-shrink-0" alt="" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.title}</p>
                  <p className="text-xs text-zinc-500">{p.category} · {p.year} · {p.slug || 'no slug'}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(p)} className="px-3 py-1.5 bg-zinc-800 text-xs rounded-lg hover:bg-zinc-700 transition-colors">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="px-3 py-1.5 bg-red-900/30 text-red-400 text-xs rounded-lg hover:bg-red-900/50 transition-colors">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}
