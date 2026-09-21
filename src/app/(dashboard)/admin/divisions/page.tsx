"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export default function DivisionsPage() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const [newDivision, setNewDivision] = useState("");

  const { data: divisions, isLoading } = useQuery({
    queryKey: ["divisions_admin"],
    queryFn: async () => {
      const { data, error } = await supabase.from("divisions").select("*").order("name");
      if (error) throw error;
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase.from("divisions").insert([{ name }]).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["divisions_admin"] });
      setNewDivision("");
      toast.success("Division created");
    },
    onError: (e) => toast.error(`Error: ${e.message}`)
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manage Divisions</h1>

      <Card>
        <CardHeader>
          <CardTitle>Add Division</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input 
              placeholder="Division Name" 
              value={newDivision} 
              onChange={e => setNewDivision(e.target.value)} 
              className="max-w-xs"
            />
            <Button onClick={() => {
              if (newDivision.trim()) createMutation.mutate(newDivision);
            }} disabled={createMutation.isPending || !newDivision.trim()}>
              <Plus className="mr-2 h-4 w-4" /> Add
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="border rounded-lg bg-background">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={3} className="px-6 py-4">Loading...</td></tr>
            ) : divisions?.map(div => (
              <tr key={div.id} className="border-b last:border-0">
                <td className="px-6 py-4 font-medium">{div.name}</td>
                <td className="px-6 py-4">
                  <Badge variant={div.status === 'active' ? 'default' : 'secondary'}>{div.status}</Badge>
                </td>
                <td className="px-6 py-4">
                  <Button variant="ghost" size="sm">Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
