'use server'

import { cookies } from 'next/headers'

const ADMIN_COOKIE = 'portfolio_admin_session'

export async function login(password: string): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) {
    // No password set — allow access
    return true
  }
  if (password === adminPassword) {
    const cookieStore = await cookies()
    cookieStore.set(ADMIN_COOKIE, 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
    return true
  }
  return false
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE)
}

export async function isAuthenticated(): Promise<boolean> {
  if (!process.env.ADMIN_PASSWORD) return true
  const cookieStore = await cookies()
  return cookieStore.get(ADMIN_COOKIE)?.value === 'authenticated'
}
