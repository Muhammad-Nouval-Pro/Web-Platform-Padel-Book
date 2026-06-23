import { cookies } from 'next/headers';

export type SessionData = {
  userId: string;
  role: 'SUPER_ADMIN' | 'VENDOR_ADMIN' | 'CUSTOMER';
  name: string;
};

export async function setSession(sessionData: SessionData) {
  const cookieStore = await cookies();
  cookieStore.set('session', JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  if (!session) return null;
  try {
    return JSON.parse(session) as SessionData;
  } catch (error) {
    return null;
  }
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}
