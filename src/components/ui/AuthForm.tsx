'use client';

import { useState, useId, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const WIX_CAPTCHA_KEY = '6LdoPaUfAAAAAJphvHoUoOob7mx0KDlXyXlgrx5v';

type Mode = 'login' | 'register';
type Step = 'form' | 'verify' | 'reset-sent';

const LABEL: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-rajdhani)',
  fontSize: '10px',
  fontWeight: 700,
  letterSpacing: '0.38em',
  textTransform: 'uppercase',
  color: 'var(--accent)',
  marginBottom: '0.5rem',
};

const INPUT: React.CSSProperties = {
  width: '100%',
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid var(--border)',
  outline: 'none',
  color: 'var(--page-fg)',
  fontFamily: 'var(--font-rajdhani)',
  fontSize: '15px',
  fontWeight: 500,
  letterSpacing: '0.08em',
  padding: '0.6rem 0',
  transition: 'border-color 0.2s',
};

function ErrBox({ msg }: { msg: string }) {
  return (
    <div
      style={{
        padding: '0.75rem 1rem',
        border: '1px solid rgba(216,24,41,0.4)',
        background: 'rgba(216,24,41,0.08)',
        color: '#FF6070',
        fontFamily: 'var(--font-rajdhani)',
        fontSize: '11px',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        marginBottom: '1.5rem',
      }}
    >
      {msg}
    </div>
  );
}

function SubmitBtn({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="font-display uppercase"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '13px',
        letterSpacing: '0.24em',
        background: loading ? 'var(--border)' : '#D81829',
        color: '#fff',
        border: 'none',
        height: '3.25rem',
        padding: '0 2.5rem',
        cursor: loading ? 'default' : 'pointer',
        transition: 'background 0.2s',
        minWidth: '200px',
      }}
      onMouseEnter={(e) => {
        if (!loading) (e.currentTarget as HTMLButtonElement).style.background = '#b31420';
      }}
      onMouseLeave={(e) => {
        if (!loading) (e.currentTarget as HTMLButtonElement).style.background = '#D81829';
      }}
    >
      {loading ? 'Loading...' : label}
    </button>
  );
}

export function AuthForm({ mode: initialMode }: { mode: Mode }) {
  const uid = useId();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [step, setStep] = useState<Step>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [verifyCode, setVerifyCode] = useState('');
  const [stateToken, setStateToken] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onFocus = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.currentTarget.style.borderBottomColor = 'var(--accent)');
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.currentTarget.style.borderBottomColor = 'var(--border)');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let captchaToken: string | null = null;
      if (mode === 'register' && recaptchaRef.current) {
        captchaToken = await recaptchaRef.current.executeAsync();
        recaptchaRef.current.reset();
      }

      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = mode === 'login'
        ? { email: form.email, password: form.password }
        : { email: form.email, password: form.password, name: form.name || undefined, captchaToken };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as {
        loginState?: string;
        authUrl?: string;
        stateToken?: string;
        errorCode?: string;
        error?: string;
      };

      if (data.loginState === 'SUCCESS' && data.authUrl) {
        window.location.href = data.authUrl;
        return;
      }
      if (data.loginState === 'EMAIL_VERIFICATION_REQUIRED') {
        setStateToken(data.stateToken ?? '');
        setStep('verify');
        setLoading(false);
        return;
      }
      if (data.loginState === 'OWNER_APPROVAL_REQUIRED') {
        setError('Account pending approval. You will receive an email when approved.');
        setLoading(false);
        return;
      }

      setError(
        data.errorCode === 'emailAlreadyExists'
          ? 'An account with this email already exists. Try signing in.'
          : mode === 'login'
          ? 'Invalid email or password.'
          : 'Could not create account. Please try again.',
      );
      setLoading(false);
    } catch {
      setError(mode === 'login' ? 'Invalid email or password.' : 'Could not create account. Please try again.');
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificationCode: verifyCode.trim(), stateToken }),
      });
      const data = (await res.json()) as { loginState?: string; authUrl?: string; error?: string };
      if (data.loginState === 'SUCCESS' && data.authUrl) {
        window.location.href = data.authUrl;
        return;
      }
      setError(data.error ?? 'Invalid or expired code. Please try again.');
      setLoading(false);
    } catch {
      setError('Verification failed. Please try again.');
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      });
      if (!res.ok) throw new Error('reset failed');
      setStep('reset-sent');
    } catch {
      setError('Could not send reset email. Please check the address.');
    } finally {
      setLoading(false);
    }
  };

  // ── Email verification ────────────────────────────
  if (step === 'verify') {
    return (
      <div style={{ maxWidth: 440 }}>
        <p style={{ ...LABEL, marginBottom: '0.75rem', letterSpacing: '0.52em' }}>── Email verification</p>
        <h2 className="font-display uppercase leading-none mb-6" style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: 'var(--page-fg)' }}>
          Check your
          <br />
          <span style={{ color: 'var(--accent)' }}>Email.</span>
        </h2>
        <p style={{ fontFamily: 'var(--font-rajdhani)', fontSize: '12px', color: 'var(--muted)', letterSpacing: '0.14em', marginBottom: '2rem' }}>
          A verification code was sent to {form.email}.
        </p>
        {error && <ErrBox msg={error} />}
        <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <label htmlFor={`${uid}-code`} style={LABEL}>Verification Code</label>
            <input
              id={`${uid}-code`}
              type="text"
              inputMode="numeric"
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value)}
              required
              placeholder="6-digit code"
              style={{ ...INPUT, fontSize: '18px', letterSpacing: '0.35em' }}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </div>
          <SubmitBtn loading={loading} label="Verify →" />
        </form>
      </div>
    );
  }

  // ── Reset password sent ───────────────────────────
  if (step === 'reset-sent') {
    return (
      <div style={{ maxWidth: 440 }}>
        <p style={{ ...LABEL, marginBottom: '0.75rem', letterSpacing: '0.52em' }}>── Password reset</p>
        <h2 className="font-display uppercase leading-none mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: 'var(--page-fg)' }}>
          Email
          <br />
          <span style={{ color: 'var(--accent)' }}>Sent.</span>
        </h2>
        <p style={{ fontFamily: 'var(--font-rajdhani)', fontSize: '12px', color: 'var(--muted)', letterSpacing: '0.14em' }}>
          Check {resetEmail} for a reset link.
        </p>
        <button
          type="button"
          onClick={() => { setStep('form'); setShowReset(false); }}
          style={{ marginTop: '2rem', ...LABEL, cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
        >
          ← Back to sign in
        </button>
      </div>
    );
  }

  // ── Forgot password ───────────────────────────────
  if (showReset) {
    return (
      <div style={{ maxWidth: 440 }}>
        <p style={{ ...LABEL, marginBottom: '0.75rem', letterSpacing: '0.52em' }}>── Forgot password</p>
        <h2 className="font-display uppercase leading-none mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: 'var(--page-fg)' }}>
          Reset
          <br />
          <span style={{ color: 'var(--accent)' }}>Password.</span>
        </h2>
        <p style={{ fontFamily: 'var(--font-rajdhani)', fontSize: '12px', color: 'var(--muted)', letterSpacing: '0.14em', marginBottom: '2rem' }}>
          Enter your email and we&apos;ll send a reset link.
        </p>
        {error && <ErrBox msg={error} />}
        <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <label htmlFor={`${uid}-re`} style={LABEL}>Email</label>
            <input
              id={`${uid}-re`}
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
              autoComplete="email"
              style={INPUT}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </div>
          <SubmitBtn loading={loading} label="Send Reset Link →" />
        </form>
        <button
          type="button"
          onClick={() => setShowReset(false)}
          style={{ marginTop: '1.5rem', ...LABEL, cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
        >
          ← Back
        </button>
      </div>
    );
  }

  // ── Main form ─────────────────────────────────────
  const isLogin = mode === 'login';

  return (
    <div style={{ maxWidth: 440 }}>
      <p style={{ ...LABEL, marginBottom: '0.75rem', letterSpacing: '0.52em' }}>── Corvo Athletic</p>
      <h2
        className="font-display uppercase leading-none mb-1"
        style={{ fontSize: 'clamp(2.4rem, 6vw, 4.2rem)', color: 'var(--page-fg)' }}
      >
        {isLogin ? 'Sign' : 'Join'}
        <br />
        <span style={{ color: 'var(--accent)' }}>{isLogin ? 'In.' : 'Us.'}</span>
      </h2>
      <p style={{ fontFamily: 'var(--font-rajdhani)', fontSize: '12px', color: 'var(--muted)', letterSpacing: '0.14em', marginBottom: '2.5rem', marginTop: '0.75rem' }}>
        {isLogin
          ? 'Access your orders, wishlist, and member perks.'
          : 'Create an account for early drops and order tracking.'}
      </p>

      {error && <ErrBox msg={error} />}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {!isLogin && (
          <div>
            <label htmlFor={`${uid}-name`} style={LABEL}>
              Name{' '}
              <span style={{ color: 'var(--muted)', fontWeight: 400, letterSpacing: '0.2em' }}>(optional)</span>
            </label>
            <input
              id={`${uid}-name`}
              type="text"
              value={form.name}
              onChange={set('name')}
              autoComplete="name"
              style={INPUT}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </div>
        )}

        <div>
          <label htmlFor={`${uid}-email`} style={LABEL}>Email</label>
          <input
            id={`${uid}-email`}
            type="email"
            value={form.email}
            onChange={set('email')}
            required
            autoComplete="email"
            style={INPUT}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>

        <div>
          <label htmlFor={`${uid}-pw`} style={LABEL}>Password</label>
          <input
            id={`${uid}-pw`}
            type="password"
            value={form.password}
            onChange={set('password')}
            required
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            style={INPUT}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>

        <div style={{ paddingTop: '0.25rem' }}>
          <SubmitBtn loading={loading} label={isLogin ? 'Sign In →' : 'Create Account →'} />
        </div>
      </form>

      {!isLogin && (
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={WIX_CAPTCHA_KEY}
          size="invisible"
          badge="bottomright"
        />
      )}

      <div style={{ height: '1px', background: 'var(--border)', margin: '2rem 0' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
        <button
          type="button"
          onClick={() => {
            setMode(isLogin ? 'register' : 'login');
            setError('');
            setForm((f) => ({ ...f, password: '' }));
          }}
          style={{ ...LABEL, cursor: 'pointer', background: 'none', border: 'none', padding: 0, textAlign: 'left' }}
        >
          {isLogin ? '→ New here? Create account' : '→ Already a member? Sign in'}
        </button>
        {isLogin && (
          <button
            type="button"
            onClick={() => { setShowReset(true); setResetEmail(form.email); setError(''); }}
            style={{ ...LABEL, cursor: 'pointer', background: 'none', border: 'none', padding: 0, textAlign: 'left', color: 'var(--muted)' }}
          >
            → Forgot password?
          </button>
        )}
      </div>
    </div>
  );
}
