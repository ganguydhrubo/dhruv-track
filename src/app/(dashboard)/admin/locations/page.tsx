"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

export default function LocationsPage() {
  const supabase = createClient();

  const { data: locations, isLoading } = useQuery({
    queryKey: ["locations_admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("locations")
        .select("*, area:areas(name, region:regions(name, division:divisions(name)))")
        .order("name");
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Locations</h1>
        <Button><Plus className="mr-2 h-4 w-4" /> Add Location</Button>
      </div>

      <div className="border rounded-lg bg-background overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
            <tr>
              <th className="px-6 py-3">Location Name</th>
              <th className="px-6 py-3">Area</th>
              <th className="px-6 py-3">Region</th>
              <th className="px-6 py-3">Division</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="px-6 py-4 text-center">Loading...</td></tr>
            ) : locations?.map(loc => (
              <tr key={loc.id} className="border-b last:border-0 hover:bg-muted/50">
                <td className="px-6 py-4 font-medium">{loc.name}</td>
                <td className="px-6 py-4">{loc.area?.name}</td>
                <td className="px-6 py-4">{loc.area?.region?.name}</td>
                <td className="px-6 py-4">{loc.area?.region?.division?.name}</td>
                <td className="px-6 py-4">
                  <Link href={`/admin/locations/${loc.id}`}>
                    <Button variant="outline" size="sm">View / QR</Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
