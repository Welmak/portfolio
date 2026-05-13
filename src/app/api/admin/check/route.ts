import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-auth'

export async function GET() {
  const ok = await isAuthenticated()
  if (ok) return NextResponse.json({ authenticated: true })
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
