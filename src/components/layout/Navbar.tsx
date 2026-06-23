import Link from 'next/link';
import { getSession } from '@/lib/session';
import { logout } from '@/actions/auth';
import { MobileMenu } from './MobileMenu';

export async function Navbar() {
  const session = await getSession();

  return (
    <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 group shrink-0">
            <img
              src="/padel.yo.png"
              alt="PADEL.YO"
              className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <span className="text-xl font-black tracking-tighter text-indigo-600 hidden sm:block">
              PADEL.YO
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          {session?.role !== 'VENDOR_ADMIN' && session?.role !== 'SUPER_ADMIN' && (
            <div className="hidden lg:flex items-center gap-8">
              <Link href="/" className="text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors">
                Sewa Lapangan
              </Link>
              <Link href="/bookings" className="text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors">
                Pesanan Saya
              </Link>
              <Link href="/partner" className="text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors">
                Partner With Us
              </Link>
              <Link href="/open-matches" className="text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors">
                Open Matches
              </Link>
            </div>
          )}

          {/* Auth Actions & Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-4">
              {session ? (
                <div className="flex items-center gap-4 pl-4 border-l border-gray-100">
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-black text-gray-900 leading-none">{session.name}</span>
                    <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest mt-1">
                      {session.role === 'SUPER_ADMIN' ? 'Super Admin' : session.role === 'VENDOR_ADMIN' ? 'Vendor Admin' : 'Member'}
                    </span>
                  </div>
                  {session.role === 'SUPER_ADMIN' && (
                    <Link href="/admin" className="text-xs font-bold px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-indigo-600 transition-colors">
                      Admin
                    </Link>
                  )}
                  {session.role === 'VENDOR_ADMIN' && (
                    <Link href="/vendor" className="text-xs font-bold px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-slate-900 transition-colors">
                      Dashboard
                    </Link>
                  )}
                  <form action={logout}>
                    <button className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors">
                      Logout
                    </button>
                  </form>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link href="/login" className="text-sm font-bold text-gray-600 hover:text-indigo-600 transition-colors">
                    Masuk
                  </Link>
                  <Link href="/register" className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-black rounded-full hover:bg-slate-900 shadow-lg shadow-indigo-100 transition-all">
                    Daftar
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button - Wrapped in client component */}
            <MobileMenu session={session} />
          </div>
        </div>
      </div>
    </nav>
  );
}
