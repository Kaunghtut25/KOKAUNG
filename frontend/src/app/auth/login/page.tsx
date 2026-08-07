'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useI18n } from "@/lib/i18n";

type Step = 'login' | 'forgot' | 'otp' | 'newpw' | 'done';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useI18n();
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
        showError(data.message || t("auth.login.errLoginFailed"));
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
      showError(t("auth.login.errNetwork"));
    } finally {
      setLoading(false);
    }
  };

  // Step 1: request OTP
  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setInfo('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError(t("auth.login.errEmail"));
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
        showError(data.message || t("auth.login.errGeneric"));
        setLoading(false);
        return;
      }
      showInfo(data.message || t("auth.login.infoInbox"));
      setOtp('');
      setStep('otp');
    } catch {
      showError(t("auth.login.errNetwork"));
    } finally {
      setLoading(false);
    }
  };

  // Step 2: verify OTP → get one-time reset token
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setInfo('');
    if (!/^\d{6}$/.test(otp)) {
      showError(t("auth.login.errOtp"));
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
        showError(data.message || t("auth.login.errInvalidCode"));
        setLoading(false);
        return;
      }
      setResetToken(data.token);
      setNewPassword('');
      setConfirmPassword('');
      setStep('newpw');
    } catch {
      showError(t("auth.login.errNetwork"));
    } finally {
      setLoading(false);
    }
  };

  // Step 3: set new password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setInfo('');
    if (newPassword.length < 6) {
      showError(t("auth.login.errPwLen"));
      return;
    }
    if (newPassword !== confirmPassword) {
      showError(t("auth.login.errPwMatch"));
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
        showError(data.message || t("auth.login.errReset"));
        setLoading(false);
        return;
      }
      showInfo(t("auth.login.infoUpdated"));
      setPassword('');
      setStep('done');
    } catch {
      showError(t("auth.login.errNetwork"));
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
      if (!res.ok) { showError(data.message || t("auth.login.errGeneric")); setLoading(false); return; }
      showInfo(data.message || t("auth.login.infoResent"));
      setOtp('');
    } catch { showError(t("auth.login.errNetwork")); }
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
        <div className="absolute top-0 right-0 z-10"><LanguageSwitcher dark={false} /></div>
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-3xl font-bold text-[#D4AF37]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              A9 GLOBAL
            </span>
          </Link>
          <p className="text-white/60 text-sm mt-2">{t("auth.login.adminPanel")}</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          {step !== 'login' && (
            <button onClick={restart} className="text-white/60 hover:text-white/80 text-sm mb-4 transition">
              {t("auth.login.backToSignIn")}
            </button>
          )}

          {step === 'login' && (
            <>
              <h2 className="text-xl font-bold text-white mb-6" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                {t("auth.login.signInTitle")}
              </h2>
              {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
              {info && <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm">{info}</div>}
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-white/60 text-sm mb-2">{t("auth.login.email")}</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@a9global.com" required className={inputCls} />
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-2">{t("auth.login.password")}</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className={inputCls} />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F5A623] text-[#0A1628] font-bold hover:shadow-lg hover:shadow-[#D4AF37]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300">
                  {loading ? t("auth.login.signingIn") : t("auth.login.signIn")}
                </button>
              </form>
              <div className="mt-4 text-center">
                <button onClick={() => { setStep('forgot'); setError(''); setInfo(''); }}
                  className="text-[#D4AF37]/80 hover:text-[#D4AF37] text-sm transition">
                  {t("auth.login.forgotPassword")}
                </button>
              </div>
              <p className="mt-6 text-center text-white/50 text-xs">{t("auth.login.protectedArea")}</p>
            </>
          )}

          {step === 'forgot' && (
            <>
              <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                {t("auth.login.resetTitle")}
              </h2>
              <p className="text-white/60 text-sm mb-6">{t("auth.login.resetDesc")}</p>
              {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
              {info && <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm">{info}</div>}
              <form onSubmit={handleForgot} className="space-y-5">
                <div>
                  <label className="block text-white/60 text-sm mb-2">{t("auth.login.email")}</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@a9global.com" required className={inputCls} />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F5A623] text-[#0A1628] font-bold hover:shadow-lg hover:shadow-[#D4AF37]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300">
                  {loading ? t("auth.login.sending") : t("auth.login.sendResetCode")}
                </button>
              </form>
            </>
          )}

          {step === 'otp' && (
            <>
              <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                {t("auth.login.otpTitle")}
              </h2>
              <p className="text-white/60 text-sm mb-6">{t("auth.login.otpDescPrefix")} <span className="text-[#D4AF37]">{email}</span>{t("auth.login.otpDescSuffix")}</p>
              {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
              {info && <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm">{info}</div>}
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div>
                  <label className="block text-white/60 text-sm mb-2">{t("auth.login.otpLabel")}</label>
                  <input type="text" inputMode="numeric" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} placeholder="000000" required className={`${inputCls} text-center text-2xl tracking-[0.5em]`} />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F5A623] text-[#0A1628] font-bold hover:shadow-lg hover:shadow-[#D4AF37]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300">
                  {loading ? t("auth.login.verifying") : t("auth.login.verifyCode")}
                </button>
              </form>
              <div className="mt-4 text-center">
                <button onClick={handleResend} disabled={loading}
                  className="text-white/60 hover:text-white/80 text-sm transition">
                  {t("auth.login.resend")}
                </button>
              </div>
            </>
          )}

          {step === 'newpw' && (
            <>
              <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                {t("auth.login.newpwTitle")}
              </h2>
              <p className="text-white/60 text-sm mb-6">{t("auth.login.newpwDescPrefix")} <span className="text-[#D4AF37]">{email}</span>.</p>
              {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
              <form onSubmit={handleResetPassword} className="space-y-5">
                <div>
                  <label className="block text-white/60 text-sm mb-2">{t("auth.login.newPwLabel")}</label>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" required className={inputCls} />
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-2">{t("auth.login.confirmPwLabel")}</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" required className={inputCls} />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F5A623] text-[#0A1628] font-bold hover:shadow-lg hover:shadow-[#D4AF37]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300">
                  {loading ? t("auth.login.saving") : t("auth.login.resetPassword")}
                </button>
              </form>
            </>
          )}

          {step === 'done' && (
            <>
              <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                {t("auth.login.doneTitle")}
              </h2>
              {info && <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm">{info}</div>}
              <p className="text-white/60 text-sm mb-6">{t("auth.login.doneDesc")}</p>
              <button onClick={() => { setStep('login'); setPassword(''); }}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F5A623] text-[#0A1628] font-bold hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300">
                {t("auth.login.backToSignInBtn")}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
