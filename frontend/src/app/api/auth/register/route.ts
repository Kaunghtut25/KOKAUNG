import { NextRequest, NextResponse } from 'next/server';
import { seed, getAll, create } from '@/lib/adminStore';

seed();

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: 'Name, email, and password required' }, { status: 400 });
    }

    const users: any[] = getAll('users');
    if (users.find((u: any) => u.email === email)) {
      return NextResponse.json({ success: false, message: 'Email already registered' }, { status: 409 });
    }

    const user = create('users', { name, email, role: 'user' }) as any;

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
