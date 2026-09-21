"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Download } from "lucide-react";
import { formatDate, generateCSV } from "@/lib/utils";

export default function TrainingRecordsPage() {
  const supabase = createClient();

  const { data: records, isLoading } = useQuery({
    queryKey: ["training_records_list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("training_records")
        .select(`
          *,
          employee:profiles!employee_id(name, employee_id),
          course:training_courses(name),
          trainer:profiles!trainer_id(name)
        `)
        .order("completed_at", { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const exportCSV = () => {
    if (!records) return;
    const exportData = records.map(r => ({
      "Employee": r.employee?.name,
      "Employee ID": r.employee?.employee_id,
      "Course": r.course?.name,
      "Trainer": r.trainer?.name || "N/A",
      "Date": formatDate(r.completed_at),
      "Status": r.status,
      "Score": r.score || "N/A",
    }));
    generateCSV(exportData, "training_records.csv");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Training Records</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCSV}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Link href="/training/records/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Record Training
            </Button>
          </Link>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden bg-background">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
            <tr>
              <th className="px-6 py-3">Employee</th>
              <th className="px-6 py-3">Course</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Trainer</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Score</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="text-center py-4">Loading...</td></tr>
            ) : records?.map((record) => (
              <tr key={record.id} className="border-b last:border-0 hover:bg-muted/50">
                <td className="px-6 py-4 font-medium">{record.employee?.name}</td>
                <td className="px-6 py-4">{record.course?.name}</td>
                <td className="px-6 py-4">{formatDate(record.completed_at)}</td>
                <td className="px-6 py-4">{record.trainer?.name || "-"}</td>
                <td className="px-6 py-4">
                  <Badge variant={record.status === 'pass' ? 'default' : record.status === 'fail' ? 'destructive' : 'secondary'}>
                    {record.status}
                  </Badge>
                </td>
                <td className="px-6 py-4">{record.score !== null ? `${record.score}%` : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
