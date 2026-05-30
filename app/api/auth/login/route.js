import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // For now, simple demo auth - in production this would validate against DB
    // Accept any login with a valid email format and password >= 6 chars
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Create auth token (in production, use JWT or session)
    const authToken = Buffer.from(JSON.stringify({
      email,
      loginAt: Date.now(),
    })).toString('base64')

    const response = NextResponse.json({ success: true, message: 'Logged in successfully' })
    
    // Set auth cookie
    response.cookies.set('yt_matcher_auth', authToken, {
      httpOnly: false, // needs to be readable by client for nav display
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
