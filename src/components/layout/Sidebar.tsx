'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CheckSquare, Layers, MapPin, CalendarClock, Users, ShieldCheck, UserCircle } from 'lucide-react';

type SidebarProps = {
  role: 'SUPER_ADMIN' | 'VENDOR_ADMIN';
};

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const adminLinks = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/categories', label: 'Master Kategori', icon: Layers },
    { href: '/settings', label: 'Keamanan', icon: ShieldCheck }, // using name ShieldCheck
    { href: '/admin/vendors', label: 'Validasi Vendor', icon: CheckSquare },
    { href: '/admin/users/vendors', label: 'Kelola Vendor Admin', icon: Users },
    { href: '/admin/users/customers', label: 'Kelola Pelanggan', icon: Users },
  ];

  const vendorLinks = [
    { href: '/vendor', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/vendor/calendar', label: 'Kalender Reservasi', icon: CalendarClock },
    { href: '/vendor/profile', label: 'Profil Vendor', icon: UserCircle },
    { href: '/vendor/courts', label: 'Kelola Lapangan', icon: MapPin },
    { href: '/vendor/prices', label: 'Waktu & Harga', icon: CalendarClock },
    { href: '/vendor/customers', label: 'Kelola Customer', icon: Users },
    { href: '/settings', label: 'Keamanan', icon: ShieldCheck },
  ];

  const links = role === 'SUPER_ADMIN' ? adminLinks : vendorLinks;

  return (
    <div className="w-64 bg-white border-r min-h-[calc(100vh-64px)] py-6 shadow-sm hidden md:block">
      <nav className="flex flex-col gap-1 px-4">
        <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          {role === 'SUPER_ADMIN' ? 'Admin Menu' : 'Vendor Menu'}
        </h3>
        {links.map((link) => {
          const Icon = link.icon;
          // Match exactly or if it's a subpath but not targeting the root dashboard layout
          const isActive = pathname === link.href || (link.href !== '/admin' && link.href !== '/vendor' && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
