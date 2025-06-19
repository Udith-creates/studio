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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import RouteCard from "@/components/features/routes/route-card";
import type { Route } from "@/types";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { MapIcon, ListIcon, Search, MapPin, Clock, CalendarDays, Filter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const daysOfWeek = [
  { id: "mon", label: "Monday" },
  { id: "tue", label: "Tuesday" },
  { id: "wed", label: "Wednesday" },
  { id: "thu", label: "Thursday" },
  { id: "fri", label: "Friday" },
  { id: "sat", label: "Saturday" },
  { id: "sun", label: "Sunday" },
] as const;

const searchRouteSchema = z.object({
  destination: z.string().min(2, "Destination must be at least 2 characters."),
  timing: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM).").optional().or(z.literal("")),
  days: z.array(z.string()).optional(),
});

type SearchRouteFormValues = z.infer<typeof searchRouteSchema>;

// Mock data for search results
const mockRoutes: Route[] = [
  { id: "1", startPoint: "Downtown", destination: "Tech Park", timing: "08:00", days: ["Mon", "Wed", "Fri"], rider: { id: "r1", name: "Alice", role: 'rider' }, availableSeats: 2, cost: 5.00, status: 'available' },
  { id: "2", startPoint: "Suburbia", destination: "Tech Park", timing: "08:30", days: ["Mon", "Tue", "Wed", "Thu", "Fri"], rider: { id: "r2", name: "Bob", role: 'rider' }, availableSeats: 1, cost: 7.50, status: 'full' },
  { id: "3", startPoint: "Old Town", destination: "City Center", timing: "09:00", days: ["Sat", "Sun"], rider: { id: "r3", name: "Charlie", role: 'rider' }, availableSeats: 3, cost: 3.00, status: 'available' },
  { id: "4", startPoint: "Westside", destination: "Tech Park", timing: "07:45", days: ["Mon", "Wed"], rider: { id: "r4", name: "Diana", role: 'rider' }, availableSeats: 1, cost: 6.20, status: 'confirmed' },
];

export default function SearchRoutesPage() {
  const { toast } = useToast();
  const [searchResults, setSearchResults] = useState<Route[]>([]);
  const [searched, setSearched] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const form = useForm<SearchRouteFormValues>({
    resolver: zodResolver(searchRouteSchema),
    defaultValues: {
      destination: "",
      timing: "",
      days: [],
    },
  });

  function onSubmit(data: SearchRouteFormValues) {
    console.log("Search criteria:", data); // Placeholder for actual search logic
    // Filter mock routes based on destination (case-insensitive)
    const results = mockRoutes.filter(route => 
      route.destination.toLowerCase().includes(data.destination.toLowerCase()) &&
      (!data.timing || route.timing === data.timing) &&
      (!data.days || data.days.length === 0 || data.days.some(day => route.days.map(d => d.toLowerCase().substring(0,3)).includes(day)))
    );
    setSearchResults(results);
    setSearched(true);
    if (results.length === 0) {
      toast({
        title: "No Routes Found",
        description: "Try adjusting your search criteria.",
        variant: "default",
      });
    }
  }

  const handleBookRide = (routeId: string) => {
    console.log("Book ride:", routeId);
    toast({
      title: "Ride Requested!",
      description: "The rider has been notified of your request.",
      variant: "default",
    });
    // Here you would typically update the route status or create a booking record
    setSearchResults(prevResults => prevResults.map(r => r.id === routeId ? {...r, status: 'requested'} : r));
  };

  const handleViewDetails = (routeId: string) => {
    console.log("View details for route:", routeId);
    // This would typically navigate to a route details page or show a modal
    const route = searchResults.find(r => r.id === routeId) || mockRoutes.find(r => r.id === routeId);
    if (route) {
      toast({
        title: `Details for ${route.startPoint} to ${route.destination}`,
        description: `Rider: ${route.rider.name}, Time: ${route.timing}, Seats: ${route.availableSeats}`,
      });
    }
  };

  const toggleFavorite = (routeId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(routeId)) {
        newFavorites.delete(routeId);
        toast({ title: "Removed from Favorites", variant: "default" });
      } else {
        newFavorites.add(routeId);
        toast({ title: "Added to Favorites!", variant: "default" });
      }
      return newFavorites;
    });
  };


  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8 shadow-xl rounded-lg">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Search className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-headline">Find Your Ride</CardTitle>
          </div>
          <CardDescription className="font-body text-base">
            Enter your destination and preferences to find matching routes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-headline text-lg flex items-center gap-2"><MapPin className="h-5 w-5 text-primary"/> Destination</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Tech Park" {...field} className="font-body text-base" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="timing"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-headline text-lg flex items-center gap-2"><Clock className="h-5 w-5 text-primary"/> Preferred Time (Optional)</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} className="font-body text-base" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <div className="md:col-span-3">
                  <FormField
                    control={form.control}
                    name="days"
                    render={() => (
                      <FormItem>
                        <div className="mb-2">
                          <FormLabel className="font-headline text-lg flex items-center gap-2"><CalendarDays className="h-5 w-5 text-primary"/> Preferred Days (Optional)</FormLabel>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                          {daysOfWeek.map((item) => (
                            <FormField
                              key={item.id}
                              control={form.control}
                              name="days"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={item.id}
                                    className="flex flex-row items-center space-x-2 space-y-0 p-2 border rounded-md hover:bg-secondary/50"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                          const currentDays = field.value || [];
                                          return checked
                                            ? field.onChange([...currentDays, item.id])
                                            : field.onChange(
                                                currentDays.filter(
                                                  (value) => value !== item.id
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal font-body text-sm">
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
                </div>
              </div>
              <Button type="submit" size="lg" className="w-full md:w-auto font-headline text-lg bg-primary hover:bg-primary/90">
                <Filter className="mr-2 h-5 w-5" /> Search Routes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {searched && (
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-1/3 mb-4">
            <TabsTrigger value="list" className="font-headline"><ListIcon className="mr-2 h-4 w-4"/>List View</TabsTrigger>
            <TabsTrigger value="map" className="font-headline"><MapIcon className="mr-2 h-4 w-4"/>Map View</TabsTrigger>
          </TabsList>
          <TabsContent value="list">
            {searchResults.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((route) => (
                  <RouteCard 
                    key={route.id} 
                    route={route} 
                    onBook={handleBookRide} 
                    onViewDetails={handleViewDetails}
                    isFavorited={favorites.has(route.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <Card className="text-center py-10 rounded-lg">
                <CardContent>
                  <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="font-body text-xl text-muted-foreground">No routes match your search criteria.</p>
                  <p className="font-body text-muted-foreground">Try adjusting your filters or check back later.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="map">
            <Card className="rounded-lg">
              <CardHeader>
                <CardTitle className="font-headline">Route Map</CardTitle>
                <CardDescription className="font-body">Visual representation of matching routes (placeholder).</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-[16/9] bg-muted rounded-md flex items-center justify-center">
                  <Image 
                    src="https://placehold.co/800x450.png" 
                    alt="Map placeholder" 
                    width={800} 
                    height={450}
                    className="object-cover rounded-md"
                    data-ai-hint="map route" 
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2 text-center font-body">Map integration coming soon!</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
