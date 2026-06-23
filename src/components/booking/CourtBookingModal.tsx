'use client';

import { useState, useEffect } from 'react';
import { createBooking, getBookedSlots, simulatePayment } from '@/actions/booking';
import { calculatePrice } from '@/lib/pricing';
import { X, Calendar as CalendarIcon, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

type CourtBookingModalProps = {
  court: any;
  session: any;
  onClose: () => void;
};

export function CourtBookingModal({ court, session, onClose }: CourtBookingModalProps) {
  const router = useRouter();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [bookedSlots, setBookedSlots] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'confirming' | 'paying' | 'success'>('idle');
  const [lastBookingId, setLastBookingId] = useState<string | null>(null);

  const getAvailableHours = () => {
    const dayOfWeek = new Date(date).getDay();
    const dateStr = date;
    
    // Find rules for this day
    const rules = court.priceRules.filter((r: any) => {
      if (r.specificDate) {
        const ruleDate = typeof r.specificDate === 'string' 
          ? r.specificDate.split('T')[0] 
          : r.specificDate.toISOString().split('T')[0];
        return ruleDate === dateStr;
      }
      return r.dayOfWeek === dayOfWeek;
    });

    if (rules.length === 0) return [];

    let minHour = 24;
    let maxHour = 0;

    rules.forEach((r: any) => {
      const start = parseInt(r.startTime.split(':')[0]);
      let end = parseInt(r.endTime.split(':')[0]);
      if (end === 0) end = 24; // Treat 00:00 as 24:00 midnight
      if (start < minHour) minHour = start;
      if (end > maxHour) maxHour = end;
    });

    const now = new Date();
    const currentHour = now.getHours();
    const isToday = date === now.toISOString().split('T')[0];

    // Generate hours matching the rules
    const slots = [];
    for (let i = minHour; i < maxHour; i++) {
      // If today, hide hours that have passed
      if (isToday && i <= currentHour) continue;
      slots.push(i);
    }
    return slots;
  };

  const hours = getAvailableHours();

  useEffect(() => {
    async function checkAvailability() {
      const booked = await getBookedSlots(court.id, date);
      const slots: number[] = [];
      booked.forEach(b => {
        for (let i = b.start; i < b.end; i++) slots.push(i);
      });
      setBookedSlots(slots);
      setSelectedSlot(null);
    }
    checkAvailability();
  }, [date, court.id]);

  const handleBooking = async () => {
    if (!session) {
      router.push('/login');
      return;
    }
    if (selectedSlot === null) return;
    setLoading(true);
    
    const startTime = `${selectedSlot.toString().padStart(2, '0')}:00`;
    const price = calculatePrice(new Date(date), startTime, 1, court.priceRules);

    const formData = new FormData();
    formData.append('courtId', court.id);
    formData.append('date', date);
    formData.append('startTime', startTime);
    formData.append('duration', '1');
    formData.append('totalPrice', price.toString());

    const result = await createBooking(formData);
    
    if (result.success) {
      setLastBookingId(result.bookingId!);
      setBookingStatus('paying');
    } else {
      alert(result.error);
    }
    setLoading(false);
  };

  const handleSimulatePayment = async () => {
    if (!lastBookingId) return;
    setLoading(true);
    const result = await simulatePayment(lastBookingId);
    if (result.success) {
      setBookingStatus('success');
      setTimeout(() => {
        onClose();
        router.push('/bookings');
      }, 2000);
    }
    setLoading(false);
  };

  const currentPrice = selectedSlot !== null 
    ? calculatePrice(new Date(date), `${selectedSlot.toString().padStart(2, '0')}:00`, 1, court.priceRules)
    : 0;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="relative p-8 pb-0 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">{court.name}</h2>
            <p className="text-sm text-gray-500 font-medium">{court.vendor?.name || 'Venue'}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="p-8">
          {bookingStatus === 'success' ? (
            <div className="py-12 text-center flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-2">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-black text-gray-900">Pembayaran Berhasil!</h3>
              <p className="text-gray-500">Booking Anda telah dikonfirmasi. Mengalihkan...</p>
            </div>
          ) : bookingStatus === 'paying' ? (
            <div className="py-8 space-y-6">
              <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 italic text-center">
                <p className="text-sm text-indigo-700">Simulasi Payment Gateway Midtrans</p>
                <p className="text-2xl font-black text-indigo-900 mt-2">Rp {currentPrice.toLocaleString('id-ID')}</p>
              </div>
              <button 
                onClick={handleSimulatePayment}
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-emerald-100 transition flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Bayar Sekarang (Simulasi)'}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Date Selection */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <CalendarIcon className="w-3.5 h-3.5" /> Pilih Tanggal
                </label>
                <input 
                  type="date" 
                  value={date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-gray-50 border-gray-100 rounded-2xl p-4 font-bold text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition border outline-none"
                />
              </div>

              {/* Slots Selection */}
              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" /> Pilih Jam Tersedia (1 Jam)
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {hours.length === 0 ? (
                    <div className="col-span-full py-4 text-center bg-gray-50 rounded-2xl border border-dashed text-gray-400 text-xs italic">
                      Tidak ada jam tersedia untuk tanggal ini.
                    </div>
                  ) : (
                    hours.map((h) => {
                      const isBooked = bookedSlots.includes(h);
                      const isSelected = selectedSlot === h;
                      return (
                        <button
                          key={h}
                          disabled={isBooked}
                          onClick={() => setSelectedSlot(h)}
                          className={`py-3 rounded-xl text-sm font-bold transition border ${
                            isBooked ? 'bg-gray-50 text-gray-300 border-gray-50 cursor-not-allowed' :
                            isSelected ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200' :
                            'bg-white text-gray-700 border-gray-100 hover:border-indigo-300 hover:text-indigo-600'
                          }`}
                        >
                          {h.toString().padStart(2, '0')}:00
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Total Summary */}
              <div className="pt-6 border-t border-dashed flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Estimasi Harga</p>
                  <p className="text-2xl font-black text-gray-900">
                    {selectedSlot !== null ? `Rp ${currentPrice.toLocaleString('id-ID')}` : '-'}
                  </p>
                </div>
                <button 
                  onClick={handleBooking}
                  disabled={selectedSlot === null || loading}
                  className="bg-indigo-600 hover:bg-slate-900 disabled:bg-gray-200 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-indigo-100 transition flex items-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Lanjutkan Booking'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
