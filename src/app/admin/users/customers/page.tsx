import { prisma } from '@/lib/prisma';
import { deleteUser } from '@/actions/admin';
import { Trash2 } from 'lucide-react';

export default async function CustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: 'CUSTOMER' },
    include: {
      _count: {
        select: { bookings: true, joinedMatches: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Akun Pelanggan</h1>
          <p className="text-gray-500 text-sm mt-1">Daftar pelanggan (End-User) yang terdaftar di platform Anda.</p>
        </div>
        <div className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-2 rounded-xl text-sm font-bold">
          Total: {customers.length} Pengguna
        </div>
      </div>

      <div className="border border-gray-200 bg-white shadow-sm rounded-xl overflow-hidden h-fit">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-700 font-semibold uppercase tracking-wider">
            <tr>
              <th className="p-4">Info Pelanggan</th>
              <th className="p-4">Aktivitas</th>
              <th className="p-4">Tanggal Daftar</th>
              <th className="p-4 w-24">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">Belum ada pelanggan yang mendaftar.</td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50/50">
                  <td className="p-4">
                    <div className="font-bold text-gray-900">{customer.name}</div>
                    <div className="text-xs text-gray-500">{customer.email}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{customer.phone || '-'}</div>
                  </td>
                  <td className="p-4 text-xs font-medium">
                    <span className="block mb-1 text-slate-700">Bookings: <b className="text-indigo-600">{customer._count.bookings}</b></span>
                    <span className="block text-slate-700">Ikut Mabar: <b className="text-teal-600">{customer._count.joinedMatches}</b></span>
                  </td>
                  <td className="p-4 text-xs">
                    {new Date(customer.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </td>
                  <td className="p-4">
                    <form action={async () => { 'use server'; await deleteUser(customer.id, '/admin/users/customers'); }}>
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
  );
}
