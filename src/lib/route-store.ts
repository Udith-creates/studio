
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
  { id: "1", startPoint: "KR Puram", destination: "Google Office", timing: "08:00", days: ["mon", "wed", "fri"], rider: getUserById("user2") || mockRiderUser, availableSeats: 2, cost: 150.00, status: 'available' },
  { id: "2", startPoint: "Tin Factory", destination: "Google Office", timing: "08:30", days: ["mon", "tue", "wed", "thu", "fri"], rider: getUserById("user3") || mockRiderUser, availableSeats: 0, cost: 120.00, status: 'full' },
  { id: "3", startPoint: "Gopalan Mall", destination: "Google Office", timing: "09:00", days: ["sat", "sun"], rider: getUserById("user2") || mockRiderUser, availableSeats: 3, cost: 100.00, status: 'available' },
  { id: "4", startPoint: "KR Puram", destination: "Tin Factory", timing: "07:45", days: ["mon", "wed"], rider: getUserById("user3") || mockRiderUser, availableSeats: 1, cost: 80.00, status: 'confirmed' },
  { id: "fav1_from_store", startPoint: "KR Puram", destination: "Google Office", timing: "09:30", days: ["tue", "thu"], rider: getUserById("user2") || mockRiderUser, availableSeats: 1, cost: 140.00, status: 'available' },
  { id: "fav2_from_store", startPoint: "Tin Factory", destination: "Gopalan Mall", timing: "07:00", days: ["mon", "wed", "fri"], rider: getUserById("user3") || mockRiderUser, availableSeats: 3, cost: 90.00, status: 'available' },
];

const routes: Route[] = [...initialRoutes];

export const getRoutes = (): Route[] => {
  return routes.map(route => ({ ...route }));
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
    const route = { ...routes[routeIndex] }; // Work with a copy
    
    if (newStatus === 'requested') {
      if (route.availableSeats > 0 && route.status === 'available') {
        route.availableSeats -= 1;
        if (route.availableSeats === 0) {
          route.status = 'full'; // Auto-transition to 'full' if no seats left
        } else {
          route.status = 'requested';
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
