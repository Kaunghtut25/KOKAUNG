import { NextRequest, NextResponse } from 'next/server';
import { seed, getCollection } from '@/lib/adminStore';

// Simple admin credentials (in production, use proper auth)
const ADMIN_EMAIL = 'admin@a9global.com';
const ADMIN_PASSWORD = 'admin123';

// Ensure store is seeded
seed();

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email and password required' }, { status: 400 });
    }

    const users = getCollection('users');
    let user = users.find((u: any) => u.email === email);

    if (!user) {
      // Auto-create user for first login (demo mode)
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        user = {
          _id: 'admin-001',
          id: 'admin-001',
          name: 'Admin',
          email: ADMIN_EMAIL,
          role: 'admin',
          createdAt: new Date().toISOString(),
        };
        users.push(user);
        getCollection('_meta').users = users;
      } else {
        return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
      }
    }

    // In production, use bcrypt; for demo, simple comparison
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    // Simple JWT-like token (in production, use real JWT)
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
