'use server'

import { getSupabaseAdmin } from './client'
import { projects as staticProjects, aboutData, experienceData, siteConfig } from '@/lib/data'
import type { Project } from '@/lib/data'
import type { ContentItem } from '@/lib/content-blocks'

// ---- Projects ----
export async function fetchProjects(): Promise<Project[]> {
  try {
    const supabase = getSupabaseAdmin()
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true })
    if (data && data.length > 0) {
      return data.map((p: any) => ({
        id: p.slug || p.id,
        title: p.title,
        category: p.category,
        year: p.year,
        description: p.description,
        image: p.image_url,
        videoUrl: p.video_url || undefined,
        link: p.link,
        color: p.color || '#06b6d4',
        content: p.content || undefined,
      }))
    }
  } catch { /* fallback to static */ }
  return staticProjects
}

export async function fetchProjectById(id: string): Promise<Project | null> {
  try {
    const supabase = getSupabaseAdmin()
    // Try by slug first, then by UUID
    let { data } = await supabase.from('projects').select('*').eq('slug', id).single()
    if (!data) {
      const res = await supabase.from('projects').select('*').eq('id', id).single()
      data = res.data
    }
    if (data) {
      return {
        id: data.slug || data.id,
        title: data.title,
        category: data.category,
        year: data.year,
        description: data.description,
        image: data.image_url,
        videoUrl: data.video_url || undefined,
        link: data.link,
        color: data.color || '#06b6d4',
        content: data.content || undefined,
      }
    }
  } catch { /* fallback */ }
  return staticProjects.find(p => p.id === id) || null
}

// ---- About ----
export async function fetchAbout(): Promise<typeof aboutData & { clientComment?: string }> {
  try {
    const supabase = getSupabaseAdmin()
    const { data } = await supabase.from('about').select('*')
    if (data && data.length > 0) {
      const result: any = { ...aboutData }
      for (const row of data) {
        switch (row.content_key) {
          case 'subtitle': result.subtitle = row.content_value; break
          case 'title': result.title = row.content_value; break
          case 'paragraph_0': result.paragraphs[0] = row.content_value; break
          case 'paragraph_1': result.paragraphs[1] = row.content_value; break
          case 'paragraph_2': result.paragraphs[2] = row.content_value; break
          case 'paragraph_3': result.paragraphs[3] = row.content_value; break
        }
      }
      return result
    }
  } catch { /* fallback */ }
  return { ...aboutData }
}

// ---- Experience ----
export async function fetchExperience(): Promise<typeof experienceData> {
  try {
    const supabase = getSupabaseAdmin()
    const { data } = await supabase.from('experience').select('*').order('sort_order')
    if (data && data.length > 0) {
      return {
        subtitle: experienceData.subtitle,
        title: experienceData.title,
        jobs: data.map((e: any) => ({
          role: e.role,
          company: e.company,
          period: e.period,
          highlights: e.highlights || [],
        })),
      }
    }
  } catch { /* fallback */ }
  return experienceData
}

// ---- Site Config ----
export async function fetchSiteConfig() {
  return siteConfig
}
