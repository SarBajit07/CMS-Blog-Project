'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

// ─── Zod Schema ────────────────────────────────────────────────────────────────
const registerSchema = z
  .object({
    username: z
      .string()
      .min(1, 'Username is required')
      .min(3, 'Username must be at least 3 characters')
      .max(50, 'Username must be 50 characters or less')
      .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores allowed'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

// ─── Reusable Field ────────────────────────────────────────────────────────────
function Field({
  label,
  icon,
  error,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs tracking-widest uppercase font-medium" style={{ color: 'var(--cream-dim)' }}>
        {label}
      </label>
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
export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  const { register: registerUser } = useAuth();
  const router = useRouter();

  const onSubmit = async (data: RegisterFormValues) => {
    setServerError('');
    try {
      await registerUser(data.username, data.email, data.password);
      setSuccess(true);
      setTimeout(() => router.push('/auth/login'), 2500);
    } catch (err: any) {
      setServerError(err.message || 'Registration failed. Please try again.');
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
              Join the platform
            </span>
          </div>
          <h1
            className="font-display"
            style={{ fontSize: '38px', lineHeight: 1.1, color: 'var(--cream)' }}
          >
            Create your<br />
            <em className="not-italic" style={{ color: 'var(--gold)' }}>writer's space</em>
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
          {/* Success state */}
          {success ? (
            <div className="py-8 text-center space-y-5 animate-fade-in">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto"
                style={{ background: 'rgba(76, 175, 125, 0.12)', color: 'var(--green)' }}
              >
                <CheckCircle2 size={28} />
              </div>
              <div>
                <h2 className="font-display text-2xl mb-2" style={{ color: 'var(--cream)' }}>
                  Account Created
                </h2>
                <p className="text-sm font-light" style={{ color: 'var(--cream-dim)' }}>
                  Redirecting you to login…
                </p>
              </div>
              {/* Animated progress bar */}
              <div
                className="h-px mx-auto"
                style={{
                  width: '80%',
                  background: 'var(--border)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    background: 'var(--gold)',
                    animation: 'slideRight 2.5s linear forwards',
                    transformOrigin: 'left',
                  }}
                />
              </div>
            </div>
          ) : (
            <>
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

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                <Field label="Username" icon={<User size={16} />} error={errors.username?.message}>
                  <input
                    type="text"
                    autoComplete="username"
                    placeholder="johndoe"
                    className={`input-dark ${errors.username ? 'error' : ''}`}
                    {...register('username')}
                  />
                </Field>

                <Field label="Email" icon={<Mail size={16} />} error={errors.email?.message}>
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={`input-dark ${errors.email ? 'error' : ''}`}
                    {...register('email')}
                  />
                </Field>

                <Field label="Password" icon={<Lock size={16} />} error={errors.password?.message}>
                  <input
                    type="password"
                    autoComplete="new-password"
                    placeholder="At least 6 characters"
                    className={`input-dark ${errors.password ? 'error' : ''}`}
                    {...register('password')}
                  />
                </Field>

                <Field label="Confirm Password" icon={<Lock size={16} />} error={errors.confirmPassword?.message}>
                  <input
                    type="password"
                    autoComplete="new-password"
                    placeholder="Repeat your password"
                    className={`input-dark ${errors.confirmPassword ? 'error' : ''}`}
                    {...register('confirmPassword')}
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
                      Create Account
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Footer link */}
        <p className="text-center mt-8 text-sm font-light" style={{ color: '#3A4A5E' }}>
          Already have an account?{' '}
          <Link href="/auth/login" className="link-underline" style={{ color: 'var(--cream-dim)' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
