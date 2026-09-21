'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { FileText, BarChart3, Users, GraduationCap, MapPin, AlertTriangle, ClipboardCheck, TrendingUp, Truck, Clock } from 'lucide-react';
import Link from 'next/link';

const reports = [
  {
    title: 'Workforce Status',
    description: 'Complete workforce overview with status breakdown',
    href: '/reports/workforce',
    icon: Users,
    color: 'bg-blue-500',
  },
  {
    title: 'Training Status',
    description: 'Training completion, pending, and overdue analysis',
    href: '/reports/training',
    icon: GraduationCap,
    color: 'bg-green-500',
  },
  {
    title: 'Field Visit Report',
    description: 'Visit history, completion rates, and officer activity',
    href: '/reports/visits',
    icon: MapPin,
    color: 'bg-indigo-500',
  },
  {
    title: 'Safety Observations',
    description: 'Observation trends by category and severity',
    href: '/reports/observations',
    icon: AlertTriangle,
    color: 'bg-yellow-500',
  },
  {
    title: 'Corrective Actions',
    description: 'Action status, aging, and closure analysis',
    href: '/reports/actions',
    icon: ClipboardCheck,
    color: 'bg-red-500',
  },
  {
    title: 'Overdue Actions',
    description: 'All overdue corrective actions requiring attention',
    href: '/reports/overdue',
    icon: Clock,
    color: 'bg-orange-500',
  },
  {
    title: 'Compliance Report',
    description: 'Compliance rates by region, area, and location',
    href: '/reports/compliance',
    icon: TrendingUp,
    color: 'bg-purple-500',
  },
  {
    title: 'Vehicle Compliance',
    description: 'Vehicle fitness, insurance, and permit status',
    href: '/reports/vehicles',
    icon: Truck,
    color: 'bg-teal-500',
  },
];

export default function ReportsPage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-gray-500 mt-1">Generate and export operational reports</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {reports.map((report) => (
          <Link
            key={report.href}
            href={report.href}
            className="block rounded-lg border bg-white p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className={cn('p-2.5 rounded-lg text-white', report.color)}>
                <report.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900">{report.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{report.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
