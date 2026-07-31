import { NextRequest, NextResponse } from 'next/server';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { seed, getAll, create } from '@/lib/adminStore';
import { signToken } from '@/lib/auth';

seed();

// ── Password hashing (Node built-in scrypt — no extra deps) ──
function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return salt + ':' + hash;
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, hash] = stored.split(':');
    if (!salt || !hash) return false;
    const test = scryptSync(password, salt, 64);
    return timingSafeEqual(test, Buffer.from(hash, 'hex'));
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, fullName, email, password } = await request.json();

    if ((!name && !fullName) || !email || !password) {
      return NextResponse.json({ success: false, message: 'Full name, email, and password required' }, { status: 400 });
    }

    if (typeof password !== 'string' || password.length < 6) {
      return NextResponse.json({ success: false, message: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const users: any[] = getAll('users');
    if (users.find((u: any) => u.email === email)) {
      return NextResponse.json({ success: false, message: 'Email already registered' }, { status: 409 });
    }

    // Store only the hash — never the plaintext password
    const user = create('users', { name: name || fullName, email, passwordHash: hashPassword(password), role: 'user' }) as any;

    const token = await signToken({
      id: user._id,
      email: user.email,
      role: user.role,
      iat: Date.now(),
      exp: Date.now() + 30 * 86400000,
    });

    return NextResponse.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err: any) {
    console.error('[register] error:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
