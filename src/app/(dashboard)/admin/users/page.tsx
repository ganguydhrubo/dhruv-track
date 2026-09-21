"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Mail, CheckCircle, XCircle } from "lucide-react";

export default function UsersPage() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("employee");

  const { data: users, isLoading } = useQuery({
    queryKey: ["users_admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    }
  });

  const inviteMutation = useMutation({
    mutationFn: async (email: string) => {
      // Typically you'd call a server action or edge function to invite user + create profile
      // For this implementation, we just simulate the UI flow.
      toast.info("Invite flow requires Supabase admin API or Edge Function. Simulated success.");
      return true;
    },
    onSuccess: () => {
      setEmail("");
      toast.success("User invited");
    }
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const newStatus = status === 'active' ? 'inactive' : 'active';
      const { error } = await supabase.from("profiles").update({ status: newStatus }).eq("id", id);
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users_admin"] });
      toast.success("User status updated");
    }
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">User Management</h1>

      <Card>
        <CardHeader>
          <CardTitle>Invite User</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="space-y-2 flex-1 max-w-xs">
              <label className="text-sm font-medium">Email Address</label>
              <Input 
                placeholder="user@example.com" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
              />
            </div>
            <div className="space-y-2 w-[200px]">
              <label className="text-sm font-medium">Role</label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => {
              if (email.trim()) inviteMutation.mutate(email);
            }} disabled={inviteMutation.isPending || !email.trim()}>
              <Mail className="mr-2 h-4 w-4" /> Send Invite
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="border rounded-lg bg-background overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="px-6 py-4 text-center">Loading...</td></tr>
            ) : users?.map(user => (
              <tr key={user.id} className="border-b last:border-0 hover:bg-muted/50">
                <td className="px-6 py-4 font-medium">{user.name || "Pending Invite"}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4 capitalize">{user.role}</td>
                <td className="px-6 py-4">
                  <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>{user.status}</Badge>
                </td>
                <td className="px-6 py-4">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => toggleStatusMutation.mutate({ id: user.id, status: user.status || 'inactive' })}
                  >
                    {user.status === 'active' ? (
                      <><XCircle className="mr-2 h-4 w-4 text-red-500" /> Deactivate</>
                    ) : (
                      <><CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Activate</>
                    )}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
