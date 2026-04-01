import { NextResponse } from 'next/server';

const API_HOST = process.env.NEXT_PUBLIC_API_HOST || '127.0.0.1';
const API_PORT = process.env.NEXT_PUBLIC_API_PORT_SECURITY || '8002';
const BASE_URL = `http://${API_HOST}:${API_PORT}`;

export async function POST(request) {
  try {
    const body = await request.json();

    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: err?.detail || err?.message || 'Invalid credentials.' },
        { status: res.status }
      );
    }

    const data = await res.json();

    // The backend now returns { token: "eyJ..." } directly. Let's send it to the client.
    // We can also extract session info if necessary or simply forward the token.
    const token = data.token || '';

    // If there's still a data.user payload, we can use it, otherwise we'll just store the token.
    const sessionPayload = {
      user_master_id: data.user?.id,
      email: data.user?.email,
      username: data.user?.username,
      roles: data.user?.roles || [],
      session_id: data.session_id,
      app_session_id: data.app_session_id,
      token: token
    };

    const response = NextResponse.json({ success: true, user: data.user, token });

    // Set an HTTP-readable cookie (not httpOnly so client JS can read user info)
    response.cookies.set('session', JSON.stringify(sessionPayload), {
      path: '/',
      maxAge: 60 * 60 * 8, // 8 hours
      sameSite: 'lax',
    });
    
    // Set explicit token cookie for Single Sign-On
    if (token) {
      response.cookies.set('token', token, {
        path: '/',
        maxAge: 60 * 60 * 8,
        sameSite: 'lax',
      });
    }

    return response;
  } catch (err) {
    console.error('Login route error:', err);
    return NextResponse.json({ error: 'Server error during login.' }, { status: 500 });
  }
}
