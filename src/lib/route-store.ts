
import type { Route, User } from '@/types';
import { getUserById } from './user-store'; // Import a way to get users

// Use a user from the user-store as the default poster
const defaultPosterUser = getUserById("userPoster001");

const mockRiderUser: User = defaultPosterUser || {
  id: "userPoster001",
  name: "Route Poster (Default)",
  email: "poster@example.com", 
  role: 'rider',
  avatarUrl: "https://placehold.co/100x100.png?text=RP",
};

let routeIdCounter = 100;

const initialRoutes: Route[] = [
  // KR Puram -> Google Office (Available)
  { id: "1", startPoint: "KR Puram", destination: "Google Office", timing: "08:00", days: ["mon", "wed", "fri"], rider: getUserById("user2") || mockRiderUser, availableSeats: 2, cost: 150.00, status: 'available' },
  // Tin Factory -> Google Office (Full)
  { id: "2", startPoint: "Tin Factory", destination: "Google Office", timing: "08:30", days: ["mon", "tue", "wed", "thu", "fri"], rider: getUserById("user3") || mockRiderUser, availableSeats: 0, cost: 120.00, status: 'full' },
  // Gopalan Mall -> Google Office (Available)
  { id: "3", startPoint: "Gopalan Mall", destination: "Google Office", timing: "09:00", days: ["sat", "sun"], rider: getUserById("user2") || mockRiderUser, availableSeats: 3, cost: 100.00, status: 'available' },
  // KR Puram -> Tin Factory (Confirmed)
  { id: "4", startPoint: "KR Puram", destination: "Tin Factory", timing: "07:45", days: ["mon", "wed"], rider: getUserById("user3") || mockRiderUser, availableSeats: 1, cost: 80.00, status: 'confirmed' },
  // Favorite route 1 (Available) - KR Puram to Google Office (diff time)
  { id: "fav1_from_store", startPoint: "KR Puram", destination: "Google Office", timing: "09:30", days: ["tue", "thu"], rider: getUserById("user2") || mockRiderUser, availableSeats: 1, cost: 140.00, status: 'available' },
  // Favorite route 2 (Available) - Tin Factory to Gopalan Mall
  { id: "fav2_from_store", startPoint: "Tin Factory", destination: "Gopalan Mall", timing: "07:00", days: ["mon", "wed", "fri"], rider: getUserById("user3") || mockRiderUser, availableSeats: 3, cost: 90.00, status: 'available' },
];

const routes: Route[] = [...initialRoutes];

export const getRoutes = (): Route[] => {
  return routes.map(route => ({ ...route })); // Returns copies
};

export const addRoute = (newRouteData: Omit<Route, 'id' | 'rider' | 'status' | 'cost'> & { cost?: number }): Route => {
  const route: Route = {
    ...newRouteData,
    id: `route-${routeIdCounter++}`,
    rider: mockRiderUser, 
    status: 'available',
    cost: newRouteData.cost 
  };
  routes.push(route);
  return { ...route }; 
};

export const getRouteById = (id: string): Route | undefined => {
  const route = routes.find(route => route.id === id);
  return route ? { ...route } : undefined; 
};

export const updateRouteStatus = (id: string, newStatus: Route['status']): Route | undefined => {
  const routeIndex = routes.findIndex(route => route.id === id);
  if (routeIndex !== -1) {
    const route = { ...routes[routeIndex] }; 

    if (newStatus === 'requested') {
      if (route.availableSeats > 0 && route.status === 'available') {
        route.availableSeats -= 1;
        if (route.availableSeats === 0) {
          route.status = 'full'; 
        } else {
          // Keep status as 'available' or change to 'requested' based on your logic
          // For now, let's assume it becomes 'requested' if one person books, but is still available.
          // Or, more simply, if we want the card to reflect the booking for the current user,
          // the RouteCard component itself will show "Requested".
          // The underlying route status might remain 'available' if seats > 0.
          // For simplicity in the store, let's make it 'requested'.
          // A better approach might be to not change the route status here to 'requested',
          // but handle it via a Booking object. But for current setup:
           route.status = 'requested'; // Or handle this transition on the UI side.
        }
      } else {
        console.warn(`Cannot request ride ${id}: status is ${route.status} or seats are ${route.availableSeats}`);
        return undefined; 
      }
    } else {
      route.status = newStatus;
    }
    
    routes[routeIndex] = route; 
    return { ...route }; 
  }
  return undefined;
};

export const getAllKnownLocations = (): string[] => {
  const starts = Array.from(new Set(routes.map(r => r.startPoint).filter(Boolean)));
  const dests = Array.from(new Set(routes.map(r => r.destination).filter(Boolean)));
  const allLocations = Array.from(new Set([...starts, ...dests]));
  return allLocations.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
};
