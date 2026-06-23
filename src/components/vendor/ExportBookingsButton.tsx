'use client';

import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';

type BookingExport = {
  id: string;
  customerName: string;
  courtName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  totalPrice: number;
  createdAt: string;
}

export function ExportBookingsButton({ data, filename }: { data: BookingExport[], filename: string }) {
  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
    
    // Generate buffer
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-xl transition shadow-md shadow-emerald-100 text-sm"
    >
      <Download className="w-4 h-4" /> Export ke Excel
    </button>
  );
}
