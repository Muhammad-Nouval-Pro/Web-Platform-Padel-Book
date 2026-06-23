'use client';

import { useState } from 'react';
import { createPriceRule } from '@/actions/vendor';
import { Plus, Calendar, Clock, DollarSign } from 'lucide-react';

export default function PriceRuleForm({ courts }: { courts: any[] }) {
  const [type, setType] = useState<'daily' | 'date'>('daily');
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border h-fit">
      <h2 className="text-lg font-black text-gray-900 mb-6">Set Harga Baru</h2>
      
      <div className="flex gap-2 mb-6 p-1 bg-gray-50 rounded-xl border">
        <button 
          onClick={() => setType('daily')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${type === 'daily' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Hari Rutin
        </button>
        <button 
          onClick={() => setType('date')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${type === 'date' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Tanggal Spesifik
        </button>
      </div>

      <form 
        action={async (formData) => {
          await createPriceRule(formData);
        }} 
        className="space-y-5"
      >
        <input type="hidden" name="type" value={type} />
        
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 focus-within:text-indigo-600 transition">
            Pilih Lapangan
          </label>
          <select name="courtId" required className="block w-full rounded-xl border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border text-sm font-medium">
            {courts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {type === 'daily' ? (
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Pilih Hari</label>
            <select name="dayOfWeek" required className="block w-full rounded-xl border-gray-200 shadow-sm p-3 border text-sm font-medium">
              {days.map((day, ix) => <option key={ix} value={ix}>{day}</option>)}
            </select>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Pilih Tanggal</label>
            <input 
              type="date" name="specificDate" required 
              className="block w-full rounded-xl border-gray-200 p-3 border text-sm font-medium focus:border-indigo-500 focus:ring-indigo-500" 
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Jam Mulai</label>
            <div className="relative">
              <input type="time" name="startTime" required className="block w-full rounded-xl border-gray-200 p-3 border text-sm font-medium pl-10" defaultValue="17:00"/>
              <Clock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Selesai</label>
            <div className="relative">
              <input type="time" name="endTime" required className="block w-full rounded-xl border-gray-200 p-3 border text-sm font-medium pl-10" defaultValue="22:00"/>
              <Clock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Harga Sewa (Rp)</label>
          <div className="relative">
            <input type="number" name="price" required placeholder="350.000" className="block w-full rounded-xl border-gray-200 p-3 border text-sm font-black pl-10 text-indigo-700 placeholder:font-normal"/>
            <span className="text-gray-400 absolute left-3.5 top-3.5 font-bold text-xs">Rp</span>
          </div>
        </div>

        <button type="submit" className="w-full flex justify-center items-center gap-2 py-3.5 border border-transparent rounded-xl shadow-lg shadow-indigo-100 font-black text-white bg-indigo-600 hover:bg-slate-900 transition-all text-sm uppercase tracking-widest">
          <Plus className="w-5 h-5" /> Simpan Aturan
        </button>
      </form>
    </div>
  );
}
