import { prisma } from "@/lib/prisma";
import { Users2, MapPin, Building2 } from "lucide-react";

export default async function AdminDashboard() {
  const [totalUsers, totalVendors, totalCourts] = await Promise.all([
    prisma.user.count(),
    prisma.vendor.count(),
    prisma.court.count()
  ]);

  const stats = [
    { name: 'Total Users', value: totalUsers.toLocaleString(), icon: Users2, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Total Vendors', value: totalVendors.toLocaleString(), icon: Building2, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { name: 'Courts Configured', value: totalCourts.toLocaleString(), icon: MapPin, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your platform operations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-2xl shadow-sm border p-6 flex items-center gap-4">
            <div className={`p-4 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
