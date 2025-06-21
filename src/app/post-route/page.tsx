
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription as ShadCardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { addRoute } from "@/lib/route-store";
import { PlusCircle, MapPin, Clock, CalendarDays, Users, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const daysOfWeek = [
  { id: "mon", label: "Monday" },
  { id: "tue", label: "Tuesday" },
  { id: "wed", label: "Wednesday" },
  { id: "thu", label: "Thursday" },
  { id: "fri", label: "Friday" },
  { id: "sat", label: "Saturday" },
  { id: "sun", label: "Sunday" },
] as const;

const postRouteSchema = z.object({
  startPoint: z.string().min(3, "Start point must be at least 3 characters."),
  destination: z.string().min(3, "Destination must be at least 3 characters."),
  timing: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)."),
  days: z.array(z.string()).min(1, "Select at least one day."),
  availableSeats: z.coerce.number().min(1, "At least 1 seat must be available.").max(10, "Cannot offer more than 10 seats."),
  cost: z.coerce.number().min(0, "Cost cannot be negative.").optional(),
});

type PostRouteFormValues = z.infer<typeof postRouteSchema>;

export default function PostRoutePage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PostRouteFormValues>({
    resolver: zodResolver(postRouteSchema),
    defaultValues: {
      startPoint: "",
      destination: "",
      timing: "08:00",
      days: [],
      availableSeats: 2,
    },
  });

  async function onSubmit(data: PostRouteFormValues) {
    setIsLoading(true);
    console.log("Posting route:", data);

    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const newRoute = addRoute(data);
      toast({
        title: "Route Posted!",
        description: `Your route from ${newRoute.startPoint} to ${newRoute.destination} has been successfully posted.`,
        variant: "default",
      });
      form.reset();
    } catch (error) {
      console.error("Error posting route:", error);
      toast({
        title: "Error Posting Route",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto shadow-xl rounded-lg">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <PlusCircle className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-headline">Post Your Daily Route</CardTitle>
          </div>
          <ShadCardDescription className="font-body text-base">
            Offer a ride to fellow commuters and help reduce traffic!
          </ShadCardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="startPoint"
                render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-headline text-lg flex items-center gap-2"><MapPin className="h-5 w-5 text-primary"/>Start Point</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., KR Puram"
                              {...field}
                              className="font-body text-base"
                            />
                          </FormControl>
                      <FormMessage />
                    </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-headline text-lg flex items-center gap-2"><MapPin className="h-5 w-5 text-primary"/>Destination</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Google Office"
                              {...field}
                              className="font-body text-base"
                            />
                          </FormControl>
                      <FormMessage />
                    </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="timing"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-headline text-lg flex items-center gap-2"><Clock className="h-5 w-5 text-primary"/>Departure Time (HH:MM)</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} className="font-body text-base"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="availableSeats"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-headline text-lg flex items-center gap-2"><Users className="h-5 w-5 text-primary"/>Available Seats</FormLabel>
                       <Select
                          onValueChange={(value) => field.onChange(parseInt(value, 10))}
                          defaultValue={String(field.value)}
                        >
                          <FormControl>
                            <SelectTrigger className="font-body text-base">
                              <SelectValue placeholder="Select seats" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6].map(num => (
                              <SelectItem key={num} value={String(num)}>{num} seat{num > 1 ? 's' : ''}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="days"
                render={() => (
                  <FormItem>
                    <FormLabel className="font-headline text-lg flex items-center gap-2"><CalendarDays className="h-5 w-5 text-primary"/>Days of the Week</FormLabel>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2">
                      {daysOfWeek.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="days"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.id}
                                className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 shadow-sm hover:bg-muted/50 transition-colors"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), item.id])
                                        : field.onChange(
                                            (field.value || []).filter(
                                              (value) => value !== item.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal font-body text-base">
                                  {item.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-headline text-lg flex items-center gap-2">₹ Cost per Seat (INR, Optional)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 150" {...field} value={field.value ?? ""} onChange={e => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))} className="font-body text-base"/>
                    </FormControl>
                    <FormDescription className="font-body text-sm">
                      Leave blank or 0 if the ride is free. Otherwise, enter the cost for one seat.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading} size="lg" className="w-full font-headline text-lg bg-primary hover:bg-primary/90">
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <PlusCircle className="mr-2 h-5 w-5" />
                )}
                {isLoading ? "Posting Route..." : "Post This Route"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
