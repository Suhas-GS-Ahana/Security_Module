import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_HOST = process.env.NEXT_PUBLIC_API_HOST || '127.0.0.1';
const API_PORT = process.env.NEXT_PUBLIC_API_PORT_SECURITY || '8002';
const BASE_URL = `http://${API_HOST}:${API_PORT}`;

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    let sessionData = {};

    if (sessionCookie) {
      try {
        sessionData = JSON.parse(sessionCookie.value);
      } catch {
        // Ignore malformed cookie
      }
    }

    // Call backend logout API
    await fetch(`${BASE_URL}/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_master_id: sessionData.user_master_id || 0,
        session_id: sessionData.session_id || '',
      }),
    }).catch(() => {
      // Don't block logout on backend failure
    });

    // Clear the session cookie regardless
    const response = NextResponse.json({ success: true });
    response.cookies.set('session', '', {
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (err) {
    console.error('Logout route error:', err);
    return NextResponse.json({ error: 'Server error during logout.' }, { status: 500 });
  }
}
