import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Calendar, Wallet, TrendingUp, Info } from 'lucide-react';
import { ExportBookingsButton } from '@/components/vendor/ExportBookingsButton';

export default async function VendorBookingsPage() {
  const session = await getSession();
  if (!session || session.role !== 'VENDOR_ADMIN') redirect('/login');

  const vendor = await prisma.vendor.findFirst({
    where: { adminId: session.userId }
  });

  if (!vendor) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl shadow-sm border border-dashed">
        <p className="text-gray-500">Profil Vendor belum lengkap.</p>
      </div>
    );
  }

  // Fetch all bookings for this vendor
  const bookings = await prisma.booking.findMany({
    where: {
      court: {
        vendorId: vendor.id
      }
    },
    include: {
      customer: true,
      court: true
    },
    orderBy: {
      startDatetime: 'desc'
    }
  });

  const totalRevenue = bookings
    .filter(b => b.status === 'PAID' || b.status === 'COMPLETED')
    .reduce((sum, b) => sum + Number(b.totalPrice), 0);

  const pendingRevenue = bookings
    .filter(b => b.status === 'PENDING')
    .reduce((sum, b) => sum + Number(b.totalPrice), 0);

  const exportData = bookings.map(b => ({
    id: b.id,
    customerName: b.customer.name,
    courtName: b.court.name,
    date: new Date(b.startDatetime).toLocaleDateString('id-ID'),
    startTime: new Date(b.startDatetime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    endTime: new Date(b.endDatetime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    status: b.status,
    totalPrice: Number(b.totalPrice),
    createdAt: new Date(b.createdAt).toLocaleDateString('id-ID')
  }));

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-gray-900 leading-tight">Riwayat Booking & Pendapatan</h1>
            <p className="text-xs text-gray-500 mt-0.5">Pantau semua pesanan lapangan dan arus kas masuk.</p>
          </div>
          <ExportBookingsButton 
            data={exportData} 
            filename={`Laporan_Booking_${vendor.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border p-6 flex items-center gap-4">
          <div className="p-4 rounded-xl bg-green-50">
            <Wallet className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Pendapatan (Lunas)</p>
            <p className="text-2xl font-black text-gray-900">Rp {totalRevenue.toLocaleString('id-ID')}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6 flex items-center gap-4">
          <div className="p-4 rounded-xl bg-amber-50">
            <TrendingUp className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Potensi (Pending)</p>
            <p className="text-2xl font-black text-gray-900">Rp {pendingRevenue.toLocaleString('id-ID')}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6 flex items-center gap-4">
          <div className="p-4 rounded-xl bg-indigo-50">
            <Calendar className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Pesanan</p>
            <p className="text-2xl font-black text-gray-900">{bookings.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Informasi Booking</th>
                <th className="px-6 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Waktu Main</th>
                <th className="px-6 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Total Bayar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Calendar className="w-10 h-10 text-gray-100" />
                      <p className="text-xs text-gray-400 italic">Belum ada riwayat booking.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50/30 transition group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                          {booking.customer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 leading-tight">{booking.customer.name}</p>
                          <p className="text-[10px] text-gray-400 font-medium tracking-tight uppercase">{booking.court.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <p className="text-sm font-semibold text-gray-700">
                          {new Date(booking.startDatetime).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}
                        </p>
                        <p className="text-[10px] text-gray-500 font-medium">
                          {new Date(booking.startDatetime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.endDatetime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-tighter ${
                        booking.status === 'PAID' ? 'bg-green-50 text-green-600' :
                        booking.status === 'COMPLETED' ? 'bg-blue-50 text-blue-600' :
                        booking.status === 'CANCELLED' ? 'bg-red-50 text-red-600' :
                        'bg-amber-50 text-amber-600'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm font-black text-gray-900">
                        Rp {Number(booking.totalPrice).toLocaleString('id-ID')}
                      </p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-indigo-50 p-4 rounded-2xl flex gap-3 items-start">
        <Info className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-indigo-800 leading-relaxed">
          <strong>Tip:</strong> Anda dapat mengunduh laporan bulanan dalam format Excel menggunakan tombol di pojok kanan atas. Pastikan semua status pembayaran sudah diperbarui untuk menghitung pendapatan asli secara akurat.
        </p>
      </div>
    </div>
  );
}
