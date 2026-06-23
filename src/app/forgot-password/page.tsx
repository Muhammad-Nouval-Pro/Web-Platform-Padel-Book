'use client';

import { useActionState } from 'react';
import { requestPasswordReset } from '@/actions/auth';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [state, action, isPending] = useActionState(requestPasswordReset, null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border">
        <div>
          <h2 className="mt-6 text-center text-3xl font-black text-gray-900 tracking-tight">
            Lupa Password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Masukkan email Anda untuk menerima link reset.
          </p>
        </div>

        {state?.error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm border border-red-100">
            {state.error}
          </div>
        )}

        {state?.success && (
          <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm border border-green-100">
            {state.success}
          </div>
        )}

        <form action={action} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                Alamat Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="email@contoh.com"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isPending}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all shadow-lg shadow-indigo-100"
            >
              {isPending ? 'Mengirim...' : 'Kirim Link Reset'}
            </button>
          </div>

          <div className="text-center mt-4">
            <Link href="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Kembali ke Halaman Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
