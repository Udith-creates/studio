
"use client";

import type { Route } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, DollarSign, MapPin, Users, CheckCircle, AlertCircle, Hourglass, Heart } from "lucide-react";
import { BikeIcon } from "@/components/icons/bike-icon";
import { UserIcon } from "@/components/icons/user-icon";

interface RouteCardProps {
  route: Route;
  onBook?: (routeId: string) => void;
  onViewDetails?: (routeId: string) => void;
  isFavorited?: boolean;
  onToggleFavorite?: (routeId: string) => void;
  children?: React.ReactNode;
}

export default function RouteCard({ route, onBook, onViewDetails, isFavorited, onToggleFavorite, children }: RouteCardProps) {
  const getStatusBadge = (status?: Route['status']) => {
    switch (status) {
      case 'available':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600"><CheckCircle className="mr-1 h-3 w-3" />Available</Badge>;
      case 'requested':
        return <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600"><Hourglass className="mr-1 h-3 w-3" />Requested</Badge>;
      case 'confirmed':
        return <Badge variant="default" className="bg-blue-500 hover:bg-blue-600"><CheckCircle className="mr-1 h-3 w-3" />Confirmed</Badge>;
      case 'full':
        return <Badge variant="destructive" className="bg-red-500 hover:bg-red-600"><AlertCircle className="mr-1 h-3 w-3" />Full</Badge>;
      case 'cancelled':
        return <Badge variant="destructive" className="bg-gray-500 hover:bg-gray-600"><AlertCircle className="mr-1 h-3 w-3" />Cancelled</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-purple-500 hover:bg-purple-600"><CheckCircle className="mr-1 h-3 w-3" />Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden flex flex-col h-full">
      <CardHeader className="bg-primary/5 p-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-headline text-xl mb-1 text-primary flex items-center gap-2">
              <MapPin className="h-5 w-5" /> {route.startPoint} to {route.destination}
            </CardTitle>
            <CardDescription className="font-body text-sm text-muted-foreground flex items-center gap-1">
              <BikeIcon className="h-4 w-4" /> Offered by {route.rider.name}
            </CardDescription>
          </div>
          {onToggleFavorite && (
             <Button variant="ghost" size="icon" onClick={() => onToggleFavorite(route.id)} aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}>
              <Heart className={`h-6 w-6 ${isFavorited ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-400'}`} />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3 flex-grow">
        <div className="flex items-center gap-2 font-body text-sm">
          <Clock className="h-4 w-4 text-primary" />
          <span>Departs at: <strong>{route.timing}</strong></span>
        </div>
        <div className="flex items-center gap-2 font-body text-sm">
          <CalendarDays className="h-4 w-4 text-primary" />
          <span>Days: <strong>{route.days.join(", ")}</strong></span>
        </div>
        <div className="flex items-center gap-2 font-body text-sm">
          <Users className="h-4 w-4 text-primary" />
          <span>Available Seats: <strong>{route.availableSeats}</strong></span>
        </div>
        {route.cost && (
          <div className="flex items-center gap-2 font-body text-sm">
            <DollarSign className="h-4 w-4 text-accent" />
            <span>Estimated Cost: <strong className="text-accent">₹{route.cost.toFixed(2)}</strong></span>
          </div>
        )}
        {route.status && (
          <div className="flex items-center gap-2 font-body text-sm">
            {getStatusBadge(route.status)}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 bg-muted/30 border-t flex flex-col sm:flex-row gap-2 justify-end items-center">
        <div className="flex-grow space-y-2 sm:space-y-0 sm:flex sm:gap-2">
            {onViewDetails && (
              <Button variant="outline" onClick={() => onViewDetails(route.id)} className="w-full sm:w-auto font-headline">
                View Details
              </Button>
            )}
            {onBook && route.status === 'available' && (
              <Button onClick={() => onBook(route.id)} className="w-full sm:w-auto font-headline bg-accent text-accent-foreground hover:bg-accent/90">
                Request Ride
              </Button>
            )}
        </div>
        {children && <div className="w-full sm:w-auto mt-2 sm:mt-0">{children}</div>}
      </CardFooter>
    </Card>
  );
}
