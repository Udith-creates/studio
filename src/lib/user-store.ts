
import type { User } from '@/types';

// In-memory store for users
let users: User[] = [
  { 
    id: "user1", 
    email: "arjun@example.com", 
    password: "password123", 
    name: "Arjun Mehra", 
    avatarUrl: "https://placehold.co/100x100/1DA1F2/FFFFFF.png?text=AM", 
    role: 'buddy' 
  },
  { 
    id: "user2", 
    email: "priya@example.com", 
    password: "password456", 
    name: "Priya Sharma", 
    avatarUrl: "https://placehold.co/100x100/7CFC00/000000.png?text=PS", 
    role: 'rider' 
  },
  { 
    id: "user3", 
    email: "vikram@example.com", 
    password: "password789", 
    name: "Vikram Singh", 
    avatarUrl: "https://placehold.co/100x100/FFD700/000000.png?text=VS", 
    role: 'rider' 
  },
   { 
    id: "userPoster001", // Used in route-store.ts
    email: "poster@example.com", 
    password: "securepassword", 
    name: "Route Poster", 
    avatarUrl: "https://placehold.co/100x100.png?text=RP", 
    role: 'rider' 
  },
  { 
    id: "user123", // Used as currentUserId in my-rides and profile page before this change
    email: "test@example.com", // Keeping the original test user
    password: "password", 
    name: "Alex Rider (Test)", 
    avatarUrl: "https://placehold.co/100x100.png", 
    role: 'rider' 
  },
];

export const authenticateUser = (email: string, password: string): User | null => {
  const user = users.find(u => u.email === email && u.password === password);
  return user ? { ...user } : null; // Return a copy
};

export const getUserById = (userId: string): User | null => {
  const user = users.find(u => u.id === userId);
  return user ? { ...user } : null; // Return a copy
};

export const updateUser = (userId: string, data: Partial<Pick<User, 'name' | 'avatarUrl'>>): User | null => {
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...data };
    return { ...users[userIndex] }; // Return a copy of the updated user
  }
  return null;
};

// Function to add a new user (useful for future signup feature)
export type NewUser = Omit<User, 'id'>;
export const addUser = (userData: NewUser): User => {
  const newUser: User = {
    ...userData,
    id: `user${users.length + 1 + Date.now()}`, // Simple unique ID generation
  };
  users.push(newUser);
  return { ...newUser };
};

// Get all users (e.g., for admin or debugging)
export const getAllUsers = (): User[] => {
  return users.map(u => ({ ...u })); // Return copies
};
