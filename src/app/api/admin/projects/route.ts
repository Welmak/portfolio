import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-auth'
import { getSupabaseAdmin } from '@/lib/supabase/client'

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export async function GET(req: NextRequest) {
  if (!(await isAuthenticated())) return unauthorized()
  try {
    const supabase = getSupabaseAdmin()
    const { data } = await supabase.from('projects').select('*').order('sort_order', { ascending: true })
    return NextResponse.json(data || [])
  } catch {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) return unauthorized()
  try {
    const supabase = getSupabaseAdmin()
    const body = await req.json()
    const { data, error } = await supabase.from('projects').insert({
      title: body.title,
      category: body.category,
      year: body.year,
      description: body.description,
      image_url: body.image_url,
      video_url: body.video_url || null,
      slug: body.slug || null,
      link: body.link || '#',
      color: body.color || '#06b6d4',
      sort_order: body.sort_order || 0,
      content: body.content || [],
    }).select().single()
    if (error) throw error
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAuthenticated())) return unauthorized()
  try {
    const supabase = getSupabaseAdmin()
    const body = await req.json()
    const { data, error } = await supabase.from('projects').update({
      title: body.title,
      category: body.category,
      year: body.year,
      description: body.description,
      image_url: body.image_url,
      video_url: body.video_url || null,
      slug: body.slug || null,
      link: body.link || '#',
      color: body.color || '#06b6d4',
      sort_order: body.sort_order || 0,
      content: body.content || [],
      updated_at: new Date().toISOString(),
    }).eq('id', body.id).select().single()
    if (error) throw error
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await isAuthenticated())) return unauthorized()
  try {
    const supabase = getSupabaseAdmin()
    const { id } = await req.json()
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
