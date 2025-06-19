
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
  { id: "1", startPoint: "Downtown", destination: "Tech Park", timing: "08:00", days: ["Mon", "Wed", "Fri"], rider: { id: "r1", name: "Alice", role: 'rider' }, availableSeats: 2, cost: 500.00, status: 'available' },
  { id: "2", startPoint: "Suburbia", destination: "Tech Park", timing: "08:30", days: ["Mon", "Tue", "Wed", "Thu", "Fri"], rider: { id: "r2", name: "Bob", role: 'rider' }, availableSeats: 0, cost: 750.00, status: 'full' },
  { id: "3", startPoint: "Old Town", destination: "City Center", timing: "09:00", days: ["Sat", "Sun"], rider: { id: "r3", name: "Charlie", role: 'rider' }, availableSeats: 3, cost: 300.00, status: 'available' },
  { id: "4", startPoint: "Westside", destination: "Tech Park", timing: "07:45", days: ["Mon", "Wed"], rider: { id: "r4", name: "Diana", role: 'rider' }, availableSeats: 1, cost: 620.00, status: 'confirmed' },
];

const routes: Route[] = [...initialRoutes]; // Initialize with some mock data

export const getRoutes = (): Route[] => {
  return [...routes]; // Return a copy to prevent direct modification
};

export const addRoute = (newRouteData: Omit<Route, 'id' | 'rider' | 'status' | 'cost'> & { cost?: number }): Route => {
  const route: Route = {
    ...newRouteData,
    id: `route-${routeIdCounter++}`,
    rider: mockRiderUser,
    status: 'available',
    cost: newRouteData.cost // Assign cost if provided, otherwise it's undefined
  };
  routes.push(route);
  return route;
};

export const getRouteById = (id: string): Route | undefined => {
  return routes.find(route => route.id === id);
};

export const updateRouteStatus = (id: string, newStatus: Route['status'], newSeats?: number): Route | undefined => {
  const routeIndex = routes.findIndex(route => route.id === id);
  if (routeIndex !== -1) {
    routes[routeIndex].status = newStatus;
    if (newSeats !== undefined) {
      routes[routeIndex].availableSeats = newSeats;
    }
    // If seats become 0 and status is 'available' or 'confirmed', consider changing to 'full'
    if (routes[routeIndex].availableSeats === 0 && (routes[routeIndex].status === 'available' || routes[routeIndex].status === 'confirmed')) {
        routes[routeIndex].status = 'full';
    }
    return {...routes[routeIndex]}; // Return a copy
  }
  return undefined;
};
