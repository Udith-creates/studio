"use client";

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CalendarDays, Clock, MapPin, PlusCircle, Repeat } from "lucide-react";

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
  startPoint: z.string().min(2, "Start point must be at least 2 characters."),
  destination: z.string().min(2, "Destination must be at least 2 characters."),
  timing: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)."),
  days: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one day.",
  }),
  availableSeats: z.coerce.number().min(1, "Must offer at least 1 seat.").max(10, "Cannot offer more than 10 seats."),
});

type PostRouteFormValues = z.infer<typeof postRouteSchema>;

export default function PostRoutePage() {
  const { toast } = useToast();
  const form = useForm<PostRouteFormValues>({
    resolver: zodResolver(postRouteSchema),
    defaultValues: {
      startPoint: "",
      destination: "",
      timing: "",
      days: [],
      availableSeats: 1,
    },
  });

  function onSubmit(data: PostRouteFormValues) {
    console.log("Route data:", data); // Placeholder for actual submission
    toast({
      title: "Route Posted!",
      description: "Your route has been successfully posted. Buddies can now find it.",
      variant: "default",
    });
    form.reset();
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto shadow-xl rounded-lg">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <PlusCircle className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-headline">Post Your Daily Route</CardTitle>
          </div>
          <CardDescription className="font-body text-base">
            Share your commute details so buddies can find and join your ride.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="startPoint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-headline text-lg flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" /> Start Point</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Downtown Central Station" {...field} className="font-body text-base" />
                    </FormControl>
                    <FormDescription className="font-body">
                      Where does your daily route begin?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-headline text-lg flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" /> Destination</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Tech Park North Campus" {...field} className="font-body text-base" />
                    </FormControl>
                    <FormDescription className="font-body">
                      Where does your daily route end?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="timing"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-headline text-lg flex items-center gap-2"><Clock className="h-5 w-5 text-primary" /> Departure Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} className="font-body text-base" />
                    </FormControl>
                    <FormDescription className="font-body">
                      What time do you usually start your trip? (HH:MM format)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="availableSeats"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-headline text-lg flex items-center gap-2"><UserIcon className="h-5 w-5 text-primary" /> Available Seats</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="10" {...field} className="font-body text-base" />
                    </FormControl>
                    <FormDescription className="font-body">
                      How many seats can you offer to buddies?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="days"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="font-headline text-lg flex items-center gap-2"><Repeat className="h-5 w-5 text-primary" /> Days of the Week</FormLabel>
                      <FormDescription className="font-body">
                        Select the days you usually make this trip.
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {daysOfWeek.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="days"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-center space-x-3 space-y-0 p-3 border rounded-md hover:bg-secondary/50 transition-colors"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, item.id])
                                      : field.onChange(
                                          field.value?.filter(
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
              <Button type="submit" size="lg" className="w-full font-headline text-lg bg-primary hover:bg-primary/90">
                <PlusCircle className="mr-2 h-5 w-5" /> Post Route
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
