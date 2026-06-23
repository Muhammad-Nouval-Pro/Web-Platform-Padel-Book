'use client';

import { useActionState, use } from 'react';
import { resetPassword } from '@/actions/auth';
import Link from 'next/link';

export default function ResetPasswordPage(props: { searchParams: Promise<{ token?: string }> }) {
  const searchParams = use(props.searchParams);
  const token = searchParams.token;
  const [state, action, isPending] = useActionState(resetPassword, null);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center border max-w-sm">
          <p className="text-red-600 font-bold mb-4">Token reset tidak ditemukan.</p>
          <Link href="/forgot-password" className="text-indigo-600 hover:underline">Minta token baru</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border">
        <div>
          <h2 className="mt-6 text-center text-3xl font-black text-gray-900 tracking-tight">
            Reset Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Silakan masukkan password baru Anda.
          </p>
        </div>

        {state?.error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm border border-red-100">
            {state.error}
          </div>
        )}

        {state?.success && (
          <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm border border-green-100 text-center">
            <p className="font-bold">{state.success}</p>
            <div className="mt-4">
              <Link href="/login" className="bg-green-600 text-white px-6 py-2 rounded-xl inline-block font-bold">Lanjut Login</Link>
            </div>
          </div>
        )}

        {!state?.success && (
          <form action={action} className="mt-8 space-y-6">
            <input type="hidden" name="token" value={token} />
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Password Baru</label>
                <input
                  name="newPassword"
                  type="password"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Konfirmasi Password Baru</label>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition shadow-lg shadow-indigo-100"
            >
              {isPending ? 'Memproses...' : 'Ubah Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
