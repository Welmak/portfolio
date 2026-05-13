import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json()

    if (!email || !message) {
      return NextResponse.json({ error: 'Email and message are required' }, { status: 400 })
    }

    // Option 1: Send via Resend (set RESEND_API_KEY in env)
    // Option 2: Log to console for manual review
    // Option 3: Store in Supabase

    // For now, log the submission
    console.log('📬 New contact submission:', { name, email, message })

    // If you want email notifications, install `resend` and uncomment below:
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.emails.send({
    //   from: 'portfolio@yourdomain.com',
    //   to: process.env.CONTACT_EMAIL || 'allenperiod2@gmail.com',
    //   subject: `Portfolio Contact from ${name || email}`,
    //   text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    // })

    return NextResponse.json({ success: true, message: 'Message sent!' })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
