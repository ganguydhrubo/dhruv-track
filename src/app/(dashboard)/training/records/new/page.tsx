"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/lib/supabase/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const recordSchema = z.object({
  course_id: z.string().min(1, "Course is required"),
  employee_id: z.string().min(1, "Employee is required"),
  trainer_id: z.string().optional(),
  completed_at: z.string().min(1, "Date is required"),
  status: z.enum(["pass", "fail", "pending"]),
  score: z.coerce.number().min(0).max(100).optional(),
});

export default function RecordTrainingPage() {
  const router = useRouter();
  const supabase = createClient();

  const form = useForm<z.infer<typeof recordSchema>>({
    resolver: zodResolver(recordSchema),
    defaultValues: {
      status: "pass",
      completed_at: new Date().toISOString().split("T")[0],
    },
  });

  const { data: courses } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data } = await supabase.from("training_courses").select("*").eq("status", "active");
      return data || [];
    }
  });

  const { data: employees } = useQuery({
    queryKey: ["employees_list"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("id, name, employee_id").eq("status", "active");
      return data || [];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (values: z.infer<typeof recordSchema>) => {
      // Calculate expires_at if the course has validity
      const course = courses?.find(c => c.id === values.course_id);
      let expires_at = undefined;
      
      if (course?.validity_months) {
        const d = new Date(values.completed_at);
        d.setMonth(d.getMonth() + course.validity_months);
        expires_at = d.toISOString();
      }

      const { data, error } = await supabase
        .from("training_records")
        .insert([{
          ...values,
          expires_at
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Training recorded successfully");
      router.push("/training/records");
    },
    onError: (error) => {
      toast.error(`Failed to record training: ${error.message}`);
    }
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Record Training Attendance</h1>

      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit((v) => createMutation.mutate(v))} className="space-y-6">
              
              <FormField
                control={form.control}
                name="course_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {courses?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="employee_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {employees?.map(e => <SelectItem key={e.id} value={e.id}>{e.name} ({e.employee_id})</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="completed_at"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Completion Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pass">Pass</SelectItem>
                          <SelectItem value="fail">Fail</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="score"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Score (%)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="100" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Saving..." : "Record Training"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
