import Link from 'next/link';
import { Shield, CheckSquare, Activity, Smartphone, WifiOff, FileText } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <main className="flex-1">
        <section className="px-6 py-24 text-center bg-blue-900 text-white">
          <h1 className="text-5xl font-extrabold mb-6 tracking-tight">DHRUV TRACK</h1>
          <p className="text-2xl font-light mb-8 max-w-2xl mx-auto">
            Track Training. Verify Safety. Close Actions.
          </p>
          <p className="text-lg text-blue-200 mb-10 max-w-3xl mx-auto">
            A mobile-first workforce safety, behavioral compliance, field verification and corrective-action tracking platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/login" className="bg-white text-blue-900 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition shadow-lg w-full sm:w-auto text-center">
              Login
            </Link>
            <Link href="/dashboard" className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-800 transition w-full sm:w-auto text-center">
              Get Started
            </Link>
          </div>
        </section>
        
        <section className="py-20 px-6 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: 'Workforce Tracking', desc: 'Monitor compliance and training across regions.' },
              { icon: CheckSquare, title: 'Safety Inspections', desc: 'Standardized digital checklists for field safety.' },
              { icon: Activity, title: 'Corrective Actions', desc: 'End-to-end workflow for tracking and closing issues.' },
              { icon: FileText, title: 'Field Verification', desc: 'Verify safety compliance directly from the field.' },
              { icon: Smartphone, title: 'Mobile-First', desc: 'Optimized for field officers on any device.' },
              { icon: WifiOff, title: 'Offline Ready', desc: 'Keep working even without internet connection.' },
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
                <feature.icon className="text-blue-600 mb-6" size={40} />
                <h3 className="text-xl font-bold mb-3 text-slate-800">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer className="bg-slate-900 text-slate-400 py-10 text-center px-6">
        <p className="mb-4 text-slate-300 font-medium">A mobile-first workforce safety and field compliance tracking platform</p>
        <p className="text-sm">&copy; {new Date().getFullYear()} Dhruv Track. All rights reserved.</p>
      </footer>
    </div>
  );
}
