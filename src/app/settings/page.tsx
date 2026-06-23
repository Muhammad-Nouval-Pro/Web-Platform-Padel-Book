'use client';

import { useActionState } from 'react';
import { changePassword } from '@/actions/auth';
import { Lock, ShieldCheck, ChevronRight } from 'lucide-react';

export default function SettingsPage() {
  const [state, action, isPending] = useActionState(changePassword, null);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm border">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <ShieldCheck className="w-6 h-6 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Pengaturan Keamanan</h1>
        </div>
        <p className="text-gray-500">Kelola informasi keamanan dan password akun Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-sm">
        <div className="lg:col-span-1">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Ganti Password</h2>
          <p className="text-gray-500 leading-relaxed">
            Gunakan password yang kuat dan unik untuk menjaga keamanan akun Anda. Disarankan minimal 8 karakter.
          </p>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-8">
            {state?.success && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-100 flex items-center gap-2">
                <span className="font-bold">✓ {state.success}</span>
              </div>
            )}
            
            {state?.error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 italic">
                {state.error}
              </div>
            )}

            <form action={action} className="space-y-5">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Password Saat Ini</label>
                <div className="relative">
                  <input
                    type="password"
                    name="currentPassword"
                    required
                    className="w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border pl-10"
                    placeholder="••••••••"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                </div>
              </div>

              <hr className="border-gray-100 my-6" />

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Password Baru</label>
                <div className="relative">
                  <input
                    type="password"
                    name="newPassword"
                    required
                    className="w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border pl-10"
                    placeholder="Minimal 8 karakter..."
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Konfirmasi Password Baru</label>
                <div className="relative">
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    className="w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border pl-10"
                    placeholder="Ulangi password baru..."
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition shadow-lg shadow-indigo-100 disabled:opacity-50"
                >
                  {isPending ? 'Menyimpan...' : 'Perbarui Password'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
