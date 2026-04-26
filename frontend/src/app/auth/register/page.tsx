'use client';

import React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, User, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import GuestRoute from '@/components/auth/GuestRoute';

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
      <label className="text-xs tracking-widest uppercase font-medium text-[#1A1A1A]">
        {label}
      </label>
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
function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const { register: registerUser } = useAuth();

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await registerUser(data.username, data.email, data.password);
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
            Join the platform
          </span>
          <h1 className="font-display text-4xl text-[#1A1A1A] leading-tight">
            Create your space
          </h1>
        </div>

        {/* Card */}
        <div className="p-8 bg-white border border-[#1A1A1A] shadow-[8px_8px_0px_0px_#1A1A1A]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <Field label="Username" icon={<User size={16} />} error={errors.username?.message}>
              <input
                type="text"
                autoComplete="username"
                placeholder="johndoe"
                className="w-full pl-11 pr-4 py-3 bg-white border border-[#1A1A1A] text-sm focus:outline-none focus:ring-0 rounded-none placeholder:text-[#AAAAAA]"
                {...register('username')}
              />
            </Field>

            <Field label="Email" icon={<Mail size={16} />} error={errors.email?.message}>
              <input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full pl-11 pr-4 py-3 bg-white border border-[#1A1A1A] text-sm focus:outline-none focus:ring-0 rounded-none placeholder:text-[#AAAAAA]"
                {...register('email')}
              />
            </Field>

            <Field label="Password" icon={<Lock size={16} />} error={errors.password?.message}>
              <input
                type="password"
                autoComplete="new-password"
                placeholder="At least 6 characters"
                className="w-full pl-11 pr-4 py-3 bg-white border border-[#1A1A1A] text-sm focus:outline-none focus:ring-0 rounded-none placeholder:text-[#AAAAAA]"
                {...register('password')}
              />
            </Field>

            <Field label="Confirm Password" icon={<Lock size={16} />} error={errors.confirmPassword?.message}>
              <input
                type="password"
                autoComplete="new-password"
                placeholder="Repeat your password"
                className="w-full pl-11 pr-4 py-3 bg-white border border-[#1A1A1A] text-sm focus:outline-none focus:ring-0 rounded-none placeholder:text-[#AAAAAA]"
                {...register('confirmPassword')}
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
                  Register
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <p className="text-center mt-8 text-sm text-[#777777]">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-bold text-[#1A1A1A] hover:underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function Register() {
  return (
    <GuestRoute>
      <RegisterPage />
    </GuestRoute>
  );
}
