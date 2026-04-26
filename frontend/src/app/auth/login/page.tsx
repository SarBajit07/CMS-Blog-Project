'use client';

import React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import GuestRoute from '@/components/auth/GuestRoute';

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
        <label className="text-xs tracking-widest uppercase font-medium text-[#1A1A1A]">
          {label}
        </label>
        {aside}
      </div>
      <div className="relative">
        <div
          className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#777777]"
        >
          {icon}
        </div>
        {children}
      </div>
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-[#E05555]">
          <AlertCircle size={11} />
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────────
function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const { login } = useAuth();

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data.email, data.password);
    } catch (err) {
      // Errors handled by AuthContext toasts
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-[#FAFAFA]">
      <div className="w-full max-w-sm relative z-10">

        {/* Header */}
        <div className="mb-10 text-center">
          <span className="text-xs tracking-[0.25em] uppercase text-[#777777] mb-4 block">
            Welcome back
          </span>
          <h1 className="font-display text-4xl text-[#1A1A1A] leading-tight">
            Sign in to MiniCMS
          </h1>
        </div>

        {/* Card */}
        <div className="p-8 bg-white border border-[#1A1A1A] shadow-[8px_8px_0px_0px_#1A1A1A]">
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
                className="w-full pl-11 pr-4 py-3 bg-white border border-[#1A1A1A] text-sm focus:outline-none focus:ring-0 rounded-none placeholder:text-[#AAAAAA]"
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
                  className="text-[10px] uppercase tracking-wider font-bold text-[#777777] hover:text-[#1A1A1A]"
                >
                  Forgot?
                </Link>
              }
            >
              <input
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-white border border-[#1A1A1A] text-sm focus:outline-none focus:ring-0 rounded-none placeholder:text-[#AAAAAA]"
                {...register('password')}
              />
            </Field>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-3 py-4 bg-[#1A1A1A] text-white text-sm tracking-widest uppercase font-bold hover:bg-[#474747] transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-none mt-4"
            >
              {isSubmitting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <p className="text-center mt-8 text-sm text-[#777777]">
          No account yet?{' '}
          <Link href="/auth/register" className="font-bold text-[#1A1A1A] hover:underline underline-offset-4">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <GuestRoute>
      <LoginPage />
    </GuestRoute>
  );
}
