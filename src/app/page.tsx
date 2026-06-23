import { prisma } from '@/lib/prisma';
import Image from "next/image";
import Link from 'next/link';
import { Search, MapPin, Star, PlayCircle } from 'lucide-react';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ city?: string }>;
}) {
  const { city } = await searchParams;
  const cityQuery = Array.isArray(city) ? city[0] : city;

  // Fetch active vendors
  // Fetch active vendors
  let vendors: any[] = [];
  try {
    vendors = await prisma.vendor.findMany({
      where: {
        status: 'APPROVED',
        address: cityQuery ? {
          contains: cityQuery,
          mode: 'insensitive'
        } : undefined
      },
      include: {
        courts: {
          include: { priceRules: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 6
    });
  } catch (error) {
    console.error('DATABASE_ERROR: Failed to fetch vendors', error);
  }

  return (
    <div className="flex flex-col flex-1 bg-white">
      {/* Hero Section */}
      <section className="relative w-full bg-slate-900 overflow-hidden pt-24 pb-32">
        {/* Dynamic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-emerald-900"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/20 blur-[120px] rounded-full point-events-none"></div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-sm font-semibold mb-6">
            <PlayCircle className="w-4 h-4" /> Platform Booking Padel Jabodetabek
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
            Main Padel Kapan Saja,<br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">Tanpa Ribet.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl font-light">
            Temukan lapangan padel eksklusif di seluruh area Jabodetabek, cek harga secara real-time, dan ajak temanmu mabar. Semua dalam satu aplikasi.
          </p>

          <form action="/#venues" method="GET" className="w-full max-w-3xl bg-white/10 backdrop-blur-xl p-2 rounded-2xl border border-white/20 shadow-2xl flex flex-col md:flex-row gap-2">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-slate-400" />
              </div>
              <select
                name="city"
                className="w-full pl-12 pr-10 py-4 rounded-xl bg-white/5 border border-transparent focus:bg-white/10 focus:border-indigo-400 focus:ring-0 text-slate-300 appearance-none cursor-pointer transition hover:bg-white/10"
                defaultValue={city || ""}
              >
                <option value="" className="text-slate-900">Semua Kota (Jabodetabek)</option>
                <option value="jakarta" className="text-slate-900">Jakarta</option>
                <option value="bogor" className="text-slate-900">Bogor</option>
                <option value="depok" className="text-slate-900">Depok</option>
                <option value="tangerang" className="text-slate-900">Tangerang</option>
                <option value="bekasi" className="text-slate-900">Bekasi</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 group">
              <Search className="w-5 h-5 group-hover:scale-110 transition" /> Cari Lapangan
            </button>
          </form>
        </div>
      </section>

      {/* Venues Grid */}
      <section id="venues" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Rekomendasi Lapangan</h2>
              <p className="text-gray-500 mt-2">Pilihan lapangan padel terbaik yang bisa kamu booking sekarang.</p>
            </div>
            <Link href="#" className="hidden sm:inline-flex text-indigo-600 font-bold hover:text-indigo-700">Lihat Semua →</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vendors.length === 0 ? (
              <div className="col-span-full text-center py-20 text-gray-400 bg-white rounded-3xl border border-gray-100 border-dashed">
                Belum ada klub padel yang didaftarkan.
              </div>
            ) : (
              vendors.map((vendor: any) => {
                const allPrices = vendor.courts.flatMap((c: any) => c.priceRules.map((r: any) => Number(r.price)));
                const minPrice = allPrices.length > 0 ? Math.min(...allPrices) : null;

                return (
                  <Link href={`/venue/${vendor.id}`} key={vendor.id} className="group block bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-100 translateY-0 hover:-translate-y-1">
                    <div className="aspect-[4/3] relative bg-slate-100 overflow-hidden">
                      {vendor.imageUrl ? (
                        <img
                          src={vendor.imageUrl}
                          alt={vendor.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                      ) : (
                        <div className="flex flex-col w-full h-full items-center justify-center text-slate-400 bg-slate-50 gap-2 font-medium">
                          <span>🏢</span> Belum Ada Brand Image
                        </div>
                      )}
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                        {vendor.courts.length} Lapangan
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-indigo-600 transition">{vendor.name}</h3>
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-bold">5.0</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{vendor.address}</span>
                      </div>
                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">Sewa Mulai</p>
                          <p className="font-black text-slate-800 text-lg">
                            {minPrice ? `Rp ${minPrice.toLocaleString('id-ID')}` : 'Hubungi Venue'}
                          </p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition">
                          →
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
