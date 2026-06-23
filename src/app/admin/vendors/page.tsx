import { prisma } from '@/lib/prisma';
import { approveVendor, rejectVendor } from '@/actions/admin';
import { Building2, Phone, CheckCircle, XCircle } from 'lucide-react';

export default async function VendorsPage() {
  const vendors = await prisma.vendor.findMany({
    orderBy: { createdAt: 'desc' },
    include: { admin: true }
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <h1 className="text-2xl font-bold text-gray-900">Validasi Vendor</h1>
        <p className="text-gray-500 mt-1">Review dan terima pendaftaran vendor padel club baru.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Cabang Padel</th>
              <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Pemilik / Kontak</th>
              <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Status</th>
              <th className="px-6 py-4 font-semibold text-gray-600 text-sm text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {vendors.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">Belum ada vendor yang mendaftar.</td>
              </tr>
            ) : (
              vendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{vendor.name}</div>
                        <div className="text-xs text-gray-500 max-w-[200px] truncate">{vendor.address}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{vendor.admin?.name || 'Unknown'}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3" /> {vendor.contactPhone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      vendor.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      vendor.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {vendor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {vendor.status === 'PENDING' ? (
                      <div className="flex items-center justify-center gap-2">
                        <form action={async () => { 'use server'; await approveVendor(vendor.id); }}>
                          <button className="flex items-center gap-1 text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg transition shadow-sm">
                            <CheckCircle className="w-4 h-4" /> Approve
                          </button>
                        </form>
                        <form action={async () => { 'use server'; await rejectVendor(vendor.id); }}>
                          <button className="flex items-center gap-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg transition shadow-sm">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </form>
                      </div>
                    ) : (
                      <div className="text-center text-sm text-gray-400 italic">No Actions</div>
                    )}
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
