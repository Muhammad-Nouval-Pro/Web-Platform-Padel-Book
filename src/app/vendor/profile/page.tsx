import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { updateVendorProfile } from '@/actions/vendor';
import { Save } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function VendorProfilePage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const vendor = await prisma.vendor.findFirst({
    where: { adminId: session.userId }
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <h1 className="text-2xl font-bold text-gray-900">Profil Vendor (Klub Padel)</h1>
        <p className="text-gray-500 mt-1">Lengkapi informasi cabang padel Anda. Data ini akan ditampilkan ke pelanggan.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-8 max-w-2xl">
        {vendor?.status === 'PENDING' && (
          <div className="mb-6 p-4 bg-amber-50 text-amber-800 rounded-xl border border-amber-200">
            <strong>Status Pendaftaran:</strong> Menunggu Verifikasi Super Admin.
          </div>
        )}
        {vendor?.status === 'REJECTED' && (
          <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-xl border border-red-200">
            <strong>Status Pendaftaran:</strong> Ditolak. Harap perbarui data Anda atau hubungi admin.
          </div>
        )}
        
        <form action={updateVendorProfile} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Nama Cabang / Klub</label>
            <input 
              type="text" id="name" name="name" 
              defaultValue={vendor?.name} required
              className="w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
            />
          </div>
          <div>
            <label htmlFor="imageFile" className="block text-sm font-semibold text-gray-700 mb-1">Foto Depan / Brand (Opsional)</label>
            {vendor?.imageUrl && (
              <div className="mb-2">
                <img src={vendor.imageUrl} alt="Current Brand" className="h-24 w-36 object-cover rounded-xl border border-gray-200 shadow-sm" />
              </div>
            )}
            <input 
              type="file" id="imageFile" name="imageFile" accept="image/*"
              className="w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border text-sm"
            />
            <p className="text-xs text-gray-400 mt-1">Unggah file foto (*.jpg, *.png). Lewati jika tidak ingin mengganti.</p>
          </div>
          <div>
            <label htmlFor="contactPhone" className="block text-sm font-semibold text-gray-700 mb-1">Nomor Telepon Kontak</label>
            <input 
              type="text" id="contactPhone" name="contactPhone" 
              defaultValue={vendor?.contactPhone} required
              className="w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-1">Alamat Lengkap</label>
            <textarea 
              id="address" name="address" rows={2}
              defaultValue={vendor?.address} required
              className="w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border text-sm"
            />
          </div>
          <div>
            <label htmlFor="mapsUrl" className="block text-sm font-semibold text-gray-700 mb-1">Link Google Maps (Embed/Iframe Link)</label>
            <input 
              type="text" id="mapsUrl" name="mapsUrl" 
              defaultValue={vendor?.mapsUrl || ''} 
              placeholder="https://www.google.com/maps/embed?..."
              className="w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border text-sm"
            />
            <p className="text-[10px] text-gray-400 mt-1 italic">Dapatkan dari Google Maps: Share &rarr; Embed a map &rarr; ambil isi src="...".</p>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi Tambahan</label>
            <textarea 
              id="description" name="description" rows={3}
              defaultValue={vendor?.description || ''}
              className="w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit" 
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition shadow-md shadow-indigo-200"
            >
              <Save className="w-5 h-5" /> Simpan Profil
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
