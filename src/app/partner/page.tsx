import Link from 'next/link';
import { ChevronRight, Calendar, BarChart3, MessageCircle, ArrowDown } from 'lucide-react';

export default function PartnerPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-8">
              <span className="inline-block text-indigo-600 font-bold uppercase tracking-widest text-sm mb-6">
                KERJASAMA DENGAN PADEL.YO
              </span>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.2]">
                Transformasi bisnis Anda dan perkuat brand awareness dengan solusi inovatif dari PADEL.YO.
              </h1>
            </div>

            <div className="lg:col-span-4 space-y-8 pb-2">
              <p className="text-base md:text-lg text-slate-600 leading-relaxed">
                Tingkatkan efisiensi operasional dan perluas jangkauan brand Anda dengan solusi komprehensif dari PADEL.YO. Dari manajemen venue olahraga hingga aktivasi event dan digital. Kami hadir untuk membantu Anda.
              </p>
              <Link
                href="#management-section"
                className="inline-flex items-center gap-2 text-indigo-600 font-bold group border-b-2 border-indigo-600 pb-0.5 hover:text-indigo-700 transition"
              >
                <span>Scroll Kebawah</span>
                <div className="w-5 h-5 rounded-full border border-indigo-600 flex items-center justify-center ml-1 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                  <ArrowDown className="w-3 h-3" />
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-50 -z-10 translate-x-20 skew-x-12"></div>
      </section>

      {/* 2. Team Image / Hero Asset */}
      <section className="px-4 mb-20 max-w-4xl mx-auto">
        <div className="rounded-[2rem] overflow-hidden shadow-xl border border-slate-100 bg-slate-50">
          <img
            src="/img-team.jpg"
            alt="Padel Team"
            className="w-full h-auto block"
          />
        </div>
      </section>

      {/* 3. Venue Management Section */}
      <section id="management-section" className="py-24 bg-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative lg:pr-12">
              <div className="aspect-[4/3] md:aspect-square lg:aspect-[4/5] rounded-[2rem] overflow-hidden shadow-xl">
                <img
                  src="/business-img1.png"
                  alt="Management App"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating Card Mock */}
              {/* <div className="absolute -bottom-10 -right-10 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 hidden md:block w-72">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold">Okupansi</p>
                    <p className="text-lg font-black text-slate-900">86%</p>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[86%]"></div>
                </div>
              </div> */}
            </div>

            <div className="space-y-10">
              <div>
                <span className="text-indigo-600 font-bold uppercase tracking-widest text-xs mb-4 block">
                  PADEL.YO VENUE MANAGEMENT
                </span>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 leading-tight">
                  Optimalkan operasional venue olahraga dengan platform manajemen yang efisien dan canggih.
                </h2>
                <p className="text-base md:text-lg text-slate-600 mt-6 leading-relaxed">
                  Aplikasi yang dirancang khusus untuk meningkatkan efisiensi dan penjualan venue olahraga Anda. Telah menjadi pilihan utama banyak venue olahraga di seluruh Indonesia.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">Atur Booking Tanpa Pusing</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Tidak perlu buang waktu buat input booking satu-satu. Pemilik venue tinggal mantau, tau-tau lapangan penuh!
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">Pantau Performa Venue</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Pelajari berbagai statistik penting terkait penggunaan venue untuk pengembangan bisnis yang lebih baik.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CTA Section - WhatsApp */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-xl md:text-3xl font-black text-slate-900 mb-8">Siap Bergabung dengan PADEL.YO?</h3>
          <p className="text-base text-slate-600 mb-10">
            Klik tombol di bawah untuk langsung terhubung dengan tim kami via WhatsApp.
          </p>
          <Link
            href={`https://wa.me/6285773332597?text=${encodeURIComponent("Halo Admin PADEL.YO, saya tertarik untuk menjalin kerjasama strategis dan bergabung sebagai partner resmi. Mohon informasi lebih lanjut mengenai prosedurnya. Terima kasih!")}`}
            className="inline-flex items-center gap-3 bg-indigo-500 hover:bg-indigo-600 text-white font-black py-5 px-10 rounded-[2rem] text-xl shadow-xl shadow-indigo-100 transition-all hover:scale-105 active:scale-95"
            target="_blank"
          >
            <MessageCircle className="w-6 h-6" />
            Hubungi Kami Langsung
          </Link>
          {/* <p className="mt-6 text-slate-400 font-medium">0857 7333 2597</p> */}
        </div>
      </section>
    </div>
  );
}
