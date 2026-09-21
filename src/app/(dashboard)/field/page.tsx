import Link from 'next/link';
import { Play, QrCode, ShieldAlert, AlertTriangle, PlusCircle, CheckCircle } from 'lucide-react';

export default function FieldOfficerHome() {
  return (
    <div className="p-4 max-w-lg mx-auto space-y-6 pb-24">
      <header className="mb-6 pt-4">
        <h1 className="text-2xl font-bold text-slate-800">Field Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Welcome back. Here is your daily summary.</p>
      </header>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 flex flex-col items-center text-center">
          <div className="text-3xl font-extrabold text-blue-700 mb-1">3</div>
          <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Today's Visits</div>
        </div>
        <div className="bg-red-50 p-5 rounded-2xl border border-red-100 flex flex-col items-center text-center">
          <div className="text-3xl font-extrabold text-red-700 mb-1">5</div>
          <div className="text-xs font-semibold text-red-600 uppercase tracking-wide">Overdue Items</div>
        </div>
        <div className="bg-orange-50 p-5 rounded-2xl border border-orange-100 flex flex-col items-center text-center">
          <div className="text-3xl font-extrabold text-orange-700 mb-1">12</div>
          <div className="text-xs font-semibold text-orange-600 uppercase tracking-wide">Pending Actions</div>
        </div>
        <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 flex flex-col items-center text-center">
          <div className="text-3xl font-extrabold text-emerald-700 mb-1">4</div>
          <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Assigned Locs</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Link href="/visits/new" className="flex flex-col items-center justify-center p-6 bg-emerald-600 text-white rounded-2xl shadow-sm hover:bg-emerald-700 transition active:scale-95">
          <Play size={32} className="mb-3" />
          <span className="font-bold text-sm text-center tracking-wide">START VISIT</span>
        </Link>
        <Link href="/scan" className="flex flex-col items-center justify-center p-6 bg-blue-600 text-white rounded-2xl shadow-sm hover:bg-blue-700 transition active:scale-95">
          <QrCode size={32} className="mb-3" />
          <span className="font-bold text-sm text-center tracking-wide">SCAN LOCATION</span>
        </Link>
        <Link href="/safety/check" className="flex flex-col items-center justify-center p-6 bg-orange-500 text-white rounded-2xl shadow-sm hover:bg-orange-600 transition active:scale-95">
          <ShieldAlert size={32} className="mb-3" />
          <span className="font-bold text-sm text-center tracking-wide">SAFETY CHECK</span>
        </Link>
        <Link href="/observations/new" className="flex flex-col items-center justify-center p-6 bg-amber-500 text-white rounded-2xl shadow-sm hover:bg-amber-600 transition active:scale-95">
          <AlertTriangle size={32} className="mb-3" />
          <span className="font-bold text-sm text-center tracking-wide">REPORT OBS.</span>
        </Link>
        <Link href="/actions/new" className="flex flex-col items-center justify-center p-6 bg-red-600 text-white rounded-2xl shadow-sm hover:bg-red-700 transition active:scale-95">
          <PlusCircle size={32} className="mb-3" />
          <span className="font-bold text-sm text-center tracking-wide">CREATE ACTION</span>
        </Link>
        <Link href="/actions?status=PENDING_VERIFICATION" className="flex flex-col items-center justify-center p-6 bg-purple-600 text-white rounded-2xl shadow-sm hover:bg-purple-700 transition active:scale-95">
          <CheckCircle size={32} className="mb-3" />
          <span className="font-bold text-sm text-center tracking-wide">VERIFY ACTION</span>
        </Link>
      </div>
    </div>
  );
}
