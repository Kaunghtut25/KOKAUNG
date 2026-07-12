import { NextRequest, NextResponse } from 'next/server';
import { seed, getAll, create } from '@/lib/adminStore';

// Admin credentials (hardcoded — use proper auth + env vars in production)
const ADMIN_EMAIL = 'admin@a9global.com';
const ADMIN_PASSWORD = 'admin123';

seed();

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email and password required' }, { status: 400 });
    }

    // ── Admin login ──
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      let adminUser: any = (getAll('users') as any[]).find((u: any) => u.email === ADMIN_EMAIL);
      if (!adminUser) {
        adminUser = create('users', { name: 'Admin', email: ADMIN_EMAIL, role: 'admin' });
      }
      const token = Buffer.from(JSON.stringify({ id: adminUser._id, email: adminUser.email, role: 'admin' })).toString('base64');
      return NextResponse.json({
        success: true,
        token,
        user: { id: adminUser._id, name: adminUser.name, email: adminUser.email, role: 'admin' },
      });
    }

    // ── Client login ──
    const users: any[] = getAll('users');
    const user = users.find((u: any) => u.email === email);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Account not found. Please register first.' }, { status: 401 });
    }

    if (user.role !== 'user') {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    // Verify password (plaintext comparison — use bcrypt in production)
    if (user.password !== password) {
      return NextResponse.json({ success: false, message: 'Incorrect password' }, { status: 401 });
    }

    const token = Buffer.from(JSON.stringify({ id: user._id, email: user.email, role: user.role })).toString('base64');
    return NextResponse.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
