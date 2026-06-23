import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Star, Phone } from 'lucide-react';
import { CourtSelectionGrid } from '@/components/venue/CourtSelectionGrid';
import { getSession } from '@/lib/session';

export default async function VenuePage(props: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  const params = await props.params;
  // Use raw query to bypass stale Prisma Client mapping for mapsUrl
  const vendors: any[] = await prisma.$queryRawUnsafe(
    'SELECT * FROM "Vendor" WHERE id = $1 AND status = \'APPROVED\'',
    params.id
  );

  if (!vendors || vendors.length === 0) notFound();

  const vendorBasic = vendors[0];

  // Still use prisma for relations as they shouldn't have changed
  const vendorRelations = await prisma.vendor.findUnique({
    where: { id: params.id },
    include: {
      courts: {
        where: { isActive: true },
        include: {
          category: true,
          images: true,
          priceRules: {
            where: {
              OR: [
                { specificDate: null },
                { specificDate: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } }
              ]
            }
          },
          vendor: true // Include vendor in each court for the booking modal
        }
      },
      reviews: {
        include: { customer: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!vendorRelations) notFound();

  // Fix Decimal serialization error: convert Decimal to number
  const sanitizedCourts = vendorRelations.courts.map(court => ({
    ...court,
    priceRules: court.priceRules.map(rule => ({
      ...rule,
      price: Number(rule.price)
    }))
  }));

  const vendor = { 
    ...vendorBasic, 
    ...vendorRelations, 
    courts: sanitizedCourts 
  };

  const avgRating = vendor.reviews.length > 0
    ? (vendor.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / vendor.reviews.length).toFixed(1)
    : "5.0";

  return (
    <div className="flex flex-col flex-1 bg-white">
      {/* 1. Gambar Venue (Banner) */}
      <section className="relative w-full h-[40vh] md:h-[50vh] bg-slate-900 border-b border-gray-200">
        {vendor.imageUrl ? (
          <img src={vendor.imageUrl} alt={vendor.name} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-slate-900 flex items-center justify-center text-white/20 font-black text-6xl italic">
            {vendor.name}
          </div>
        )}
      </section>

      {/* Konten Utama */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          {/* 1. Nama Venue */}
          <div className="mb-6">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">{vendor.name}</h1>
          </div>

          {/* 2. Rating Venue (Realtime) */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span className="font-black text-amber-700">{avgRating}</span>
            </div>
            <span className="text-sm font-medium text-gray-400">({vendor.reviews.length} Ulasan Terverifikasi)</span>
          </div>

          {/* 3. Deskripsi */}
          {vendor.description && (
            <div className="mb-10">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Tentang Venue</h3>
              <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-line">{vendor.description}</p>
            </div>
          )}

          {/* 4. Lokasi Venue & Maps */}
          <div className="mb-12">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Lokasi & Akses</h3>
            <div className="flex items-start gap-2 mb-4">
              <MapPin className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">{vendor.address}</p>
            </div>

            {(() => {
              let finalUrl = vendor.mapsUrl;
              if (finalUrl && finalUrl.includes('<iframe')) {
                const match = finalUrl.match(/src="([^"]+)"/);
                finalUrl = (match && match[1]) ? match[1] : finalUrl;
              }

              return finalUrl ? (
                <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm h-[300px] w-full bg-gray-50">
                  <iframe
                    src={finalUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              ) : (
                <div className="p-10 text-center bg-gray-50 rounded-2xl border border-dashed text-gray-400 text-sm">
                  Peta lokasi belum ditambahkan oleh pengelola.
                </div>
              );
            })()}
          </div>

          <hr className="mb-12 border-gray-100" />

          {/* 5. Pilih Lapangan */}
          <div className="mb-16">
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              Pilih Lapangan
              <span className="bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-lg text-xs tracking-tighter">
                {vendor.courts.length} Lapangan
              </span>
            </h2>

            <CourtSelectionGrid courts={vendor.courts} session={session} />
          </div>

          {/* 6. Ulasan dari Customer */}
          <div className="mb-16">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Ulasan Member</h3>
            <div className="space-y-4">
              {vendor.reviews.length === 0 ? (
                <p className="text-sm text-gray-400 italic">Beberapa pemain baru saja bermain, namun belum ada ulasan tertulis.</p>
              ) : (
                vendor.reviews.map((review: any) => (
                  <div key={review.id} className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                          {review.customer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900">{review.customer.name}</p>
                          <p className="text-[10px] text-gray-400">{new Date(review.createdAt).toLocaleDateString('id-ID')}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                        ))}
                      </div>
                    </div>
                    {review.reviewText && <p className="text-sm text-gray-600 italic leading-relaxed">"{review.reviewText}"</p>}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 7. Reschedule & Pembatalan */}
          <div className="p-6 bg-rose-50 rounded-2xl border border-rose-100">
            <h3 className="text-sm font-bold text-rose-800 mb-3">Reschedule & Pembatalan</h3>
            <ul className="text-xs text-rose-700 space-y-2 list-disc pl-4 leading-relaxed">
              <li>Permintaan reschedule maksimal dilakukan 24 jam sebelum waktu booking.</li>
              <li>Dana yang sudah dibayarkan tidak dapat diuangkan kembali (Non-Refundable).</li>
              <li>Perubahan jadwal tergantung pada ketersediaan lapangan yang ada.</li>
              <li>Dilarang membawa makanan dari luar ke area lapangan utama.</li>
            </ul>
          </div>

        </div>
      </section>
    </div>
  );
}
