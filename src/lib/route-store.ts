
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
  { id: "1", startPoint: "Downtown", destination: "Tech Park", timing: "08:00", days: ["mon", "wed", "fri"], rider: { id: "r1", name: "Alice", role: 'rider' }, availableSeats: 2, cost: 500.00, status: 'available' },
  { id: "2", startPoint: "Suburbia", destination: "Tech Park", timing: "08:30", days: ["mon", "tue", "wed", "thu", "fri"], rider: { id: "r2", name: "Bob", role: 'rider' }, availableSeats: 0, cost: 750.00, status: 'full' },
  { id: "3", startPoint: "Old Town", destination: "City Center", timing: "09:00", days: ["sat", "sun"], rider: { id: "r3", name: "Charlie", role: 'rider' }, availableSeats: 3, cost: 300.00, status: 'available' },
  { id: "4", startPoint: "Westside", destination: "Tech Park", timing: "07:45", days: ["mon", "wed"], rider: { id: "r4", name: "Diana", role: 'rider' }, availableSeats: 1, cost: 620.00, status: 'confirmed' },
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
    route.status = newStatus;

    if (newStatus === 'requested') {
      if (route.availableSeats > 0) {
        route.availableSeats -= 1;
        if (route.availableSeats === 0 && route.status !== 'cancelled') {
          route.status = 'full'; // Auto-set to full if no more seats after request
        }
      } else {
        // If somehow requested with 0 seats, ensure status reflects it's full.
        // This state should ideally be prevented by UI checks.
        route.status = 'full';
      }
    }
    // Note: Other status transitions like 'confirmed' might also affect seats or status,
    // but that logic would typically be handled by the ride offerer (e.g., in MyRidesPage).
    // For 'cancelled' by a buddy, seats might be incremented back (not implemented here).
    
    return {...route}; // Return a copy of the updated route
  }
  return undefined;
};
