'use client';

import { useState } from 'react';
import { Calendar, Clock, MapPin, CheckCircle2, AlertCircle, Ticket, Star } from 'lucide-react';
import { BookingRatingModal } from './BookingRatingModal';

export function BookingList({ bookings }: { bookings: any[] }) {
  const [activeBooking, setActiveBooking] = useState<any>(null);
  const now = new Date();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bookings.map((booking) => {
          const endDate = new Date(booking.endDatetime);
          const isFinished = endDate < now;
          const canRate = booking.status === 'PAID' && isFinished && !booking.review;

          return (
            <div key={booking.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-300">
              {/* Status Bar */}
              <div className={`px-6 py-4 flex items-center justify-between transition-colors ${
                booking.status === 'PAID' ? 'bg-emerald-50 text-emerald-700' :
                booking.status === 'CANCELLED' ? 'bg-red-50 text-red-700' :
                'bg-amber-50 text-amber-700'
              }`}>
                <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                  {booking.status === 'PAID' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                  {booking.status === 'PAID' ? 'Sudah Dibayar' : 'Menunggu Pembayaran'}
                </span>
                <span className="text-[10px] font-bold opacity-60">INV-{booking.id.split('-')[0].toUpperCase()}</span>
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="font-black text-gray-900 text-xl leading-tight group-hover:text-indigo-600 transition-colors">{booking.court.vendor.name}</h3>
                    <p className="text-sm text-gray-500 font-bold mt-0.5">{booking.court.name}</p>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-2xl group-hover:bg-indigo-600 group-hover:rotate-12 transition-all">
                    <Ticket className="w-6 h-6 text-indigo-600 group-hover:text-white" />
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-sm text-gray-600 font-semibold">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-indigo-400" />
                    </div>
                    {new Date(booking.startDatetime).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 font-semibold">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-indigo-400" />
                    </div>
                    {new Date(booking.startDatetime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.endDatetime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-gray-300" />
                    </div>
                    <span className="truncate">{booking.court.vendor.address}</span>
                  </div>
                </div>

                <div className="mt-auto pt-8 border-t border-dashed border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-0.5">Total Bayar</p>
                    <p className="font-black text-gray-900 text-lg">Rp {Number(booking.totalPrice).toLocaleString('id-ID')}</p>
                  </div>

                  {canRate ? (
                    <button 
                      onClick={() => setActiveBooking(booking)}
                      className="bg-amber-400 text-white font-black px-6 py-3 rounded-2xl hover:bg-amber-500 transition shadow-lg shadow-amber-100 flex items-center gap-2 active:scale-95"
                    >
                      <Star className="w-4 h-4 fill-white" />
                      Beri Rating
                    </button>
                  ) : booking.review ? (
                    <div className="flex items-center gap-1.5 bg-gray-50 px-4 py-2.5 rounded-2xl border border-gray-100">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-black text-gray-700">{booking.review.rating}</span>
                    </div>
                  ) : booking.status === 'PAID' && !isFinished && (
                    <div className="bg-gray-100/50 px-5 py-3 rounded-2xl border border-gray-100">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter text-center mb-0.5">Ticket ID</p>
                      <p className="text-sm font-black text-gray-700 font-mono tracking-wider">{booking.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {activeBooking && (
        <BookingRatingModal 
          bookingId={activeBooking.id}
          vendorName={activeBooking.court.vendor.name}
          onClose={() => setActiveBooking(null)}
        />
      )}
    </>
  );
}
