'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

// ─── Zod Schema ────────────────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// ─── Field wrapper component ───────────────────────────────────────────────────
function Field({
  label,
  icon,
  error,
  aside,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  error?: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-xs tracking-widest uppercase font-medium" style={{ color: 'var(--cream-dim)' }}>
          {label}
        </label>
        {aside}
      </div>
      <div className="relative">
        <div
          className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
          style={{ color: '#3A4A5E' }}
        >
          {icon}
        </div>
        {children}
      </div>
      {error && (
        <p className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--red)' }}>
          <AlertCircle size={11} />
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const [serverError, setServerError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const onSubmit = async (data: LoginFormValues) => {
    setServerError('');
    try {
      await login(data.email, data.password);
      router.push('/dashboard');
    } catch (err: any) {
      setServerError(err.message || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div
      className="min-h-[85vh] flex items-center justify-center px-4 py-16"
      style={{ background: 'var(--bg)' }}
    >
      {/* Decorative glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '400px',
          height: '300px',
          background: 'radial-gradient(ellipse, rgba(201,169,110,0.06) 0%, transparent 70%)',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      />

      <div className="w-full max-w-sm relative z-10 animate-fade-up">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div style={{ height: '1px', width: '24px', background: 'var(--gold)' }} />
            <span className="text-xs tracking-[0.25em] uppercase" style={{ color: 'var(--gold)' }}>
              Welcome back
            </span>
          </div>
          <h1
            className="font-display"
            style={{ fontSize: '38px', lineHeight: 1.1, color: 'var(--cream)' }}
          >
            Sign in to<br />
            <em className="not-italic" style={{ color: 'var(--gold)' }}>MiniCMS</em>
          </h1>
        </div>

        {/* Card */}
        <div
          className="grain-surface p-8 rounded-lg"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
          }}
        >
          {/* Server error */}
          {serverError && (
            <div
              className="flex items-center gap-3 p-4 rounded mb-6 text-sm animate-fade-in"
              style={{
                background: 'rgba(224,85,85,0.1)',
                border: '1px solid rgba(224,85,85,0.3)',
                color: 'var(--red)',
              }}
            >
              <AlertCircle size={16} className="shrink-0" />
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <Field
              label="Email"
              icon={<Mail size={16} />}
              error={errors.email?.message}
            >
              <input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className={`input-dark ${errors.email ? 'error' : ''}`}
                {...register('email')}
              />
            </Field>

            <Field
              label="Password"
              icon={<Lock size={16} />}
              error={errors.password?.message}
              aside={
                <Link
                  href="#"
                  className="text-xs link-underline"
                  style={{ color: '#3A4A5E' }}
                >
                  Forgot password?
                </Link>
              }
            >
              <input
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className={`input-dark ${errors.password ? 'error' : ''}`}
                {...register('password')}
              />
            </Field>

            {/* Divider */}
            <div style={{ height: '1px', background: 'var(--border)' }} />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-3 py-3.5 text-sm tracking-widest uppercase font-medium transition-all group"
              style={{
                background: isSubmitting ? 'var(--border)' : 'var(--gold)',
                color: 'var(--bg)',
                borderRadius: '4px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              {isSubmitting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <p className="text-center mt-8 text-sm font-light" style={{ color: '#3A4A5E' }}>
          No account yet?{' '}
          <Link href="/auth/register" className="link-underline" style={{ color: 'var(--cream-dim)' }}>
            Create one — it&apos;s free
          </Link>
        </p>
      </div>
    </div>
  );
}
