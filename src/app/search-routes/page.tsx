
"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import RouteCard from "@/components/features/routes/route-card";
import type { Route } from "@/types";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { MapIcon, ListIcon, Search, MapPin, Clock, CalendarDays, Filter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getRoutes, updateRouteStatus, getRouteById } from "@/lib/route-store";

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
  days: z.array(z.string()).optional(), // Expects array of short day codes e.g. ["mon", "tue"]
});

type SearchRouteFormValues = z.infer<typeof searchRouteSchema>;

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
    console.log("Search criteria:", data);
    const allCurrentRoutes = getRoutes();
    
    const results = allCurrentRoutes.filter(route => {
      const destinationMatch = route.destination.toLowerCase().includes(data.destination.toLowerCase());
      const timingMatch = !data.timing || route.timing === data.timing;
      // Assumes route.days are short lowercase codes (e.g., "mon")
      const daysMatch = !data.days || data.days.length === 0 || data.days.every(day => route.days.includes(day));
      const statusMatch = route.status === 'available'; // Only show available routes for new bookings
      return destinationMatch && timingMatch && daysMatch && statusMatch;
    });

    setSearchResults(results);
    setSearched(true);
    if (results.length === 0) {
      toast({
        title: "No Available Routes Found",
        description: "Try adjusting your search criteria or check back later.",
        variant: "default",
      });
    }
  }

  const handleBookRide = (routeId: string) => {
    console.log("Attempting to book ride:", routeId);
    const routeToBook = getRouteById(routeId);

    if (!routeToBook) {
      toast({ title: "Error", description: "Route not found.", variant: "destructive" });
      return;
    }

    if (routeToBook.status !== 'available' || routeToBook.availableSeats <= 0) {
      toast({
        title: "Cannot Book Ride",
        description: "This ride is currently not available or has no seats.",
        variant: "default",
      });
      return;
    }

    const updatedRoute = updateRouteStatus(routeId, 'requested');
    
    if (updatedRoute) {
        toast({
          title: "Ride Requested!",
          description: "The rider has been notified. Check 'My Rides' for updates.",
          variant: "default",
        });
        // Update the search results to reflect the change (e.g., status, seats)
        // If the route became full after this request, it should no longer be shown as available.
        setSearchResults(prevResults => 
          prevResults.map(r => r.id === routeId ? updatedRoute : r)
                     .filter(r => r.status === 'available' || (r.id === routeId && updatedRoute.status === 'requested')) // Keep showing available, or the one just requested
        );
    } else {
        toast({
            title: "Booking Error",
            description: "Could not process your ride request. Please try again.",
            variant: "destructive",
          });
    }
  };

  const handleViewDetails = (routeId: string) => {
    console.log("View details for route:", routeId);
    const route = getRouteById(routeId);
    if (route) {
      toast({
        title: `Details for ${route.startPoint} to ${route.destination}`,
        description: `Rider: ${route.rider.name}, Time: ${route.timing}, Seats: ${route.availableSeats}, Status: ${route.status || 'N/A'}, Cost: ${route.cost ? `₹${route.cost.toFixed(2)}` : 'Not specified'}`,
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
                        <Input placeholder="e.g., Google Office" {...field} className="font-body text-base" />
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
