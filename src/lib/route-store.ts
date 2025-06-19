
import type { Route, User } from '@/types';

// Mock current user for simplicity in who is posting routes
const mockRiderUser: User = {
  id: "userPoster001",
  name: "Current User (Poster)",
  role: 'rider',
  avatarUrl: "https://placehold.co/100x100.png?text=CU",
};

let routeIdCounter = 100; // Start from a higher number to avoid collision with initial mocks

const initialRoutes: Route[] = [
  { id: "1", startPoint: "KR Puram", destination: "Google Office", timing: "08:00", days: ["mon", "wed", "fri"], rider: { id: "r1", name: "Priya", role: 'rider' }, availableSeats: 2, cost: 150.00, status: 'available' },
  { id: "2", startPoint: "Tin Factory", destination: "Google Office", timing: "08:30", days: ["mon", "tue", "wed", "thu", "fri"], rider: { id: "r2", name: "Rahul", role: 'rider' }, availableSeats: 0, cost: 120.00, status: 'full' },
  { id: "3", startPoint: "Gopalan Mall", destination: "Google Office", timing: "09:00", days: ["sat", "sun"], rider: { id: "r3", name: "Suresh", role: 'rider' }, availableSeats: 3, cost: 100.00, status: 'available' },
  { id: "4", startPoint: "KR Puram", destination: "Tin Factory", timing: "07:45", days: ["mon", "wed"], rider: { id: "r4", name: "Deepa", role: 'rider' }, availableSeats: 1, cost: 80.00, status: 'confirmed' },
];

const routes: Route[] = [...initialRoutes]; // Initialize with some mock data

export const getRoutes = (): Route[] => {
  return [...routes]; // Return a copy to prevent direct modification
};

export const addRoute = (newRouteData: Omit<Route, 'id' | 'rider' | 'status' | 'cost'> & { cost?: number }): Route => {
  const route: Route = {
    ...newRouteData, // days should be in short lowercase format e.g. ["mon", "tue"]
    id: `route-${routeIdCounter++}`,
    rider: mockRiderUser,
    status: 'available',
    cost: newRouteData.cost 
  };
  routes.push(route);
  return route;
};

export const getRouteById = (id: string): Route | undefined => {
  return routes.find(route => route.id === id);
};

export const updateRouteStatus = (id: string, newStatus: Route['status']): Route | undefined => {
  const routeIndex = routes.findIndex(route => route.id === id);
  if (routeIndex !== -1) {
    const route = routes[routeIndex];
    
    // Store original status before potentially changing it to 'full'
    const requestedStatus = newStatus; 

    if (newStatus === 'requested') {
      if (route.availableSeats > 0) {
        route.availableSeats -= 1;
        if (route.availableSeats === 0 && route.status !== 'cancelled') {
           route.status = 'full'; // Auto-set to full if no more seats after request
        } else {
            route.status = requestedStatus; // Set to 'requested' if seats still available
        }
      } else {
        // If somehow requested with 0 seats, ensure status reflects it's full.
        route.status = 'full';
      }
    } else {
        route.status = newStatus;
    }
    
    return {...route}; // Return a copy of the updated route
  }
  return undefined;
};
