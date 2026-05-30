import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { email, password, name, role } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    // In production, this would create a user in the database
    // For now, we accept the signup and set the auth cookie
    const authToken = Buffer.from(JSON.stringify({
      email,
      name,
      role: role || 'brand',
      signedUpAt: Date.now(),
    })).toString('base64')

    const response = NextResponse.json({ success: true, message: 'Account created successfully' })
    
    // Set auth cookie
    response.cookies.set('yt_matcher_auth', authToken, {
      httpOnly: false,
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
