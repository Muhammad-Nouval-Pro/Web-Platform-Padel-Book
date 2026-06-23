import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import Link from 'next/link';

export default async function VendorCalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== 'VENDOR_ADMIN') redirect('/login');

  const { date: dateParam } = await searchParams;
  const targetDate = dateParam ? new Date(dateParam) : new Date();
  const dateStr = targetDate.toISOString().split('T')[0];

  const vendor = await prisma.vendor.findFirst({
    where: { adminId: session.userId },
    include: {
      courts: {
        include: {
          bookings: {
            where: {
              status: { not: 'CANCELLED' },
              startDatetime: {
                gte: new Date(`${dateStr}T00:00:00`),
                lte: new Date(`${dateStr}T23:59:59`)
              }
            },
            include: { customer: true }
          }
        }
      }
    }
  });

  if (!vendor) redirect('/vendor');

  const hours = Array.from({ length: 18 }, (_, i) => i + 6); // 06:00 - 23:00

  const prevDate = new Date(targetDate);
  prevDate.setDate(prevDate.getDate() - 1);
  const nextDate = new Date(targetDate);
  nextDate.setDate(nextDate.getDate() + 1);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">Kalender Lapangan</h1>
          <p className="text-xs text-gray-500 mt-0.5">Monitoring jadwal main lapangan secara visual.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-2xl border">
          <Link href={`?date=${prevDate.toISOString().split('T')[0]}`} className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <span className="text-sm font-black text-gray-900 min-w-[140px] text-center">
            {targetDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}
          </span>
          <Link href={`?date=${nextDate.toISOString().split('T')[0]}`} className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition">
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Table Header: Courts */}
            <div className="grid grid-cols-[100px_repeat(auto-fit,minmax(150px,1fr))] border-b bg-gray-50/50">
              <div className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center border-r">Jam</div>
              {vendor.courts.map(court => (
                <div key={court.id} className="p-4 text-sm font-black text-slate-800 text-center border-r">
                  {court.name}
                </div>
              ))}
            </div>

            {/* Table Body: Hours & Overlays */}
            <div className="flex flex-col">
              {hours.map(hour => (
                <div key={hour} className="grid grid-cols-[100px_repeat(auto-fit,minmax(150px,1fr))] border-b last:border-b-0 min-h-[80px]">
                  {/* Hour Label */}
                  <div className="p-4 flex flex-col items-center justify-center border-r bg-gray-50/20">
                    <span className="text-sm font-black text-slate-600">
                      {hour.toString().padStart(2, '0')}:00
                    </span>
                    <span className="text-[9px] font-bold text-gray-400">-{hour + 1}:00</span>
                  </div>

                  {/* Court Slots for this hour */}
                  {vendor.courts.map(court => {
                    const booking = court.bookings.find(b => {
                      const bHour = new Date(b.startDatetime).getHours();
                      return bHour === hour;
                    });

                    return (
                      <div key={court.id} className="p-1 border-r last:border-r-0 relative group">
                        {booking ? (
                          <div className={`h-full w-full rounded-2xl p-3 flex flex-col justify-between shadow-sm transition-transform hover:scale-[1.02] ${
                            booking.status === 'PAID' ? 'bg-indigo-600 text-white shadow-indigo-100' : 'bg-amber-100 text-amber-900 border border-amber-200'
                          }`}>
                            <p className="text-[10px] font-black uppercase tracking-tighter truncate">
                              {booking.customer.name}
                            </p>
                            <div className="flex justify-between items-end">
                              <span className="text-[9px] font-bold opacity-80">
                                {booking.status === 'PAID' ? 'Lunas' : 'Pending'}
                              </span>
                              <div className={`w-5 h-5 rounded-lg flex items-center justify-center ${
                                booking.status === 'PAID' ? 'bg-white/20' : 'bg-amber-200'
                              }`}>
                                <Info className="w-3 h-3" />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="h-full w-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                            <span className="text-[10px] font-bold text-gray-300 italic">Available</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Keterangan:</p>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
          <span className="text-[11px] font-medium text-gray-600">Booking Lunas</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-amber-200 rounded-full"></div>
          <span className="text-[11px] font-medium text-gray-600">Menunggu Pembayaran</span>
        </div>
      </div>
    </div>
  );
}
