
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, UserCircle, Car } from 'lucide-react';

interface RideTrackingDetails {
  id: string;
  startPoint: string;
  destination: string;
  otherPartyName: string; // Name of the other person (rider if you're buddy, buddy if you're rider)
  trackedElementName: string; // e.g., "Rider's Vehicle" or "Buddy's Location"
}

// Mock function to get ride details based on new locations
const getMockRideDetails = (rideId: string): RideTrackingDetails => {
  // Scenario 1: Current user BOOKED this ride (is a BUDDY)
  // rideId would be like "booked1" (maps to routeX_kr_google)
  if (rideId === "booked1") {
    return {
      id: rideId,
      startPoint: "KR Puram", 
      destination: "Google Office",
      otherPartyName: "Priya (Rider)", // The person offering the ride
      trackedElementName: "Rider's Vehicle",
    };
  }
  // Scenario 2: Current user OFFERED this ride (is a RIDER)
  // rideId would be like "offered1" (KR Puram to Google Office)
  if (rideId === "offered1") { 
    return {
      id: rideId,
      startPoint: "KR Puram", 
      destination: "Google Office",
      otherPartyName: "Sunita (Buddy)", // The buddy who joined (from mockRequests in MyRidesPage)
      trackedElementName: "Buddy's Location",
    };
  }
   // Scenario 3: Current user OFFERED this ride (is a RIDER)
  // rideId would be like "offered2" (My Home (Tin Factory) to Gopalan Mall)
  if (rideId === "offered2") { 
    return {
      id: rideId,
      startPoint: "My Home (Tin Factory)", 
      destination: "Gopalan Mall",
      // Assuming a buddy "Rohan" was confirmed for this ride for tracking demo
      otherPartyName: "Rohan (Buddy)", 
      trackedElementName: "Buddy's Location",
    };
  }
  // Default/fallback
  return {
    id: rideId,
    startPoint: "Unknown Start",
    destination: "Unknown Destination",
    otherPartyName: "Other Party",
    trackedElementName: "Other Party's Location",
  };
};

export default function TrackRidePage({ params }: { params: { rideId: string } }) {
  const rideId = params.rideId;
  const [rideDetails, setRideDetails] = useState<RideTrackingDetails | null>(null);

  // Initial positions as percentages of map dimensions
  const [userPosition, setUserPosition] = useState({ x: 10, y: 80 }); 
  const [otherPartyPosition, setOtherPartyPosition] = useState({ x: 15, y: 75 }); 

  useEffect(() => {
    setRideDetails(getMockRideDetails(rideId));
  }, [rideId]);

  useEffect(() => {
    if (!rideDetails) return;

    // Simulate movement towards a common destination point (e.g., top-right)
    const destinationPoint = { x: 85, y: 15 }; // Target percentages

    const moveTowards = (current: {x: number, y: number}, target: {x: number, y: number}, speedFactor: number) => {
      const dx = target.x - current.x;
      const dy = target.y - current.y;
      const distance = Math.sqrt(dx*dx + dy*dy);
      
      if (distance < 1) return target; // Close enough

      return {
        x: current.x + (dx / distance) * speedFactor * (Math.random() * 0.5 + 0.5), 
        y: current.y + (dy / distance) * speedFactor * (Math.random() * 0.5 + 0.5),
      };
    };

    const userInterval = setInterval(() => {
      setUserPosition(prev => moveTowards(prev, destinationPoint, 1.5));
    }, 1500); 

    const vehicleInterval = setInterval(() => {
      setOtherPartyPosition(prev => moveTowards(prev, destinationPoint, 1.8)); 
    }, 1500);

    return () => {
      clearInterval(userInterval);
      clearInterval(vehicleInterval);
    };
  }, [rideDetails]); 

  if (!rideDetails) {
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
            Simulated view of your location and {rideDetails.trackedElementName}.
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
            {/* Your Marker */}
            <div
              className="absolute transition-all duration-1000 ease-in-out"
              style={{
                left: `${userPosition.x}%`,
                top: `${userPosition.y}%`,
                transform: 'translate(-50%, -50%)', 
              }}
              title={`Your approximate location`}
            >
              <div className="flex flex-col items-center p-1 bg-background/80 backdrop-blur-sm rounded-md shadow-lg">
                <UserCircle className="h-7 w-7 text-blue-600" />
                <span className="text-xs font-medium text-blue-700">You</span>
              </div>
            </div>

            {/* Other Party's Vehicle Marker */}
            <div
              className="absolute transition-all duration-1000 ease-in-out"
              style={{
                left: `${otherPartyPosition.x}%`,
                top: `${otherPartyPosition.y}%`,
                transform: 'translate(-50%, -50%)', 
              }}
              title={`${rideDetails.otherPartyName}'s approximate location`}
            >
               <div className="flex flex-col items-center p-1 bg-background/80 backdrop-blur-sm rounded-md shadow-lg">
                <Car className="h-7 w-7 text-green-600" />
                <span className="text-xs font-medium text-green-700">{rideDetails.otherPartyName}</span>
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
