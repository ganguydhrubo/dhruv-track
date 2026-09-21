'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, Users, BookOpen, MapPin, Search, AlertCircle, 
  Settings, LogOut, Menu, X, FileText, CheckCircle2,
  Truck, ShieldCheck
} from 'lucide-react';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { OfflineIndicator } from '@/components/shared/offline-indicator';
import { NotificationBell } from '@/components/notifications/notification-bell';
import { NotificationPanel } from '@/components/notifications/notification-panel';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Field Hub', href: '/field', icon: ShieldCheck },
  { name: 'Workforce', href: '/workforce', icon: Users },
  { name: 'Training', href: '/training', icon: BookOpen },
  { name: 'Field Visits', href: '/visits', icon: MapPin },
  { name: 'Observations', href: '/observations', icon: Search },
  { name: 'Corrective Actions', href: '/actions', icon: AlertCircle },
  { name: 'Vehicles', href: '/vehicles', icon: Truck },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Admin', href: '/admin/locations', icon: Settings },
];

const mobileNavItems = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Field Hub', href: '/field', icon: ShieldCheck },
  { name: 'Visits', href: '/visits', icon: MapPin },
  { name: 'Actions', href: '/actions', icon: AlertCircle },
  { name: 'Reports', href: '/reports', icon: FileText },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <OfflineIndicator />

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 overflow-y-auto border-r bg-white md:block">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight text-blue-600">Dhruv Track</span>
          </Link>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = item.href === '/dashboard' 
              ? pathname === '/dashboard' 
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                )}
              >
                <item.icon className={cn('h-5 w-5', isActive ? 'text-blue-700' : 'text-slate-400')} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 sm:px-6">
          <div className="flex items-center gap-4 md:hidden">
            <span className="text-xl font-bold text-blue-600">Dhruv Track</span>
          </div>
          <div className="hidden md:flex flex-1 items-center gap-4 px-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="search"
                placeholder="Search employees, locations, actions..."
                className="h-9 w-full rounded-md border border-slate-300 bg-transparent pl-9 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell onClick={() => setNotificationsOpen(true)} />
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-slate-700 hover:text-red-600 hidden md:block"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 mb-16 md:mb-0">
          {children}
        </main>
      </div>

      {/* Notification Flyout Panel */}
      <NotificationPanel 
        isOpen={notificationsOpen} 
        onClose={() => setNotificationsOpen(false)} 
      />

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t bg-white md:hidden pb-safe">
        {mobileNavItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center w-full h-full gap-1',
                isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center w-full h-full gap-1 text-slate-500 hover:text-slate-900"
        >
          <Menu className="h-5 w-5" />
          <span className="text-[10px] font-medium">More</span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-64 bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-semibold">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  <item.icon className="h-5 w-5 text-slate-400" />
                  {item.name}
                </Link>
              ))}
              <div className="my-4 border-t" />
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
