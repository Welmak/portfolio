import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/client'
import { projects as staticProjects } from '@/lib/data'

export async function GET() {
  try {
    const supabase = getSupabaseAdmin()
    const { data } = await supabase.from('projects').select('*').order('sort_order', { ascending: true })
    if (data && data.length > 0) {
      return NextResponse.json(data.map((p: any) => ({
        id: p.slug || p.id,
        title: p.title,
        category: p.category,
        year: p.year,
        description: p.description,
        image: p.image_url,
        video_url: p.video_url || null,
        color: p.color || '#06b6d4',
        content: p.content || undefined,
      })))
    }
  } catch {}
  return NextResponse.json(staticProjects.map(p => ({
    id: p.id,
    title: p.title,
    category: p.category,
    year: p.year,
    description: p.description,
    image: p.image,
    video_url: p.videoUrl || null,
    color: p.color,
    content: p.content || undefined,
  })))
}
