"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { QRCodeDisplay } from "@/components/shared/qr-code";

export default function LocationDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: location, isLoading } = useQuery({
    queryKey: ["location", params.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("locations")
        .select("*, area:areas(name)")
        .eq("id", params.id)
        .single();
      if (error) throw error;
      return data;
    }
  });

  const { data: employees } = useQuery({
    queryKey: ["location_employees", params.id],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("id, name, role").eq("location_id", params.id);
      return data || [];
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (!location) return <div>Location not found</div>;

  // The QR value typically encodes an action, e.g., scanning at a location
  const qrValue = JSON.stringify({ type: "location", id: location.id, name: location.name });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{location.name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Location Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-muted-foreground">Area:</div>
              <div>{location.area?.name}</div>
              <div className="text-muted-foreground">Coordinates:</div>
              <div>{location.latitude}, {location.longitude}</div>
              <div className="text-muted-foreground">Type:</div>
              <div>{location.location_type}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="print:shadow-none print:border-none">
          <CardHeader className="print:hidden">
            <CardTitle className="flex justify-between items-center">
              QR Code
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" /> Print
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
            <QRCodeDisplay value={qrValue} />
            <p className="text-sm text-muted-foreground print:hidden">
              Scan this QR to verify presence at this location.
            </p>
            <div className="hidden print:block text-center mt-4">
              <h2 className="text-xl font-bold">{location.name}</h2>
              <p>Scan to verify attendance</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="print:hidden">
        <CardHeader>
          <CardTitle>Assigned Personnel ({employees?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {employees?.map(emp => (
              <div key={emp.id} className="p-3 border rounded-md">
                <div className="font-medium">{emp.name}</div>
                <div className="text-sm text-muted-foreground">{emp.role}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
