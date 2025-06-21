
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Route, Booking, User } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { BikeIcon } from "@/components/icons/bike-icon";
import { UserIcon } from "@/components/icons/user-icon";
import { AlertTriangle, Check, ListChecks, ThumbsDown, ThumbsUp, X, MapPin } from "lucide-react";
import RouteCard from "@/components/features/routes/route-card";
import Link from "next/link";
import { getUserById } from "@/lib/user-store"; // To get user details

// Simulate current user - in a real app, this would come from an auth context
// Let's assume user 'user1' (Arjun Mehra) is logged in for this page's context.
const currentUserId = "user1"; 

export default function MyRidesPage() {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [offeredRides, setOfferedRides] = useState<Route[]>([]);
  const [bookedRides, setBookedRides] = useState<Booking[]>([]);
  const [rideRequests, setRideRequests] = useState<Booking[]>([]);

  // Mock data for routes potentially related to bookings - in a real app, this would be fetched or from route-store
  const [mockRoutesForBookings, setMockRoutesForBookings] = useState<Record<string, Route>>({});


  useEffect(() => {
    const user = getUserById(currentUserId);
    setCurrentUser(user);

    if (user) {
      // Simulate fetching data relevant to the current user
      const initialOfferedRides: Route[] = [
        // Arjun offers one ride
        { id: "offered1_arjun", startPoint: "KR Puram", destination: "Google Office", timing: "08:00", days: ["mon", "wed", "fri"], rider: user, availableSeats: 2, cost: 150.00, status: 'available' },
        // Priya offers one ride
        { id: "offered_priya_gopalan", startPoint: "My Home (Tin Factory)", destination: "Gopalan Mall", timing: "18:00", days: ["tue", "thu"], rider: getUserById("user2")!, availableSeats: 1, cost: 100.00, status: 'confirmed' },
      ];
      setOfferedRides(initialOfferedRides.filter(r => r.rider.id === user.id)); // Show only Arjun's offered rides if Arjun is logged in

      const initialBookedRides: Booking[] = [
        // Arjun booked a ride with Priya
        { id: "booked1_arjun_with_priya", routeId: "routeX_kr_google_priya", buddy: user, rider: getUserById("user2")!, status: 'confirmed', requestedAt: new Date(), updatedAt: new Date() },
        // Arjun booked a ride with Vikram (pending)
        { id: "booked2_arjun_with_vikram", routeId: "routeY_tin_google_vikram", buddy: user, rider: getUserById("user3")!, status: 'pending', requestedAt: new Date() },
      ];
      setBookedRides(initialBookedRides.filter(b => b.buddy.id === user.id)); // Show only Arjun's booked rides if Arjun is logged in

      const routesForBookingsData: Record<string, Route> = {
        routeX_kr_google_priya: { id: "routeX_kr_google_priya", startPoint: "KR Puram", destination: "Google Office", timing: "08:00", days: ["mon", "wed"], rider: getUserById("user2")!, availableSeats: 0, cost: 150.00, status: 'confirmed'},
        routeY_tin_google_vikram: { id: "routeY_tin_google_vikram", startPoint: "Tin Factory", destination: "Google Office", timing: "14:00", days: ["sat"], rider: getUserById("user3")!, availableSeats: 1, cost: 90.00, status: 'available' },
      };
      setMockRoutesForBookings(routesForBookingsData);
      
      // Simulate incoming requests for rides Arjun is offering
      const initialRideRequests: Booking[] = [
        { id: "req1_for_arjun", routeId: "offered1_arjun", buddy: getUserById("user2")!, rider: user, status: 'pending', requestedAt: new Date() },
      ];
      // Filter requests for rides offered by the current user
      setRideRequests(initialRideRequests.filter(req => req.rider.id === user.id));
    }
  }, [currentUserId]);


  const handleRequestAction = (requestId: string, action: 'accept' | 'decline') => {
    const request = rideRequests.find(req => req.id === requestId);
    if (!request || !currentUser) return;

    setRideRequests(prev => prev.filter(req => req.id !== requestId));
    
    if (action === 'accept') {
        setOfferedRides(prevOffered => prevOffered.map(or => {
            if (or.id === request.routeId) {
                const newSeats = Math.max(0, or.availableSeats - 1);
                let newStatus: Route['status'] = 'confirmed';
                if (newSeats <= 0) {
                    newStatus = 'full';
                }
                // Here, you'd also update the booking status for the buddy
                // and potentially add them to a list of confirmed buddies for this ride.
                return {...or, availableSeats: newSeats, status: newStatus };
            }
            return or;
        }));
         toast({
          title: `Request Accepted!`,
          description: `${request.buddy.name} will join your ride.`,
        });
    } else {
        toast({
          title: `Request Declined`,
          description: `The buddy ${request.buddy.name} has been notified.`,
        });
    }
  };

  const cancelBooking = (bookingId: string) => {
    setBookedRides(prev => prev.map(b => b.id === bookingId ? {...b, status: 'cancelled'} : b));
    toast({ title: "Booking Cancelled", description: "Your booking has been cancelled." });
  }

  const cancelOfferedRide = (routeId: string) => {
    setOfferedRides(prev => prev.map(r => r.id === routeId ? {...r, status: 'cancelled'} : r));
    // Also cancel any pending requests for this ride if needed
    setRideRequests(prev => prev.filter(req => req.routeId !== routeId));
    toast({ title: "Ride Cancelled", description: "Your offered ride has been cancelled." });
  }

  if (!currentUser) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
        <p className="text-xl font-body text-muted-foreground">Loading your rides...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-6">
        <ListChecks className="h-10 w-10 text-primary" />
        <h1 className="text-4xl font-headline font-semibold">My Rides ({currentUser.name})</h1>
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
                <p className="text-muted-foreground font-body">No pending requests for your offered rides.</p>
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
                  onViewDetails={() => toast({title: `Viewing details for your offered ride to ${route.destination}.`})} 
                >
                  <div className="w-full space-y-2 mt-2">
                    {(route.status === 'confirmed' || route.status === 'full') && route.status !== 'completed' && route.status !== 'cancelled' && (
                        <Button asChild variant="outline" size="sm" className="w-full font-headline">
                            <Link href={`/my-rides/${route.id}/track`}>
                                <MapPin className="mr-2 h-4 w-4"/> Track Ride
                            </Link>
                        </Button>
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
                if (!routeDetails) {
                    console.warn(`Route details not found for booking ID ${booking.routeId}`);
                    return (
                        <Card key={booking.id} className="p-4 border-destructive">
                            <CardTitle className="text-destructive">Error: Route details missing</CardTitle>
                            <CardDescription>Could not load details for booking ID {booking.id}.</CardDescription>
                        </Card>
                    );
                }
                
                const displayRoute: Route = {
                    ...routeDetails,
                    // Ensure the status on the card reflects the booking status for the current user
                    status: booking.status === 'pending' ? 'requested' : 
                            booking.status === 'accepted' ? 'confirmed' : // Assuming 'accepted' means 'confirmed' for display
                            booking.status
                };

                return (
                  <RouteCard 
                    key={booking.id} 
                    route={displayRoute} 
                    onViewDetails={() => toast({title: `Viewing details for ride with ${booking.rider.name} to ${displayRoute.destination}.`})}
                  >
                    <div className="w-full space-y-2 mt-2">
                        {booking.status === 'confirmed' && ( // Only show track if booking is confirmed
                           <Button asChild variant="outline" size="sm" className="w-full font-headline">
                               <Link href={`/my-rides/${booking.id}/track`}>
                                   <MapPin className="mr-2 h-4 w-4"/> Track Ride
                               </Link>
                           </Button>
                        )}
                        {(booking.status !== 'cancelled' && booking.status !== 'completed') && (
                           <Button variant="destructive" size="sm" onClick={() => cancelBooking(booking.id)} className="w-full font-headline">
                            <X className="mr-2 h-4 w-4"/> Cancel Booking
                           </Button>
                        )}
                         {booking.status === 'cancelled' && (
                            <p className="text-sm text-center text-destructive-foreground bg-destructive p-2 rounded-md font-body">Booking Cancelled</p>
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

// Added Loader2 for loading state
import { Loader2 } from "lucide-react";
