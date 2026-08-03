'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Step = 'login' | 'forgot' | 'otp' | 'newpw' | 'done';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const showError = (msg: string) => { setError(msg); setInfo(''); };
  const showInfo = (msg: string) => { setInfo(msg); setError(''); };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setInfo('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        showError(data.message || 'Login failed');
        return;
      }
      // Store admin token
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      document.cookie = `a9_admin_token=${data.token}; path=/; max-age=86400; samesite=lax`;
      setTimeout(() => {
        router.push('/admin');
        router.refresh();
      }, 100);
    } catch {
      showError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: request OTP
  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setInfo('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError('Enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        showError(data.message || 'Something went wrong.');
        setLoading(false);
        return;
      }
      showInfo(data.message || 'Check your inbox for a reset code.');
      setOtp('');
      setStep('otp');
    } catch {
      showError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: verify OTP → get one-time reset token
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setInfo('');
    if (!/^\d{6}$/.test(otp)) {
      showError('Enter the 6-digit code.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        showError(data.message || 'Invalid code.');
        setLoading(false);
        return;
      }
      setResetToken(data.token);
      setNewPassword('');
      setConfirmPassword('');
      setStep('newpw');
    } catch {
      showError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: set new password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setInfo('');
    if (newPassword.length < 6) {
      showError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        showError(data.message || 'Failed to reset password.');
        setLoading(false);
        return;
      }
      showInfo('Password updated. You can now sign in with your new password.');
      setPassword('');
      setStep('done');
    } catch {
      showError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Resend code (no form submit event)
  const handleResend = async () => {
    setError(''); setInfo(''); setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) { showError(data.message || 'Something went wrong.'); setLoading(false); return; }
      showInfo(data.message || 'A new code has been sent.');
      setOtp('');
    } catch { showError('Network error. Please try again.'); }
    setLoading(false);
  };

  const restart = () => {
    setStep('login');
    setError(''); setInfo('');
    setOtp(''); setResetToken(''); setNewPassword(''); setConfirmPassword('');
  };

  const inputCls = "w-full bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/30 transition-all";

  return (
    <div className="min-h-screen bg-deepblue flex items-center justify-center px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#D4AF37]/3 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-3xl font-bold text-[#D4AF37]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              A9 GLOBAL
            </span>
          </Link>
          <p className="text-white/40 text-sm mt-2">Admin Panel</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          {step !== 'login' && (
            <button onClick={restart} className="text-white/40 hover:text-white/80 text-sm mb-4 transition">
              ← Back to sign in
            </button>
          )}

          {step === 'login' && (
            <>
              <h2 className="text-xl font-bold text-white mb-6" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                🔐 Sign In
              </h2>
              {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
              {info && <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm">{info}</div>}
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-white/60 text-sm mb-2">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@a9global.com" required className={inputCls} />
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-2">Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className={inputCls} />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F5A623] text-[#0A1628] font-bold hover:shadow-lg hover:shadow-[#D4AF37]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300">
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
              <div className="mt-4 text-center">
                <button onClick={() => { setStep('forgot'); setError(''); setInfo(''); }}
                  className="text-[#D4AF37]/80 hover:text-[#D4AF37] text-sm transition">
                  Forgot password?
                </button>
              </div>
              <p className="mt-6 text-center text-white/30 text-xs">Protected area. Authorized personnel only.</p>
            </>
          )}

          {step === 'forgot' && (
            <>
              <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                🔑 Reset Password
              </h2>
              <p className="text-white/40 text-sm mb-6">Enter your admin email and we'll send a 6-digit reset code.</p>
              {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
              {info && <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm">{info}</div>}
              <form onSubmit={handleForgot} className="space-y-5">
                <div>
                  <label className="block text-white/60 text-sm mb-2">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@a9global.com" required className={inputCls} />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F5A623] text-[#0A1628] font-bold hover:shadow-lg hover:shadow-[#D4AF37]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300">
                  {loading ? 'Sending...' : 'Send Reset Code'}
                </button>
              </form>
            </>
          )}

          {step === 'otp' && (
            <>
              <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                📩 Enter Code
              </h2>
              <p className="text-white/40 text-sm mb-6">We sent a 6-digit code to <span className="text-[#D4AF37]">{email}</span>. It expires in 10 minutes.</p>
              {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
              {info && <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm">{info}</div>}
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div>
                  <label className="block text-white/60 text-sm mb-2">6-digit code</label>
                  <input type="text" inputMode="numeric" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} placeholder="000000" required className={`${inputCls} text-center text-2xl tracking-[0.5em]`} />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F5A623] text-[#0A1628] font-bold hover:shadow-lg hover:shadow-[#D4AF37]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300">
                  {loading ? 'Verifying...' : 'Verify Code'}
                </button>
              </form>
              <div className="mt-4 text-center">
                <button onClick={handleResend} disabled={loading}
                  className="text-white/40 hover:text-white/80 text-sm transition">
                  Didn't get it? Resend code
                </button>
              </div>
            </>
          )}

          {step === 'newpw' && (
            <>
              <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                🔒 New Password
              </h2>
              <p className="text-white/40 text-sm mb-6">Set a new password for <span className="text-[#D4AF37]">{email}</span>.</p>
              {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
              <form onSubmit={handleResetPassword} className="space-y-5">
                <div>
                  <label className="block text-white/60 text-sm mb-2">New password (min 6 characters)</label>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" required className={inputCls} />
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-2">Confirm new password</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" required className={inputCls} />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F5A623] text-[#0A1628] font-bold hover:shadow-lg hover:shadow-[#D4AF37]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300">
                  {loading ? 'Saving...' : 'Reset Password'}
                </button>
              </form>
            </>
          )}

          {step === 'done' && (
            <>
              <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                ✅ All Set
              </h2>
              {info && <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm">{info}</div>}
              <p className="text-white/40 text-sm mb-6">Use your new password to sign in.</p>
              <button onClick={() => { setStep('login'); setPassword(''); }}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F5A623] text-[#0A1628] font-bold hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300">
                Back to Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
