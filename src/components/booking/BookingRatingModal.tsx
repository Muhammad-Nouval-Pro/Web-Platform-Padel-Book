'use client';

import { useState } from 'react';
import { Star, X } from 'lucide-react';
import { submitReview } from '@/actions/review';

export function BookingRatingModal({ bookingId, vendorName, onClose }: { bookingId: string, vendorName: string, onClose: () => void }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Silakan pilih rating (bintang).');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('bookingId', bookingId);
    formData.append('rating', rating.toString());
    formData.append('reviewText', text);

    const res = await submitReview(formData);
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Beri Rating</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          <p className="text-gray-500 mb-8">Bagaimana pengalaman main kamu di <span className="font-bold text-gray-900">{vendorName}</span>?</p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="transition-transform active:scale-90"
                >
                  <Star 
                    className={`w-12 h-12 transition-colors ${
                      (hover || rating) >= star ? 'fill-amber-400 text-amber-400' : 'text-gray-200'
                    }`} 
                  />
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2">Komentar (Opsional)</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Tulis ulasan singkat kamu di sini..."
                className="w-full h-32 p-6 bg-gray-50 rounded-3xl border-0 focus:ring-2 focus:ring-indigo-500 transition resize-none text-gray-700 font-medium"
              />
            </div>

            {error && <p className="text-red-500 text-sm font-bold bg-red-50 p-4 rounded-2xl">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-indigo-600 text-white rounded-3xl font-black text-lg shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? 'Mengirim...' : 'Kirim Ulasan'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
