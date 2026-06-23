'use client';

import { useState } from 'react';
import { CourtBookingModal } from '@/components/booking/CourtBookingModal';

type CourtSelectionGridProps = {
  courts: any[];
  session: any;
};

export function CourtSelectionGrid({ courts, session }: CourtSelectionGridProps) {
  const [selectedCourt, setSelectedCourt] = useState<any | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courts.map((court: any) => {
          const primaryImage = court.images.find((img: any) => img.isPrimary)?.url || court.images[0]?.url;
          const minPrice = court.priceRules.length > 0
            ? Math.min(...court.priceRules.map((r: any) => Number(r.price)))
            : null;

          return (
            <div key={court.id} className="group p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="aspect-[16/10] relative rounded-xl overflow-hidden bg-gray-100 mb-4">
                {primaryImage ? (
                  <img src={primaryImage} alt={court.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 italic text-xs">No Photo</div>
                )}
                <div className="absolute top-2 left-2 flex gap-1">
                  <span className="bg-white/90 backdrop-blur text-[10px] font-bold px-2 py-1 rounded-md text-slate-800">
                    {court.type}
                  </span>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition truncate">{court.name}</h4>
                <p className="text-xs text-gray-500 mb-1">{court.category.name}</p>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-4">
                  <span className="text-sm font-black text-gray-800">
                    {minPrice ? `Rp ${minPrice.toLocaleString('id-ID')}` : 'N/A'}<span className="text-[10px] text-gray-400 font-medium italic">/jam</span>
                  </span>
                  <button 
                    onClick={() => setSelectedCourt(court)}
                    className="bg-indigo-600 text-white text-[10px] font-bold px-4 py-2 rounded-lg hover:bg-slate-900 transition uppercase tracking-widest"
                  >
                    Pilih
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedCourt && (
        <CourtBookingModal 
          court={selectedCourt} 
          session={session}
          onClose={() => setSelectedCourt(null)} 
        />
      )}
    </>
  );
}
