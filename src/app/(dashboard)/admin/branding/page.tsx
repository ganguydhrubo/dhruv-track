"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload } from "lucide-react";

export default function BrandingPage() {
  const [primaryColor, setPrimaryColor] = useState("#0f172a");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
    }
  };

  const handleSave = () => {
    // Here you would upload the logo to Supabase storage and save the color to settings table
    toast.success("Branding settings saved successfully");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Organization Branding</h1>
        <p className="text-muted-foreground">Customize the appearance of the application for your organization.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Logo</CardTitle>
          <CardDescription>Upload your organization logo to be displayed in the sidebar and reports.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-6">
            <div className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/50 overflow-hidden">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain" />
              ) : (
                <div className="text-center text-muted-foreground">
                  <Upload className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  <span className="text-xs">No logo</span>
                </div>
              )}
            </div>
            <div className="space-y-2 flex-1">
              <Label htmlFor="logo">Upload Image</Label>
              <Input id="logo" type="file" accept="image/*" onChange={handleLogoChange} />
              <p className="text-xs text-muted-foreground">Recommended: Square image, PNG or SVG, max 2MB.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Theme Colors</CardTitle>
          <CardDescription>Select the primary brand color for your organization.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Primary Color</Label>
            <div className="flex gap-4">
              <Input 
                type="color" 
                value={primaryColor} 
                onChange={(e) => setPrimaryColor(e.target.value)} 
                className="w-16 h-10 p-1 cursor-pointer"
              />
              <Input 
                type="text" 
                value={primaryColor} 
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="font-mono flex-1 max-w-[200px]"
              />
            </div>
          </div>

          <div className="space-y-2 border-t pt-4">
            <Label>Preview</Label>
            <div className="p-4 border rounded-lg flex items-center gap-4 bg-background">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: primaryColor }}
              >
                DT
              </div>
              <div>
                <div className="font-semibold" style={{ color: primaryColor }}>Branded Component</div>
                <div className="text-sm text-muted-foreground">This is how your theme color will look.</div>
              </div>
              <Button className="ml-auto" style={{ backgroundColor: primaryColor }}>Action Button</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline">Reset to Defaults</Button>
        <Button onClick={handleSave}>Save Branding Settings</Button>
      </div>
    </div>
  );
}
