'use client';
import { registerCustomer } from '@/actions/auth';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useActionState } from 'react';

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerCustomer, { error: '' });

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 text-gray-900 font-sans p-6">
      <div className="max-w-md w-full bg-white shadow-xl rounded-3xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900">Daftar Akun</h1>
          <p className="mt-2 text-gray-500 text-sm">Bergabunglah dengan PADEL.YO. Buat akun gratis dan mulai mabar!</p>
        </div>

        {state?.success ? (
          <div className="text-center space-y-6 py-4">
            <div className="bg-green-50 text-green-700 p-6 rounded-2xl border border-green-100 italic">
              <p className="font-bold text-lg mb-2">Pendaftaran Berhasil!</p>
              <p className="text-sm leading-relaxed">{state.success}</p>
            </div>
            <Link 
              href="/login" 
              className="w-full inline-flex justify-center items-center py-3 px-4 rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition"
            >
              Lanjut ke Halaman Login
            </Link>
          </div>
        ) : (
          <form action={formAction} className="space-y-4">
            {state?.error && (
              <div className="p-3 text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl font-medium">
                {state.error}
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap</label>
              <input type="text" name="name" required className="w-full rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 p-3 border" placeholder="Masukkan Nama Anda" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Alamat Email</label>
              <input type="email" name="email" required className="w-full rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 p-3 border" placeholder="Masukkan Email Anda" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nomor Telepon</label>
              <input type="text" name="phone" className="w-full rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 p-3 border" placeholder="Masukkan Nomor Telepon Anda" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <input type="password" name="password" required className="w-full rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 p-3 border" placeholder="Masukkan Password Anda" />
            </div>

            <button type="submit" disabled={isPending} className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-sm shadow-indigo-200 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition mt-6">
              {isPending ? 'Memproses...' : 'Daftar'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-gray-500 font-medium">
          Sudah punya akun? <Link href="/login" className="text-indigo-600 hover:underline font-bold">Login di sini</Link>
        </div>
      </div>
    </div>
  );
}
