"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, AlertCircle, Clock, CheckCircle2, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";

export default function TrainingDashboardPage() {
  const supabase = createClient();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const { data: stats } = useQuery({
    queryKey: ["training_stats"],
    queryFn: async () => {
      // In a real app this might be a Postgres function/view.
      // Doing a simple fetch for the example.
      const { data, error } = await supabase
        .from("training_records")
        .select("status, expires_at");
      
      if (error) throw error;
      
      const now = new Date();
      return {
        trained: data.filter(r => r.status === 'pass' && (!r.expires_at || new Date(r.expires_at) > now)).length,
        pending: data.filter(r => r.status === 'pending').length,
        expired: data.filter(r => r.expires_at && new Date(r.expires_at) < now).length,
        overdue: data.filter(r => r.status === 'fail').length, // Using fail as overdue proxy for now
      };
    }
  });

  const { data: records, isLoading } = useQuery({
    queryKey: ["training_dashboard_records", filter, search],
    queryFn: async () => {
      let query = supabase
        .from("training_records")
        .select(`
          *,
          employee:profiles!employee_id(name, employee_id),
          course:training_courses(name, category)
        `)
        .order("completed_at", { ascending: false })
        .limit(20);
        
      if (filter !== "All") {
        query = query.eq("status", filter.toLowerCase());
      }
      // search filtering typically handled via RPC or more complex ilike on joined tables

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Training Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/training/courses">
            <Button variant="outline">Courses</Button>
          </Link>
          <Link href="/training/records">
            <Button variant="outline">All Records</Button>
          </Link>
          <Link href="/training/records/new">
            <Button>Record Training</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trained</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.trained || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pending || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.expired || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.overdue || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Records</CardTitle>
          <div className="flex gap-2 flex-wrap mt-4">
            {["All", "Pass", "Pending", "Fail"].map((f) => (
              <Badge 
                key={f} 
                variant={filter === f ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setFilter(f)}
              >
                {f}
              </Badge>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th className="px-6 py-3">Employee</th>
                  <th className="px-6 py-3">Course</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={4} className="text-center py-4">Loading...</td></tr>
                ) : records?.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-4 text-muted-foreground">No records found.</td></tr>
                ) : (
                  records?.map((record) => (
                    <tr key={record.id} className="border-b last:border-0">
                      <td className="px-6 py-4 font-medium">{record.employee?.name}</td>
                      <td className="px-6 py-4">{record.course?.name}</td>
                      <td className="px-6 py-4">{formatDate(record.completed_at)}</td>
                      <td className="px-6 py-4">
                        <Badge variant={record.status === 'pass' ? 'default' : record.status === 'fail' ? 'destructive' : 'secondary'}>
                          {record.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
