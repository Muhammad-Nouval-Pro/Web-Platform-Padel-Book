import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { createCourt, editCourt, deleteCourt } from '@/actions/vendor';
import { Plus, Trash2, Edit, X, Image as ImageIcon } from 'lucide-react';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function CourtsPage({ searchParams }: { searchParams?: { edit?: string } | Promise<{ edit?: string }> }) {
  const resolvedParams = searchParams instanceof Promise ? await searchParams : searchParams;
  const editId = resolvedParams?.edit;
  const session = await getSession();
  if (!session) redirect('/login');

  const vendor = await prisma.vendor.findFirst({
    where: { adminId: session.userId }
  });

  if (!vendor) {
    return (
      <div className="p-6 bg-red-50 text-red-800 rounded-xl">
        Harap lengkapi Profil Vendor terlebih dahulu.
      </div>
    );
  }

  const courts = await prisma.court.findMany({
    where: { vendorId: vendor.id },
    include: { category: true, images: true }
  });

  const categories = await prisma.courtCategory.findMany();

  let editingCourt = null;
  if (editId) {
    editingCourt = courts.find(c => c.id === editId);
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <h1 className="text-2xl font-bold text-gray-900">Kelola Lapangan</h1>
        <p className="text-gray-500 mt-1">Tambahkan lapangan yang tersedia pada cabang Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm border h-fit">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">{editingCourt ? 'Edit Lapangan' : 'Tambah Lapangan'}</h2>
            {editingCourt && <Link href="/vendor/courts" className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></Link>}
          </div>
          <form action={editingCourt ? editCourt : createCourt} className="space-y-4">
            {editingCourt && <input type="hidden" name="courtId" value={editingCourt.id} />}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Kategori Lapangan</label>
              <select name="categoryId" defaultValue={editingCourt?.categoryId} required className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border">
                <option value="">-- Pilih Kategori --</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lapangan</label>
              <input type="text" name="name" defaultValue={editingCourt?.name} required placeholder="Court A..." className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border"/>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tipe Lapangan (Ketik Bebas)</label>
              <input type="text" name="type" defaultValue={editingCourt?.type} required placeholder="Contoh: Kaca Panoramic, Rumput Sintetis..." className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Foto Lapangan (Opsional)</label>
              {editingCourt?.images[0] && (
                 <img src={editingCourt.images[0].url} className="h-24 w-full object-cover rounded-xl border mb-3" alt="" />
              )}
              <input type="file" name="imageFile" accept="image/*" className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border text-sm"/>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi</label>
              <textarea name="description" defaultValue={editingCourt?.description || ''} rows={2} className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border"></textarea>
            </div>
            <button type="submit" className="w-full flex justify-center items-center gap-2 py-3 border border-transparent rounded-xl shadow-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700">
              {editingCourt ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />} 
              {editingCourt ? 'Simpan Perubahan' : 'Simpan Lapangan'}
            </button>
          </form>
        </div>

        <div className="md:col-span-2 space-y-4">
          {courts.length === 0 ? (
            <div className="bg-white rounded-2xl border p-8 text-center text-gray-500">Belum ada lapangan.</div>
          ) : (
            courts.map((court) => (
              <div key={court.id} className="bg-white rounded-2xl shadow-sm border p-5 flex gap-5 items-start">
                <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {court.images[0] ? (
                    <img src={court.images[0].url} alt={court.name} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="text-gray-400 w-8 h-8" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{court.name} <span className="ml-2 text-xs font-semibold px-2 py-1 bg-slate-100 rounded text-slate-600">{court.type}</span></h3>
                      <p className="text-sm text-indigo-600 font-medium">{court.category.name}</p>
                    </div>
                    <div className="flex gap-1">
                      <Link href={`/vendor/courts?edit=${court.id}`} className="text-indigo-500 hover:text-indigo-700 p-2 hover:bg-indigo-50 rounded-lg">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <form action={async () => { 'use server'; await deleteCourt(court.id); }}>
                        <button type="submit" className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">{court.description || 'Tidak ada deskripsi'}</p>
                  <div className="mt-3 text-xs text-gray-400">
                    ID: {court.id}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
