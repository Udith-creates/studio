"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Route, Booking } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { BikeIcon } from "@/components/icons/bike-icon";
import { UserIcon } from "@/components/icons/user-icon";
import { AlertTriangle, Check, ListChecks, ThumbsDown, ThumbsUp, X } from "lucide-react";
import RouteCard from "@/components/features/routes/route-card"; // Re-use for consistency

// Mock current user
const currentUserId = "user123";
const currentUser = { id: currentUserId, name: "Me", role: 'buddy' as 'rider' | 'buddy' }; // Role can change

// Mock data
const mockOfferedRides: Route[] = [
  { id: "offered1", startPoint: "My Home", destination: "Office", timing: "08:00", days: ["Mon", "Wed", "Fri"], rider: currentUser, availableSeats: 2, cost: 4.00, status: 'available' },
  { id: "offered2", startPoint: "My Home", destination: "Gym", timing: "18:00", days: ["Tue", "Thu"], rider: currentUser, availableSeats: 1, cost: 2.50, status: 'confirmed' },
];

const mockBookedRides: Booking[] = [
  { id: "booked1", routeId: "routeX", buddy: currentUser, rider: { id: "r1", name: "Alice", role: 'rider' }, status: 'confirmed', requestedAt: new Date(), updatedAt: new Date() },
  { id: "booked2", routeId: "routeY", buddy: currentUser, rider: { id: "r2", name: "Bob", role: 'rider' }, status: 'pending', requestedAt: new Date() },
];

// To make Booking displayable in RouteCard, we need to map it or create a specific BookingCard
// For simplicity, let's assume we can fetch full route details for booked rides.
const mockRoutesForBookings: Record<string, Route> = {
  routeX: { id: "routeX", startPoint: "Downtown", destination: "Tech Park", timing: "08:00", days: ["Mon", "Wed"], rider: { id: "r1", name: "Alice", role: 'rider' }, availableSeats: 0, cost: 5.00, status: 'confirmed'},
  routeY: { id: "routeY", startPoint: "Suburbia", destination: "Airport", timing: "14:00", days: ["Sat"], rider: { id: "r2", name: "Bob", role: 'rider' }, availableSeats: 1, cost: 15.00, status: 'available' /* but pending for me */ },
};


export default function MyRidesPage() {
  const { toast } = useToast();
  const [offeredRides, setOfferedRides] = useState<Route[]>(mockOfferedRides);
  const [bookedRides, setBookedRides] = useState<Booking[]>(mockBookedRides);

  // Mock incoming requests for rides I'm offering
  const [rideRequests, setRideRequests] = useState<Booking[]>([
    { id: "req1", routeId: "offered1", buddy: { id: "buddy1", name: "Charlie", role: 'buddy'}, rider: currentUser, status: 'pending', requestedAt: new Date() },
  ]);

  const handleRequestAction = (requestId: string, action: 'accept' | 'decline') => {
    setRideRequests(prev => prev.filter(req => req.id !== requestId));
    // If accepted, update the offered ride status (e.g., reduce available seats, change status if full)
    const request = rideRequests.find(req => req.id === requestId);
    if (request && action === 'accept') {
        setOfferedRides(prevOffered => prevOffered.map(or => {
            if (or.id === request.routeId) {
                const newSeats = or.availableSeats -1;
                return {...or, availableSeats: newSeats, status: newSeats === 0 ? 'full' : 'confirmed' };
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
                  {rideRequests.map(req => (
                    <li key={req.id} className="p-4 border rounded-md flex flex-col sm:flex-row justify-between items-center gap-4 bg-secondary/30">
                      <div>
                        <p className="font-semibold font-body">{req.buddy.name} wants to join your ride to <span className="text-primary">{mockRoutesForBookings[req.routeId]?.destination || offeredRides.find(r => r.id === req.routeId)?.destination}</span>.</p>
                        <p className="text-sm text-muted-foreground font-body">Requested on: {req.requestedAt.toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleRequestAction(req.id, 'accept')} className="bg-green-500 hover:bg-green-600 font-headline"><ThumbsUp className="mr-1 h-4 w-4"/>Accept</Button>
                        <Button variant="destructive" size="sm" onClick={() => handleRequestAction(req.id, 'decline')} className="font-headline"><ThumbsDown className="mr-1 h-4 w-4"/>Decline</Button>
                      </div>
                    </li>
                  ))}
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
                  {route.status !== 'cancelled' && route.status !== 'completed' && (
                    <Button variant="destructive" size="sm" onClick={() => cancelOfferedRide(route.id)} className="w-full mt-2 font-headline">
                      <X className="mr-2 h-4 w-4"/> Cancel Ride
                    </Button>
                  )}
                </RouteCard>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground font-body">You haven't offered any rides yet. <Button variant="link" asChild><a href="/post-route">Post one now!</a></Button></p>
          )}
        </TabsContent>

        <TabsContent value="booked">
          <h2 className="text-2xl font-headline font-semibold mb-4">My Booked Rides</h2>
          {bookedRides.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {bookedRides.map(booking => {
                const routeDetails = mockRoutesForBookings[booking.routeId];
                if (!routeDetails) return null; // Or show placeholder
                
                // Augment routeDetails with booking status for display in RouteCard
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
                    {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                       <Button variant="destructive" size="sm" onClick={() => cancelBooking(booking.id)} className="w-full mt-2 font-headline">
                        <X className="mr-2 h-4 w-4"/> Cancel Booking
                       </Button>
                    )}
                  </RouteCard>
                );
              })}
            </div>
          ) : (
             <p className="text-muted-foreground font-body">You haven't booked any rides yet. <Button variant="link" asChild><a href="/search-routes">Find one now!</a></Button></p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
