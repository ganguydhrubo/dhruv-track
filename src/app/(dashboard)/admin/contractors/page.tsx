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

export default function ContractorsPage() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const [newContractor, setNewContractor] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  const { data: contractors, isLoading } = useQuery({
    queryKey: ["contractors_admin"],
    queryFn: async () => {
      // Assuming you might add a 'contractors' table later, or we can use a dummy for now.
      // Or it might be profiles with contractor=true.
      // Let's create a contractors table fetch or fallback
      const { data, error } = await supabase.from("contractors").select("*").order("name").catch(() => ({ data: [], error: null }));
      // If table doesn't exist yet, we'll return empty array to prevent breaking
      return data || [];
    }
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.from("contractors").insert([{ 
        name: newContractor,
        contact_person: contactPerson,
        contact_email: contactEmail,
        status: 'active'
      }]).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contractors_admin"] });
      setNewContractor("");
      setContactPerson("");
      setContactEmail("");
      toast.success("Contractor added");
    },
    onError: (e) => toast.error(`Error: ${e.message}. Note: Contractors table may not exist yet.`)
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manage Contractors</h1>

      <Card>
        <CardHeader>
          <CardTitle>Add Contractor Company</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Company Name</label>
              <Input value={newContractor} onChange={e => setNewContractor(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Contact Person</label>
              <Input value={contactPerson} onChange={e => setContactPerson(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Contact Email</label>
              <Input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} />
            </div>
            <Button onClick={() => {
              if (newContractor.trim()) createMutation.mutate();
            }} disabled={createMutation.isPending || !newContractor.trim()}>
              <Plus className="mr-2 h-4 w-4" /> Add
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="border rounded-lg bg-background">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
            <tr>
              <th className="px-6 py-3">Company Name</th>
              <th className="px-6 py-3">Contact Person</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={4} className="px-6 py-4">Loading...</td></tr>
            ) : contractors?.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-4 text-center text-muted-foreground">No contractors found. (Table might need to be created)</td></tr>
            ) : contractors?.map(c => (
              <tr key={c.id} className="border-b last:border-0">
                <td className="px-6 py-4 font-medium">{c.name}</td>
                <td className="px-6 py-4">{c.contact_person}</td>
                <td className="px-6 py-4">{c.contact_email}</td>
                <td className="px-6 py-4">
                  <Badge variant={c.status === 'active' ? 'default' : 'secondary'}>{c.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
