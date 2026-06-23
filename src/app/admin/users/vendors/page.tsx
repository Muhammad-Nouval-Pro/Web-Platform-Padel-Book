import { prisma } from '@/lib/prisma';
import { createVendorAdmin, deleteUser } from '@/actions/admin';
import { Trash2 } from 'lucide-react';

export default async function VendorAdminsPage() {
  const vendorAdmins = await prisma.user.findMany({
    where: { role: 'VENDOR_ADMIN' },
    include: { vendors: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Kelola Akun Vendor Admin</h1>
        <p className="text-gray-500 text-sm mt-1">Buat akun untuk pemilik Padel Club agar mereka bisa login dan mendaftarkan lapangannya.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 border border-gray-200 bg-white shadow-sm rounded-2xl p-6 h-fit">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Buat Akun Vendor Baru</h2>
          <form action={async (fd) => { 'use server'; await createVendorAdmin(fd); }} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Pemilik</label>
              <input type="text" name="name" required className="w-full text-sm rounded-xl border border-gray-300 p-2.5 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Budi Santoso" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email (Untuk Login)</label>
              <input type="email" name="email" required className="w-full text-sm rounded-xl border border-gray-300 p-2.5 focus:ring-indigo-500 focus:border-indigo-500" placeholder="budi@padel.com" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Nomor WA</label>
              <input type="text" name="phone" className="w-full text-sm rounded-xl border border-gray-300 p-2.5 focus:ring-indigo-500 focus:border-indigo-500" placeholder="08..." />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Password Sementara</label>
              <input type="password" name="password" required className="w-full text-sm rounded-xl border border-gray-300 p-2.5 focus:ring-indigo-500 focus:border-indigo-500" placeholder="password123" />
            </div>
            <button type="submit" className="w-full bg-indigo-600 font-bold text-white text-sm py-2.5 rounded-xl hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition">
              + Buat Akun
            </button>
          </form>
        </div>

        <div className="md:col-span-2 border border-gray-200 bg-white shadow-sm rounded-xl overflow-hidden h-fit">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-700 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">Info Vendor Admin</th>
                <th className="p-4">Padel Club Terdaftar</th>
                <th className="p-4 w-24">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vendorAdmins.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-500">Belum ada akun Vendor Admin yang dibuat.</td>
                </tr>
              ) : (
                vendorAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50/50">
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{admin.name}</div>
                      <div className="text-xs text-gray-500">{admin.email}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{admin.phone || '-'}</div>
                    </td>
                    <td className="p-4">
                      {admin.vendors.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {admin.vendors.map(v => (
                            <span key={v.id} className="inline-flex max-w-max items-center px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-semibold">
                              {v.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic text-xs">Belum setel klub</span>
                      )}
                    </td>
                    <td className="p-4">
                      <form action={async () => { 'use server'; await deleteUser(admin.id, '/admin/users/vendors'); }}>
                        <button type="submit" className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition" title="Hapus Akun">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
