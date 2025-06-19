
"use client";

import { useState, useEffect } from "react";
import RouteCard from "@/components/features/routes/route-card";
import type { Route } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Search } from "lucide-react";
import Link from "next/link";

// Mock data for favorite routes
const mockFavoriteRoutesInitial: Route[] = [
  { id: "fav1", startPoint: "KR Puram", destination: "Google Office", timing: "09:30", days: ["Tue", "Thu"], rider: { id: "r5", name: "Anjali", role: 'rider' }, availableSeats: 1, cost: 140.00, status: 'available' },
  { id: "fav2", startPoint: "Tin Factory", destination: "Gopalan Mall", timing: "07:00", days: ["Mon", "Wed", "Fri"], rider: { id: "r6", name: "Vikram", role: 'rider' }, availableSeats: 3, cost: 90.00, status: 'available' },
];

export default function FavoritesPage() {
  const { toast } = useToast();
  const [favoriteRoutes, setFavoriteRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching favorite routes
    setTimeout(() => {
      setFavoriteRoutes(mockFavoriteRoutesInitial);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleBookRide = (routeId: string) => {
    console.log("Book ride from favorites:", routeId);
    toast({
      title: "Ride Requested!",
      description: "The rider has been notified. Check 'My Rides' for updates.",
      variant: "default",
    });
     setFavoriteRoutes(prevRoutes => prevRoutes.map(r => r.id === routeId ? {...r, status: 'requested'} : r));
  };

  const handleViewDetails = (routeId: string) => {
    console.log("View details for favorite route:", routeId);
    const route = favoriteRoutes.find(r => r.id === routeId);
    if (route) {
        toast({
            title: `Details for ${route.startPoint} to ${route.destination}`,
            description: `Rider: ${route.rider.name}, Time: ${route.timing}, Seats: ${route.availableSeats}, Cost: ₹${route.cost?.toFixed(2)}`,
        });
    }
  };
  
  const removeFromFavorites = (routeId: string) => {
    setFavoriteRoutes(prev => prev.filter(route => route.id !== routeId));
    toast({ title: "Removed from Favorites", variant: "default" });
  };


  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <Heart className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
        <p className="text-xl font-body text-muted-foreground">Loading your favorite routes...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-6">
        <Heart className="h-10 w-10 text-red-500" />
        <h1 className="text-4xl font-headline font-semibold">My Favorite Routes</h1>
      </div>

      {favoriteRoutes.length > 0 ? (
        <>
        <p className="font-body text-lg text-muted-foreground mb-6">
          These are your saved routes. You'll get smart alerts when matching riders become available (feature coming soon!).
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteRoutes.map((route) => (
            <RouteCard 
              key={route.id} 
              route={route} 
              onBook={handleBookRide} 
              onViewDetails={handleViewDetails}
              isFavorited={true} // All routes here are favorited
              onToggleFavorite={removeFromFavorites} // Action here is to remove
            />
          ))}
        </div>
        </>
      ) : (
        <Card className="text-center py-10 rounded-lg shadow-md">
          <CardContent>
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-headline font-semibold mb-2">No Favorite Routes Yet</h2>
            <p className="font-body text-muted-foreground mb-6">
              Start searching for routes and add them to your favorites to quickly access them later.
            </p>
            <Button asChild size="lg" className="font-headline bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/search-routes">
                <Search className="mr-2 h-5 w-5" /> Find Routes
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
