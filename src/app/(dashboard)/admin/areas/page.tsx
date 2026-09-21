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

export default function AreasPage() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const [newArea, setNewArea] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");

  const { data: regions } = useQuery({
    queryKey: ["regions_select"],
    queryFn: async () => {
      const { data } = await supabase.from("regions").select("id, name, division:divisions(name)").order("name");
      return data || [];
    }
  });

  const { data: areas, isLoading } = useQuery({
    queryKey: ["areas_admin", selectedRegion],
    queryFn: async () => {
      let query = supabase.from("areas").select("*, region:regions(name, division:divisions(name))").order("name");
      if (selectedRegion) {
        query = query.eq("region_id", selectedRegion);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase.from("areas").insert([{ name, region_id: selectedRegion }]).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas_admin"] });
      setNewArea("");
      toast.success("Area created");
    },
    onError: (e) => toast.error(`Error: ${e.message}`)
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manage Areas</h1>

      <Card>
        <CardHeader>
          <CardTitle>Add Area</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select Region" />
              </SelectTrigger>
              <SelectContent>
                {regions?.map(r => <SelectItem key={r.id} value={r.id}>{r.name} ({r.division?.name})</SelectItem>)}
              </SelectContent>
            </Select>
            <Input 
              placeholder="Area Name" 
              value={newArea} 
              onChange={e => setNewArea(e.target.value)} 
              className="max-w-xs"
            />
            <Button onClick={() => {
              if (newArea.trim() && selectedRegion) createMutation.mutate(newArea);
              else toast.error("Please select a region and enter an area name");
            }} disabled={createMutation.isPending}>
              Add Area
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="border rounded-lg bg-background">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
            <tr>
              <th className="px-6 py-3">Area Name</th>
              <th className="px-6 py-3">Region</th>
              <th className="px-6 py-3">Division</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={4} className="px-6 py-4">Loading...</td></tr>
            ) : areas?.map(area => (
              <tr key={area.id} className="border-b last:border-0">
                <td className="px-6 py-4 font-medium">{area.name}</td>
                <td className="px-6 py-4">{area.region?.name}</td>
                <td className="px-6 py-4">{area.region?.division?.name}</td>
                <td className="px-6 py-4">
                  <Badge variant={area.status === 'active' ? 'default' : 'secondary'}>{area.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
