import { prisma } from '@/lib/prisma';
import { Users, Calendar, MapPin, Info } from 'lucide-react';
import Link from 'next/link';
import { getSession } from '@/lib/session';

export default async function OpenMatchesPage() {
  const session = await getSession();
  
  const openBookings = await prisma.booking.findMany({
    where: { 
      isOpenMatch: true, 
      status: 'PAID', // In real life, might be PENDING or PAID
      startDatetime: { gte: new Date() } 
    },
    include: {
      court: { include: { vendor: true } },
      customer: true,
      participants: true
    },
    orderBy: { startDatetime: 'asc' }
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-12 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center text-balance max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 text-sm font-semibold mb-4">
            🔥 Mabar Padel
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">Open Matches</h1>
          <p className="text-lg text-gray-600">Gabung dengan komunitas, cari teman main, dan bentuk tim padel yang solid. Slot terbatas, buruan join!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {openBookings.length === 0 ? (
            <div className="col-span-full p-8 md:p-12 bg-white rounded-3xl border border-gray-200 shadow-sm text-center flex flex-col items-center">
              <Info className="w-12 h-12 text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Belum ada Open Match tersedia</h3>
              <p className="text-gray-500">Saat ini tidak ada user yang membuaka sesi mabar. Jadilah yang pertama membuat booking dengan fitur Open Match!</p>
              <Link href="/" className="mt-6 inline-flex bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl shadow-sm hover:bg-indigo-700 transition">
                Booking Lapangan Sekarang
              </Link>
            </div>
          ) : (
            openBookings.map((match) => {
              const joinedPlayers = match.participants.length + 1; // +1 with the creator
              const totalNeeded = match.playersNeeded || 4; // default 4 for padel
              const isFull = joinedPlayers >= totalNeeded;

              return (
                <div key={match.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition p-6 md:p-8 flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl uppercase shadow-inner">
                        {match.customer.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{match.customer.name}</h3>
                        <p className="text-xs text-gray-500 font-medium">Pembuat Sesi</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border ${
                      isFull ? 'bg-gray-100 text-gray-600 border-gray-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      <Users className="w-3.5 h-3.5" />
                      {joinedPlayers}/{totalNeeded} Pemain
                    </div>
                  </div>

                  <div className="space-y-4 mb-8 bg-gray-50 p-5 rounded-2xl border border-gray-100 flex-1">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900">{match.court.vendor.name}</p>
                        <p className="text-sm text-gray-600 leading-snug">{match.court.name} • {match.court.vendor.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {match.startDatetime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        <p className="text-sm text-gray-600">
                          {match.startDatetime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - {match.endDatetime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {isFull ? (
                    <button disabled className="w-full py-4 rounded-xl font-bold text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed">
                      Slot Penuh
                    </button>
                  ) : (
                    <form action={async () => {
                      'use server';
                      // Fake join action for demonstration
                      console.log('Joined match', match.id);
                    }}>
                      <button className="w-full py-4 rounded-xl font-bold tracking-wide text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Join Pertandingan
                      </button>
                    </form>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
