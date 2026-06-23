import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Calendar, Search } from 'lucide-react';
import Link from 'next/link';
import { BookingList } from '@/components/booking/BookingList';

export default async function MyBookingsPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const rawBookings = await prisma.booking.findMany({
    where: { customerId: session.userId },
    include: {
      court: { include: { vendor: true } },
      review: true
    },
    orderBy: { startDatetime: 'desc' }
  });

  // Convert Decimals to numbers for client components
  const bookings = rawBookings.map(b => ({
    ...b,
    totalPrice: b.totalPrice.toNumber(),
    depositPaid: b.depositPaid.toNumber(),
  }));

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      <div className="bg-white border-b border-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Riwayat Main</h1>
              <p className="text-gray-500 font-medium">Lihat tiket digital dan beri ulasan lapangan favoritmu.</p>
            </div>
            <Link 
              href="/" 
              className="flex items-center gap-2 bg-indigo-50 text-indigo-600 font-black px-6 py-3 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
            >
              <Search className="w-5 h-5" />
              Sewa Lapangan Lagi
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-12">
        {bookings.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-gray-100 flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8">
              <Calendar className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-3">Belum ada pesanan</h3>
            <p className="text-gray-500 font-medium max-w-sm mb-10 leading-relaxed">
              Jadwal main kamu masih kosong nih. Yuk, cari lapangan dan mulai kumpulkan poin!
            </p>
            <Link href="/" className="bg-indigo-600 text-white font-black px-10 py-4 rounded-2xl hover:bg-slate-900 transition shadow-xl shadow-indigo-100 active:scale-95">
              Cari Lapangan Sekarang
            </Link>
          </div>
        ) : (
          <BookingList bookings={bookings} />
        )}
      </div>
    </div>
  );
}
