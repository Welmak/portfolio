import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-auth'
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase/client'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'

    // Validate file type
    const allowedImage = ['jpg','jpeg','png','gif','webp','svg']
    const allowedVideo = ['mp4','webm','mov','avi','mkv']
    const isImage = allowedImage.includes(ext)
    const isVideo = allowedVideo.includes(ext)
    if (!isImage && !isVideo) {
      return NextResponse.json({ error: `Unsupported file type: .${ext}` }, { status: 400 })
    }
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`

    // Try Supabase first
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseAdmin()
        const { data, error } = await supabase.storage
          .from('images')
          .upload(fileName, buffer, { contentType: file.type, upsert: false })

        if (!error && data) {
          const { data: urlData } = supabase.storage.from('images').getPublicUrl(fileName)
          return NextResponse.json({ url: urlData.publicUrl })
        }
        // If bucket doesn't exist, fall through to local
        console.warn('Supabase upload failed, falling back to local:', error.message)
      } catch (e: any) {
        console.warn('Supabase upload error, falling back to local:', e.message)
      }
    }

    // Fallback: local file storage (works in dev)
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadsDir, { recursive: true })
    await writeFile(path.join(uploadsDir, fileName), buffer)

    return NextResponse.json({ url: `/uploads/${fileName}` })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
