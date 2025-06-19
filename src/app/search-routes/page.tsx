
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import RouteCard from "@/components/features/routes/route-card";
import type { Route } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { getRoutes, updateRouteStatus, getAllKnownLocations } from "@/lib/route-store";
import { Search, Filter, SlidersHorizontal, MapPin, Clock, CalendarDays, Loader2, Heart, Users } from "lucide-react";

const mockFavoriteRouteIdsInitial: string[] = ["fav1_from_store", "fav2_from_store"];

const daysOfWeek = [
  { id: "mon", label: "Mon" },
  { id: "tue", label: "Tue" },
  { id: "wed", label: "Wed" },
  { id: "thu", label: "Thu" },
  { id: "fri", label: "Fri" },
  { id: "sat", label: "Sat" },
  { id: "sun", label: "Sun" },
] as const;

const searchSchema = z.object({
  destination: z.string().min(1, "Destination is required."),
  startPoint: z.string().optional(),
  timing: z.string().optional(), 
  days: z.array(z.string()).optional(),
  maxCost: z.coerce.number().positive().optional(),
  minSeats: z.coerce.number().min(1).optional(),
});

type SearchFormValues = z.infer<typeof searchSchema>;

export default function SearchRoutesPage() {
  const { toast } = useToast();
  const [allRoutes, setAllRoutes] = useState<Route[]>([]);
  const [searchResults, setSearchResults] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [favoriteRouteIds, setFavoriteRouteIds] = useState<string[]>(new Set(mockFavoriteRouteIdsInitial));

  const [allKnownLocations, setAllKnownLocations] = useState<string[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<string[]>([]);
  const [isDestinationPopoverOpen, setIsDestinationPopoverOpen] = useState(false);
  const [startPointSuggestions, setStartPointSuggestions] = useState<string[]>([]);
  const [isStartPointPopoverOpen, setIsStartPointPopoverOpen] = useState(false);

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      destination: "",
      startPoint: "",
      timing: "",
      days: [],
      maxCost: undefined,
      minSeats: 1,
    },
  });

  useEffect(() => {
    const routes = getRoutes();
    setAllRoutes(routes);
    setSearchResults(routes.filter(route => route.status === 'available').slice(0, 6)); 
    setAllKnownLocations(getAllKnownLocations());
  }, []);

  const handleDestinationInputChange = (value: string, fieldChange: (value: string) => void) => {
    fieldChange(value);
    if (value.length > 0) {
      const filtered = allKnownLocations.filter(loc =>
        loc.toLowerCase().includes(value.toLowerCase()) && loc.toLowerCase() !== value.toLowerCase()
      );
      setDestinationSuggestions(filtered);
      setIsDestinationPopoverOpen(filtered.length > 0);
    } else {
      setDestinationSuggestions([]);
      setIsDestinationPopoverOpen(false);
    }
  };

  const handleStartPointInputChange = (value: string, fieldChange: (value: string) => void) => {
    fieldChange(value);
    if (value.length > 0) {
      const filtered = allKnownLocations.filter(loc =>
        loc.toLowerCase().includes(value.toLowerCase()) && loc.toLowerCase() !== value.toLowerCase()
      );
      setStartPointSuggestions(filtered);
      setIsStartPointPopoverOpen(filtered.length > 0);
    } else {
      setStartPointSuggestions([]);
      setIsStartPointPopoverOpen(false);
    }
  };

  const handleSearchSubmit = (data: SearchFormValues) => {
    setIsLoading(true);
    console.log("Search criteria:", data);
    setTimeout(() => {
      const filteredRoutes = allRoutes.filter(route => {
        let matches = true;
        if (route.status !== 'available') return false; 

        if (data.destination && !route.destination.toLowerCase().includes(data.destination.toLowerCase())) {
          matches = false;
        }
        if (data.startPoint && !route.startPoint.toLowerCase().includes(data.startPoint.toLowerCase())) {
          matches = false;
        }
        if (data.timing) {
          const searchTime = data.timing; 
          const routeTime = route.timing; 
          if (searchTime && routeTime) {
             const [sH, sM] = searchTime.split(':').map(Number);
             const [rH, rM] = routeTime.split(':').map(Number);
             const searchDate = new Date(0,0,0,sH,sM);
             const routeDate = new Date(0,0,0,rH,rM);
             const diffMinutes = Math.abs((searchDate.getTime() - routeDate.getTime()) / 60000);
             if (diffMinutes > 60) { 
                 matches = false;
             }
          }
        }
        if (data.days && data.days.length > 0 && !data.days.every(day => route.days.includes(day))) {
          matches = false;
        }
        if (data.maxCost && route.cost && route.cost > data.maxCost) {
          matches = false;
        }
        if (data.minSeats && route.availableSeats < data.minSeats) {
          matches = false;
        }
        return matches;
      });

      setSearchResults(filteredRoutes);
      setIsLoading(false);
      toast({
        title: "Search Complete",
        description: `Found ${filteredRoutes.length} matching routes.`,
      });
    }, 500);
  };

  const handleBookRide = (routeId: string) => {
    const updatedRoute = updateRouteStatus(routeId, 'requested');
    if (updatedRoute) {
      toast({
        title: "Ride Requested!",
        description: "The rider has been notified. Check 'My Rides' for updates.",
        variant: "default",
      });
      setAllRoutes(prevAllRoutes => prevAllRoutes.map(r => r.id === routeId ? updatedRoute : r));
      setSearchResults(prevResults => 
        prevResults.map(r => r.id === routeId ? updatedRoute : r).filter(r => r.status === 'available')
      );
    } else {
      toast({
        title: "Booking Failed",
        description: "Could not request this ride. It might no longer be available.",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (routeId: string) => {
    const route = searchResults.find(r => r.id === routeId) || allRoutes.find(r => r.id === routeId);
    if (route) {
        toast({
            title: `Route: ${route.startPoint} to ${route.destination}`,
            description: `Rider: ${route.rider.name}, Time: ${route.timing}, Seats: ${route.availableSeats}, Cost: ₹${route.cost?.toFixed(2) || 'N/A'}`,
        });
    }
  };
  
  const handleToggleFavorite = (routeId: string) => {
    setFavoriteRouteIds(prevIds => {
      const newIds = new Set(prevIds);
      if (newIds.has(routeId)) {
        newIds.delete(routeId);
        toast({ title: "Removed from Favorites", variant: "default" });
      } else {
        newIds.add(routeId);
        toast({ title: "Added to Favorites!", variant: "default" });
      }
      return Array.from(newIds);
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
            <form onSubmit={form.handleSubmit(handleSearchSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-headline text-lg flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" /> Destination</FormLabel>
                      <Popover open={isDestinationPopoverOpen} onOpenChange={setIsDestinationPopoverOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Input 
                              placeholder="e.g., Google Office" 
                              {...field}
                              onChange={(e) => handleDestinationInputChange(e.target.value, field.onChange)}
                              onFocus={(e) => {
                                if (e.target.value.length > 0) {
                                  const filtered = allKnownLocations.filter(loc => loc.toLowerCase().includes(e.target.value.toLowerCase()) && loc.toLowerCase() !== e.target.value.toLowerCase());
                                  setDestinationSuggestions(filtered);
                                  setIsDestinationPopoverOpen(filtered.length > 0);
                                }
                              }}
                              onBlur={() => { field.onBlur(); setTimeout(() => setIsDestinationPopoverOpen(false), 150);}}
                              className="font-body text-base" 
                              autoComplete="off"
                            />
                          </FormControl>
                        </PopoverTrigger>
                        {destinationSuggestions.length > 0 && (
                          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                            <div className="max-h-48 overflow-y-auto">
                              {destinationSuggestions.map((suggestion, index) => (
                                <div
                                  key={index}
                                  className="p-2 hover:bg-accent cursor-pointer text-sm"
                                  onClick={() => {
                                    field.onChange(suggestion);
                                    setIsDestinationPopoverOpen(false);
                                    setDestinationSuggestions([]);
                                  }}
                                >
                                  {suggestion}
                                </div>
                              ))}
                            </div>
                          </PopoverContent>
                        )}
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startPoint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-headline text-lg flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" /> Start Point (Optional)</FormLabel>
                       <Popover open={isStartPointPopoverOpen} onOpenChange={setIsStartPointPopoverOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Input 
                              placeholder="e.g., KR Puram" 
                              {...field} 
                              onChange={(e) => handleStartPointInputChange(e.target.value, field.onChange)}
                              onFocus={(e) => {
                                if (e.target.value.length > 0) {
                                  const filtered = allKnownLocations.filter(loc => loc.toLowerCase().includes(e.target.value.toLowerCase()) && loc.toLowerCase() !== e.target.value.toLowerCase());
                                  setStartPointSuggestions(filtered);
                                  setIsStartPointPopoverOpen(filtered.length > 0);
                                }
                              }}
                              onBlur={() => { field.onBlur(); setTimeout(() => setIsStartPointPopoverOpen(false), 150);}}
                              className="font-body text-base"
                              autoComplete="off"
                            />
                          </FormControl>
                        </PopoverTrigger>
                        {startPointSuggestions.length > 0 && (
                          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                            <div className="max-h-48 overflow-y-auto">
                              {startPointSuggestions.map((suggestion, index) => (
                                <div
                                  key={index}
                                  className="p-2 hover:bg-accent cursor-pointer text-sm"
                                  onClick={() => {
                                    field.onChange(suggestion);
                                    setIsStartPointPopoverOpen(false);
                                    setStartPointSuggestions([]);
                                  }}
                                >
                                  {suggestion}
                                </div>
                              ))}
                            </div>
                          </PopoverContent>
                        )}
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="filters">
                  <AccordionTrigger>
                    <Button type="button" variant="ghost" className="font-headline text-lg text-primary hover:text-primary/80">
                      <SlidersHorizontal className="mr-2 h-5 w-5" /> Advanced Filters
                    </Button>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="timing"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-headline text-base flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Preferred Time (HH:MM)</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} className="font-body text-sm" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="maxCost"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-headline text-base flex items-center gap-2">₹ Max Cost (INR)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="e.g., 200" {...field} value={field.value ?? ""} className="font-body text-sm" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="minSeats"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-headline text-base flex items-center gap-2"><Users className="h-4 w-4 text-primary"/> Min. Seats Available</FormLabel>
                            <FormControl>
                               <Select 
                                onValueChange={(value) => field.onChange(parseInt(value))} 
                                defaultValue={field.value ? String(field.value) : "1"}
                              >
                                <SelectTrigger className="font-body text-sm">
                                  <SelectValue placeholder="Select min seats" />
                                </SelectTrigger>
                                <SelectContent>
                                  {[1,2,3,4].map(num => <SelectItem key={num} value={String(num)}>{num} seat{num > 1 ? 's' : ''}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            </FormControl>
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
                            <FormLabel className="font-headline text-base flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" /> Days of the Week</FormLabel>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 pt-2">
                            {daysOfWeek.map((item) => (
                              <FormField
                                key={item.id}
                                control={form.control}
                                name="days"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={item.id}
                                      className="flex flex-row items-start space-x-2 space-y-0"
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
                                                )
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal font-body text-sm">
                                        {item.label}
                                      </FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Button type="submit" disabled={isLoading} size="lg" className="w-full font-headline text-lg bg-primary hover:bg-primary/90">
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Search className="mr-2 h-5 w-5" />
                )}
                {isLoading ? "Searching..." : "Find Rides"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
         <div className="text-center py-10">
            <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-xl font-body text-muted-foreground">Finding matching rides...</p>
         </div>
      )}

      {!isLoading && searchResults.length > 0 && (
        <div>
          <h2 className="text-2xl font-headline font-semibold mb-6">Available Routes ({searchResults.length})</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((route) => (
              <RouteCard 
                key={route.id} 
                route={route} 
                onBook={handleBookRide} 
                onViewDetails={handleViewDetails}
                isFavorited={favoriteRouteIds.includes(route.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        </div>
      )}

      {!isLoading && searchResults.length === 0 && (
        <Card className="text-center py-10 shadow-md rounded-lg">
          <CardContent>
            <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-headline font-semibold mb-2">No Routes Found</h2>
            <p className="font-body text-muted-foreground">
              Try adjusting your search filters or check back later.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
