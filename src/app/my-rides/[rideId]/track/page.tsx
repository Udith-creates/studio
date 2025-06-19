
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, UserCircle, Car } from 'lucide-react';

// Mock function to get ride details - in a real app, this would fetch data based on rideId
const getMockRideDetails = (rideId: string) => {
  // Simulate finding ride details. You might have a list of bookings or fetch from an API.
  // For this example, we'll return generic data based on whether it's 'booked1' or something else.
  if (rideId === "booked1") {
    return {
      id: rideId,
      startPoint: "Downtown",
      destination: "Tech Park",
      riderName: "Alice", // The person offering the ride
      buddyName: "You",   // The person who booked (current user)
    };
  }
  return {
    id: rideId,
    startPoint: "Unknown Location",
    destination: "Unknown Destination",
    riderName: "Other Rider",
    buddyName: "You",
  };
};

export default function TrackRidePage({ params }: { params: { rideId: string } }) {
  const rideId = params.rideId;
  const [rideDetails, setRideDetails] = useState(getMockRideDetails(rideId));

  // Initial positions as percentages of map dimensions
  const [userPosition, setUserPosition] = useState({ x: 10, y: 80 }); 
  const [vehiclePosition, setVehiclePosition] = useState({ x: 15, y: 75 }); 

  useEffect(() => {
    // Simulate movement towards a common destination point (e.g., top-right)
    const destinationPoint = { x: 85, y: 15 }; // Target percentages

    const moveTowards = (current: {x: number, y: number}, target: {x: number, y: number}, speedFactor: number) => {
      const dx = target.x - current.x;
      const dy = target.y - current.y;
      const distance = Math.sqrt(dx*dx + dy*dy);
      
      if (distance < 1) return target; // Close enough

      return {
        x: current.x + (dx / distance) * speedFactor * (Math.random() * 0.5 + 0.5), // Add some randomness
        y: current.y + (dy / distance) * speedFactor * (Math.random() * 0.5 + 0.5),
      };
    };

    const userInterval = setInterval(() => {
      setUserPosition(prev => moveTowards(prev, destinationPoint, 1.5));
    }, 1500); // Update every 1.5 seconds

    const vehicleInterval = setInterval(() => {
      setVehiclePosition(prev => moveTowards(prev, destinationPoint, 1.8)); // Vehicle moves slightly differently
    }, 1500);

    return () => {
      clearInterval(userInterval);
      clearInterval(vehicleInterval);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  if (!rideDetails) {
    // This state should ideally not be hit with mock data, but good for async cases
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p className="text-xl font-body">Loading ride details...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="outline" asChild className="mb-6">
        <Link href="/my-rides">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Rides
        </Link>
      </Button>

      <Card className="shadow-xl rounded-lg">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Tracking Ride: {rideDetails.startPoint} to {rideDetails.destination}</CardTitle>
          <CardDescription className="font-body">
            You are sharing a ride with {rideDetails.riderName}. (This is a SIMULATED view)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full aspect-[16/9] bg-muted rounded-md overflow-hidden border shadow-inner">
            <Image
              src="https://placehold.co/1280x720.png" 
              alt="Simulated map view of a route"
              layout="fill"
              objectFit="cover"
              priority
              data-ai-hint="street map route"
            />
            {/* User's Marker (Buddy) */}
            <div
              className="absolute transition-all duration-1000 ease-in-out"
              style={{
                left: `${userPosition.x}%`,
                top: `${userPosition.y}%`,
                transform: 'translate(-50%, -50%)', // Center the icon
              }}
              title={`Your approximate location`}
            >
              <div className="flex flex-col items-center p-1 bg-background/70 rounded-md shadow-lg">
                <UserCircle className="h-7 w-7 text-blue-600" />
                <span className="text-xs font-medium text-blue-700">You</span>
              </div>
            </div>

            {/* Other Vehicle's Marker (Rider) */}
            <div
              className="absolute transition-all duration-1000 ease-in-out"
              style={{
                left: `${vehiclePosition.x}%`,
                top: `${vehiclePosition.y}%`,
                transform: 'translate(-50%, -50%)', // Center the icon
              }}
              title={`${rideDetails.riderName}'s approximate location`}
            >
               <div className="flex flex-col items-center p-1 bg-background/70 rounded-md shadow-lg">
                <Car className="h-7 w-7 text-green-600" />
                <span className="text-xs font-medium text-green-700">{rideDetails.riderName}</span>
              </div>
            </div>
          </div>
          <p className="font-body mt-4 text-sm text-center text-muted-foreground">
            Map and locations are simulated for demonstration purposes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
