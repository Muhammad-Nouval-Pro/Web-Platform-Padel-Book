import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { CalendarClock } from 'lucide-react';
import { redirect } from 'next/navigation';
import PriceRuleForm from '@/components/vendor/PriceRuleForm';

export default async function PricesPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const vendor = await prisma.vendor.findFirst({
    where: { adminId: session.userId }
  });

  if (!vendor) return <div className="p-6 bg-red-50 rounded-2xl border text-sm italic py-12 text-center text-red-600 font-bold">Lengkapi Profil Vendor terlebih dahulu.</div>;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const courts = (await prisma.court.findMany({
    where: { vendorId: vendor.id },
    include: { 
      priceRules: {
        where: {
          OR: [
            { specificDate: null }, // Recurring rules
            { specificDate: { gte: today } } // Future specific rules
          ]
        }
      }
    }
  })).map(court => ({
    ...court,
    priceRules: court.priceRules.map(rule => ({
      ...rule,
      price: Number(rule.price)
    }))
  }));

  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-xl">
            <CalendarClock className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900 leading-tight">Waktu & Harga</h1>
            <p className="text-xs text-gray-500 mt-1">Atur harga lapangan per jam berdasarkan hari rutin atau tanggal spesifik.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <PriceRuleForm courts={courts} />
        </div>

        <div className="md:col-span-2 space-y-8">
          {courts.map(court => (
            <div key={court.id} className="bg-white rounded-[2rem] shadow-sm border overflow-hidden">
              <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-black text-gray-900 tracking-tight">{court.name}</h3>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{court.priceRules.length} Aturan</span>
              </div>
              <div className="p-0">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white border-b border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <th className="px-6 py-4">Hari / Tanggal</th>
                      <th className="px-6 py-4">Slot Jam</th>
                      <th className="px-6 py-4 text-right">Harga</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {court.priceRules.length === 0 ? (
                      <tr><td colSpan={3} className="px-6 py-12 text-center text-xs text-gray-400 italic">Belum ada aturan harga yang dibuat.</td></tr>
                    ) : (
                      court.priceRules.sort((a: any, b: any) => {
                         if (a.specificDate && !b.specificDate) return 1;
                         if (!a.specificDate && b.specificDate) return -1;
                         return (a.dayOfWeek || 0) - (b.dayOfWeek || 0);
                      }).map((rule: any) => (
                        <tr key={rule.id} className="group hover:bg-gray-50/50 transition">
                          <td className="px-6 py-4">
                            {rule.specificDate ? (
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
                                  {new Date(rule.specificDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                                <span className="text-xs font-bold text-gray-900">{days[rule.dayOfWeek]}</span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-xs font-medium text-gray-500">
                             {rule.startTime} - {rule.endTime}
                          </td>
                          <td className="px-6 py-4 text-right">
                             <div className="inline-block text-sm font-black text-slate-800">
                               <span className="text-[10px] font-medium text-gray-300 mr-1">Rp</span>
                               {Number(rule.price).toLocaleString('id-ID')}
                             </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
