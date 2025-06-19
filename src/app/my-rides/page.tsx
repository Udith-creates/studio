
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Route, Booking, User } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { BikeIcon } from "@/components/icons/bike-icon";
import { UserIcon } from "@/components/icons/user-icon";
import { AlertTriangle, Check, ListChecks, ThumbsDown, ThumbsUp, X, MapPin } from "lucide-react";
import RouteCard from "@/components/features/routes/route-card"; // Re-use for consistency
import Link from "next/link";

// Mock current user
const currentUserId = "user123";
const currentUser: User = { id: currentUserId, name: "Alex Rider", role: 'buddy' }; // Role can change

// Mock data
const mockOfferedRidesInitial: Route[] = [
  { id: "offered1", startPoint: "My Home", destination: "Office", timing: "08:00", days: ["mon", "wed", "fri"], rider: currentUser, availableSeats: 2, cost: 400.00, status: 'available' },
  { id: "offered2", startPoint: "My Home", destination: "Gym", timing: "18:00", days: ["tue", "thu"], rider: currentUser, availableSeats: 1, cost: 250.00, status: 'confirmed' },
];

const mockBookedRidesInitial: Booking[] = [
  { id: "booked1", routeId: "routeX", buddy: currentUser, rider: { id: "r1", name: "Alice", role: 'rider' }, status: 'confirmed', requestedAt: new Date(), updatedAt: new Date() },
  { id: "booked2", routeId: "routeY", buddy: currentUser, rider: { id: "r2", name: "Bob", role: 'rider' }, status: 'pending', requestedAt: new Date() },
];

// To make Booking displayable in RouteCard, we need to map it or create a specific BookingCard
// For simplicity, let's assume we can fetch full route details for booked rides.
const mockRoutesForBookings: Record<string, Route> = {
  routeX: { id: "routeX", startPoint: "Downtown", destination: "Tech Park", timing: "08:00", days: ["mon", "wed"], rider: { id: "r1", name: "Alice", role: 'rider' }, availableSeats: 0, cost: 500.00, status: 'confirmed'},
  routeY: { id: "routeY", startPoint: "Suburbia", destination: "Airport", timing: "14:00", days: ["sat"], rider: { id: "r2", name: "Bob", role: 'rider' }, availableSeats: 1, cost: 1500.00, status: 'available' /* but pending for me */ },
};


export default function MyRidesPage() {
  const { toast } = useToast();
  const [offeredRides, setOfferedRides] = useState<Route[]>(mockOfferedRidesInitial);
  const [bookedRides, setBookedRides] = useState<Booking[]>(mockBookedRidesInitial);

  // Mock incoming requests for rides I'm offering
  const [rideRequests, setRideRequests] = useState<Booking[]>([
    { id: "req1", routeId: "offered1", buddy: { id: "buddy1", name: "Charlie", role: 'buddy'}, rider: currentUser, status: 'pending', requestedAt: new Date() },
  ]);

  const handleRequestAction = (requestId: string, action: 'accept' | 'decline') => {
    const request = rideRequests.find(req => req.id === requestId);
    if (!request) return;

    setRideRequests(prev => prev.filter(req => req.id !== requestId));
    
    if (action === 'accept') {
        setOfferedRides(prevOffered => prevOffered.map(or => {
            if (or.id === request.routeId) {
                const newSeats = or.availableSeats -1;
                let newStatus: Route['status'] = 'confirmed';
                if (newSeats <= 0) {
                    newStatus = 'full';
                }
                return {...or, availableSeats: newSeats, status: newStatus };
            }
            return or;
        }));
    }
    toast({
      title: `Request ${action === 'accept' ? 'Accepted' : 'Declined'}`,
      description: `The buddy has been notified.`,
    });
  };

  const cancelBooking = (bookingId: string) => {
    setBookedRides(prev => prev.map(b => b.id === bookingId ? {...b, status: 'cancelled'} : b));
    toast({ title: "Booking Cancelled", description: "Your booking has been cancelled." });
  }

  const cancelOfferedRide = (routeId: string) => {
    setOfferedRides(prev => prev.map(r => r.id === routeId ? {...r, status: 'cancelled'} : r));
    // Also cancel any pending requests for this ride if needed (not implemented here)
    toast({ title: "Ride Cancelled", description: "Your offered ride has been cancelled." });
  }


  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-6">
        <ListChecks className="h-10 w-10 text-primary" />
        <h1 className="text-4xl font-headline font-semibold">My Rides</h1>
      </div>

      <Tabs defaultValue="offered" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-1/2 mb-6">
          <TabsTrigger value="offered" className="font-headline text-base"><BikeIcon className="mr-2 h-5 w-5"/>Rides I'm Offering</TabsTrigger>
          <TabsTrigger value="booked" className="font-headline text-base"><UserIcon className="mr-2 h-5 w-5"/>Rides I've Booked</TabsTrigger>
        </TabsList>

        <TabsContent value="offered">
          <Card className="mb-6 shadow-lg rounded-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Incoming Requests</CardTitle>
              <CardDescription className="font-body">Manage requests from buddies for your rides.</CardDescription>
            </CardHeader>
            <CardContent>
              {rideRequests.length > 0 ? (
                <ul className="space-y-4">
                  {rideRequests.map(req => {
                    const relatedOfferedRoute = offeredRides.find(r => r.id === req.routeId);
                    return (
                      <li key={req.id} className="p-4 border rounded-md flex flex-col sm:flex-row justify-between items-center gap-4 bg-secondary/30">
                        <div>
                          <p className="font-semibold font-body">{req.buddy.name} wants to join your ride to <span className="text-primary">{relatedOfferedRoute?.destination}</span>.</p>
                          <p className="text-sm text-muted-foreground font-body">Requested on: {req.requestedAt.toLocaleDateString()}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleRequestAction(req.id, 'accept')} className="bg-green-500 hover:bg-green-600 font-headline"><ThumbsUp className="mr-1 h-4 w-4"/>Accept</Button>
                          <Button variant="destructive" size="sm" onClick={() => handleRequestAction(req.id, 'decline')} className="font-headline"><ThumbsDown className="mr-1 h-4 w-4"/>Decline</Button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-muted-foreground font-body">No pending requests.</p>
              )}
            </CardContent>
          </Card>

          <h2 className="text-2xl font-headline font-semibold mb-4">My Posted Routes</h2>
          {offeredRides.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {offeredRides.map(route => (
                <RouteCard 
                  key={route.id} 
                  route={route} 
                  onViewDetails={() => toast({title: "Viewing details for your offered ride."})} 
                >
                  <div className="w-full space-y-2 mt-2">
                    {(route.status === 'confirmed' || route.status === 'full') && route.status !== 'completed' && route.status !== 'cancelled' && (
                        <Link href={`/my-rides/${route.id}/track`}>
                            <Button variant="outline" size="sm" className="w-full font-headline">
                            <MapPin className="mr-2 h-4 w-4"/> Track Ride
                            </Button>
                        </Link>
                    )}
                    {route.status !== 'cancelled' && route.status !== 'completed' && (
                      <Button variant="destructive" size="sm" onClick={() => cancelOfferedRide(route.id)} className="w-full font-headline">
                        <X className="mr-2 h-4 w-4"/> Cancel Ride
                      </Button>
                    )}
                  </div>
                </RouteCard>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground font-body">You haven't offered any rides yet. <Button variant="link" asChild><Link href="/post-route">Post one now!</Link></Button></p>
          )}
        </TabsContent>

        <TabsContent value="booked">
          <h2 className="text-2xl font-headline font-semibold mb-4">My Booked Rides</h2>
          {bookedRides.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {bookedRides.map(booking => {
                const routeDetails = mockRoutesForBookings[booking.routeId];
                if (!routeDetails) return null; 
                
                const displayRoute: Route = {
                    ...routeDetails,
                    status: booking.status === 'pending' ? 'requested' : booking.status === 'accepted' ? 'confirmed' : booking.status
                };

                return (
                  <RouteCard 
                    key={booking.id} 
                    route={displayRoute} 
                    onViewDetails={() => toast({title: `Viewing details for ride with ${booking.rider.name}`})}
                  >
                    <div className="w-full space-y-2 mt-2">
                        {booking.status === 'confirmed' && (
                           <Link href={`/my-rides/${booking.id}/track`}>
                             <Button variant="outline" size="sm" className="w-full font-headline">
                               <MapPin className="mr-2 h-4 w-4"/> Track Ride
                             </Button>
                           </Link>
                        )}
                        {(booking.status !== 'cancelled' && booking.status !== 'completed') && (
                           <Button variant="destructive" size="sm" onClick={() => cancelBooking(booking.id)} className="w-full font-headline">
                            <X className="mr-2 h-4 w-4"/> Cancel Booking
                           </Button>
                        )}
                    </div>
                  </RouteCard>
                );
              })}
            </div>
          ) : (
             <p className="text-muted-foreground font-body">You haven't booked any rides yet. <Button variant="link" asChild><Link href="/search-routes">Find one now!</Link></Button></p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
