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

export default function RegionsPage() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const [newRegion, setNewRegion] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");

  const { data: divisions } = useQuery({
    queryKey: ["divisions_select"],
    queryFn: async () => {
      const { data } = await supabase.from("divisions").select("id, name").order("name");
      return data || [];
    }
  });

  const { data: regions, isLoading } = useQuery({
    queryKey: ["regions_admin", selectedDivision],
    queryFn: async () => {
      let query = supabase.from("regions").select("*, division:divisions(name)").order("name");
      if (selectedDivision) {
        query = query.eq("division_id", selectedDivision);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase.from("regions").insert([{ name, division_id: selectedDivision }]).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regions_admin"] });
      setNewRegion("");
      toast.success("Region created");
    },
    onError: (e) => toast.error(`Error: ${e.message}`)
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manage Regions</h1>

      <Card>
        <CardHeader>
          <CardTitle>Add Region</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={selectedDivision} onValueChange={setSelectedDivision}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Division" />
              </SelectTrigger>
              <SelectContent>
                {divisions?.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input 
              placeholder="Region Name" 
              value={newRegion} 
              onChange={e => setNewRegion(e.target.value)} 
              className="max-w-xs"
            />
            <Button onClick={() => {
              if (newRegion.trim() && selectedDivision) createMutation.mutate(newRegion);
              else toast.error("Please select a division and enter a region name");
            }} disabled={createMutation.isPending}>
              Add Region
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="border rounded-lg bg-background">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
            <tr>
              <th className="px-6 py-3">Region Name</th>
              <th className="px-6 py-3">Division</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={3} className="px-6 py-4">Loading...</td></tr>
            ) : regions?.map(reg => (
              <tr key={reg.id} className="border-b last:border-0">
                <td className="px-6 py-4 font-medium">{reg.name}</td>
                <td className="px-6 py-4">{reg.division?.name}</td>
                <td className="px-6 py-4">
                  <Badge variant={reg.status === 'active' ? 'default' : 'secondary'}>{reg.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
