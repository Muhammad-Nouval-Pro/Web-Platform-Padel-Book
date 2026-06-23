'use client';
import { loginUser } from '@/actions/auth';
import Link from 'next/link';
import { useActionState } from 'react';

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginUser, { error: '' });

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 text-gray-900 font-sans p-6 py-12">
      <div className="max-w-md w-full bg-white shadow-xl rounded-3xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900">Selamat Datang</h1>
          <p className="mt-2 text-gray-500 text-sm">Login ke akun PADEL.YO Anda.</p>
        </div>

        <form action={formAction} className="space-y-4 mb-8">
          {state?.error && (
            <div className="p-3 text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl font-medium">
              {state.error}
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Alamat Email</label>
            <input type="email" name="email" required className="w-full rounded-xl border-gray-300 focus:border-indigo-500 p-3 border" placeholder="anda@email.com" />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-semibold text-gray-700">Password</label>
              <Link href="/forgot-password" className="text-xs font-semibold text-indigo-600 hover:text-indigo-500">
                Lupa Password?
              </Link>
            </div>
            <input type="password" name="password" required className="w-full rounded-xl border-gray-300 focus:border-indigo-500 p-3 border" placeholder="••••••••" />
          </div>

          <button type="submit" disabled={isPending} className="w-full py-3 px-4 rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition">
            {isPending ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <div className="text-center text-sm text-gray-500 font-medium mb-8">
          Belum punya akun? <Link href="/register" className="text-indigo-600 hover:underline font-bold">Daftar sekarang</Link>
        </div>

      </div>
    </div>
  );
}
