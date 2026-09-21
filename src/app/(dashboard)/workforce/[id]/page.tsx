"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { User, MapPin, Briefcase, Calendar } from "lucide-react";

export default function EmployeeProfilePage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: employee, isLoading } = useQuery({
    queryKey: ["employee", params.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          location:locations(name),
          division:divisions(name),
          region:regions(name),
          area:areas(name),
          manager:profiles!manager_id(name),
          supervisor:profiles!supervisor_id(name)
        `)
        .eq("id", params.id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const { data: trainingRecords } = useQuery({
    queryKey: ["training_records", params.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("training_records")
        .select("*, course:training_courses(name, category)")
        .eq("employee_id", params.id)
        .order("completed_at", { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div className="p-8 text-center animate-pulse">Loading profile...</div>;
  }

  if (!employee) {
    return <div className="p-8 text-center">Employee not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <Card className="flex-1 w-full">
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <div className="h-24 w-24 bg-muted rounded-full flex items-center justify-center text-3xl font-bold text-muted-foreground shrink-0">
                {employee.name.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                  <div>
                    <h1 className="text-2xl font-bold">{employee.name}</h1>
                    <p className="text-muted-foreground">{employee.role}</p>
                  </div>
                  <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                    {employee.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>ID: {employee.employee_id}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{employee.location?.name || "No location assigned"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>{employee.employment_type || "Regular"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Joined: {employee.joining_date ? formatDate(employee.joining_date) : "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="training">Training History</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="observations">Observations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Organization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div className="text-muted-foreground">Division</div>
                  <div>{employee.division?.name || "-"}</div>
                  
                  <div className="text-muted-foreground">Region</div>
                  <div>{employee.region?.name || "-"}</div>
                  
                  <div className="text-muted-foreground">Area</div>
                  <div>{employee.area?.name || "-"}</div>
                  
                  <div className="text-muted-foreground">Manager</div>
                  <div>{employee.manager?.name || "-"}</div>
                  
                  <div className="text-muted-foreground">Supervisor</div>
                  <div>{employee.supervisor?.name || "-"}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div className="text-muted-foreground">Email</div>
                  <div>{employee.email || "-"}</div>
                  
                  <div className="text-muted-foreground">Mobile</div>
                  <div>{employee.mobile || "-"}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="training" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Training Records</CardTitle>
            </CardHeader>
            <CardContent>
              {trainingRecords?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No training records found.
                </div>
              ) : (
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                      <tr>
                        <th className="px-6 py-3">Course</th>
                        <th className="px-6 py-3">Category</th>
                        <th className="px-6 py-3">Completed On</th>
                        <th className="px-6 py-3">Expires On</th>
                        <th className="px-6 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trainingRecords?.map((record) => (
                        <tr key={record.id} className="border-b last:border-0 hover:bg-muted/50">
                          <td className="px-6 py-4 font-medium">{record.course?.name}</td>
                          <td className="px-6 py-4">{record.course?.category}</td>
                          <td className="px-6 py-4">{formatDate(record.completed_at)}</td>
                          <td className="px-6 py-4">{record.expires_at ? formatDate(record.expires_at) : "N/A"}</td>
                          <td className="px-6 py-4">
                            <Badge variant={record.status === 'pass' ? 'default' : 'destructive'}>
                              {record.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="actions" className="mt-6">
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              Actions view implementation pending.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="observations" className="mt-6">
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              Observations view implementation pending.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
