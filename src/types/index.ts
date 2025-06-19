export interface Route {
  id: string;
  startPoint: string;
  destination: string;
  timing: string; // e.g., "08:00 AM"
  days: string[]; // e.g., ["Mon", "Wed", "Fri"]
  rider: User;
  cost?: number; // Optional, can be calculated
  availableSeats: number;
  status?: 'available' | 'requested' | 'confirmed' | 'full' | 'completed' | 'cancelled';
}

export interface User {
  id: string;
  name: string;
  avatarUrl?: string; // URL to user's avatar
  role: 'rider' | 'buddy';
}

export interface Booking {
  id: string;
  routeId: string;
  buddy: User;
  rider: User;
  status: 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled';
  requestedAt: Date;
  updatedAt?: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string; // URL to badge icon
  earned: boolean;
  progress?: number; // 0-100 for progress towards earning
  milestone?: string; // e.g., "Complete 10 rides"
}

export interface PaymentRecord {
  id: string;
  rideId: string;
  amount: number;
  date: Date;
  status: 'pending' | 'completed' | 'failed';
  payer: User;
  payee: User;
}

export interface GreenImpactData {
  totalFuelSavedLiters: number;
  totalMoneySaved: number;
  totalDistanceSharedKm: number;
  totalCO2SavedKg: number;
  co2EquivalentTrees: number;
}
