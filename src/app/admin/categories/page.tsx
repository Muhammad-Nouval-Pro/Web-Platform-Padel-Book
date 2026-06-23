import { prisma } from '@/lib/prisma';
import { createCategory, deleteCategory } from '@/actions/admin';
import { Layers, Trash2, Plus } from 'lucide-react';

export default async function CategoriesPage() {
  // Let's protect this directly later, assuming middleware does the job.
  const categories = await prisma.courtCategory.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Master Kategori Lapangan</h1>
          <p className="text-gray-500 mt-1">Kelola jenis-jenis lapangan (contoh: Indoor, Outdoor).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm border h-fit">
          <h2 className="text-lg font-semibold mb-4">Tambah Kategori Baru</h2>
          <form action={createCategory} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Kategori</label>
              <input 
                type="text" 
                name="name" 
                id="name" 
                required 
                className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border"
                placeholder="Indoor Elite..."
              />
            </div>
            <button 
              type="submit" 
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              <Plus className="w-4 h-4" /> Simpan
            </button>
          </form>
        </div>

        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Nama Kategori</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-sm w-24 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-6 py-8 text-center text-gray-500">Belum ada kategori yang ditambahkan.</td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="border-b last:border-0 border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <Layers className="w-5 h-5 text-indigo-500" />
                      <span className="font-medium text-gray-900">{cat.name}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <form action={async () => {
                        'use server';
                        await deleteCategory(cat.id);
                      }}>
                        <button type="submit" className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
