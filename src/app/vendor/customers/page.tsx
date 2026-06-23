import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Users, Phone, Mail, Calendar } from 'lucide-react';

export default async function VendorCustomersPage() {
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

  // Fetch unique customers who booked at this vendor's courts
  // We'll join Booking -> Court -> Vendor
  const bookingsWithCustomers = await prisma.booking.findMany({
    where: {
      court: {
        vendorId: vendor.id
      }
    },
    include: {
      customer: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Group by customer to get unique ones with last booking info
  const customerMap = new Map();
  bookingsWithCustomers.forEach((booking) => {
    if (!customerMap.has(booking.customerId)) {
      customerMap.set(booking.customerId, {
        ...booking.customer,
        lastBookingDate: booking.createdAt,
        totalBookings: 1
      });
    } else {
      const existing = customerMap.get(booking.customerId);
      existing.totalBookings += 1;
    }
  });

  const uniqueCustomers = Array.from(customerMap.values());

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-gray-900 leading-tight">Kelola Customer</h1>
            <p className="text-xs text-gray-500 mt-0.5">Daftar pemain yang pernah bertanding di venue Anda.</p>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Cari nama atau email..."
              className="pl-9 pr-4 py-2 bg-gray-50 border-gray-100 rounded-xl text-xs focus:ring-indigo-500 focus:border-indigo-500 w-full md:w-64 border"
            />
            <Users className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kontak & Informasi</th>
                <th className="px-6 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Loyalitas</th>
                <th className="px-6 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {uniqueCustomers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="w-10 h-10 text-gray-100" />
                      <p className="text-xs text-gray-400 italic">Belum ada riwayat customer yang terekam.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                uniqueCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50/30 transition group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 leading-tight">{customer.name}</p>
                          <p className="text-[10px] text-gray-400 font-medium tracking-tight">MEMBER SEJAK {new Date(customer.createdAt).getFullYear()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Mail className="w-3 h-3 text-indigo-400" /> {customer.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 italic">
                          <Phone className="w-3 h-3 text-gray-300" /> {customer.phone || 'No Phone'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-sm font-black text-slate-700">{customer.totalBookings}</span>
                        <span className="text-[9px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">Total Booking</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-[10px] font-bold text-gray-400 hover:text-indigo-600 transition tracking-widest uppercase">
                        Detail Riwayat
                      </button>
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
