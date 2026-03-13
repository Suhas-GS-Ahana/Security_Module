/**
 * Client-side session utilities.
 * Reads the 'session' cookie set by the server-side login route handler.
 */

export function getSession() {
  if (typeof document === 'undefined') return null;
  try {
    const match = document.cookie
      .split('; ')
      .find(row => row.startsWith('session='));
    if (!match) return null;
    return JSON.parse(decodeURIComponent(match.split('=').slice(1).join('=')));
  } catch {
    return null;
  }
}

export function clearSession() {
  if (typeof document === 'undefined') return;
  document.cookie = 'session=; path=/; max-age=0';
}
