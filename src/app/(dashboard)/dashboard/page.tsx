'use client';

import { useQuery } from '@tanstack/react-query';
import { Users, AlertTriangle, CheckCircle, Clock, MapPin } from 'lucide-react';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { createClient } from '@/lib/supabase/client';

export default function DashboardPage() {
  const supabase = createClient();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // Simulate real queries for the 5 stats requested
      const [
        { count: workforceCount },
        { count: trainingCount },
        { count: visitsCount },
        { count: observationsCount },
        { count: actionsCount }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('training_records').select('*', { count: 'exact', head: true }),
        supabase.from('field_visits').select('*', { count: 'exact', head: true }),
        supabase.from('observations').select('*', { count: 'exact', head: true }),
        supabase.from('corrective_actions').select('*', { count: 'exact', head: true, eq: ['status', 'open'] })
      ]);

      return {
        workforce: workforceCount || 0,
        training: trainingCount || 0,
        visits: visitsCount || 0,
        observations: observationsCount || 0,
        actions: actionsCount || 0,
      };
    }
  });

  const mockChartData = [
    { name: 'North', compliance: 85, issues: 12 },
    { name: 'South', compliance: 92, issues: 5 },
    { name: 'East', compliance: 78, issues: 18 },
    { name: 'West', compliance: 88, issues: 8 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-slate-500">Overview of your workforce safety and compliance.</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="h-9 rounded-md border border-slate-300 bg-white px-3 py-1 text-sm">
            <option>All Regions</option>
            <option>North</option>
            <option>South</option>
          </select>
          <select className="h-9 rounded-md border border-slate-300 bg-white px-3 py-1 text-sm">
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <StatCard
          title="Workforce"
          value={isLoading ? '...' : stats?.workforce ?? 0}
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          title="Training"
          value={isLoading ? '...' : stats?.training ?? 0}
          icon={<CheckCircle className="h-4 w-4" />}
        />
        <StatCard
          title="Field Visits"
          value={isLoading ? '...' : stats?.visits ?? 0}
          icon={<MapPin className="h-4 w-4" />}
        />
        <StatCard
          title="Observations"
          value={isLoading ? '...' : stats?.observations ?? 0}
          icon={<AlertTriangle className="h-4 w-4" />}
        />
        <StatCard
          title="Open Actions"
          value={isLoading ? '...' : stats?.actions ?? 0}
          icon={<Clock className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Regional Compliance</CardTitle>
            <CardDescription>
              Safety compliance rates across regions.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="compliance" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest actions from your team.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[
                { title: 'New observation logged', time: '10 mins ago', author: 'John Doe' },
                { title: 'Field visit completed', time: '2 hours ago', author: 'Jane Smith' },
                { title: 'Safety training updated', time: '5 hours ago', author: 'Admin User' },
                { title: 'Corrective action closed', time: '1 day ago', author: 'Mike Johnson' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center">
                  <span className="relative flex h-2 w-2 shrink-0 rounded-full bg-blue-600 mr-4" />
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.title}</p>
                    <p className="text-sm text-slate-500">
                      {activity.author} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
