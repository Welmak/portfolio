import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-auth'

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const hookUrl = process.env.VERCEL_DEPLOY_HOOK
  if (!hookUrl) {
    return NextResponse.json({ error: 'VERCEL_DEPLOY_HOOK not set' }, { status: 400 })
  }
  try {
    await fetch(hookUrl, { method: 'POST' })
    return NextResponse.json({ success: true, message: 'Deploy triggered' })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
