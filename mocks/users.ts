import type { User, RecentUser } from '@/types/user';

export const mockUsers: User[] = [
  {
    id: "1",
    email: "john.doe@example.com",
    firstName: "John",
    lastName: "Doe",
    isActive: true,
    role: "USER",
    createdAt: "2023-01-15T00:00:00Z",
  },
  {
    id: "2",
    email: "jane.smith@example.com",
    firstName: "Jane",
    lastName: "Smith",
    isActive: false,
    role: "ADMIN",
    createdAt: "2023-02-20T00:00:00Z",
  },
  {
    id: "3",
    email: "bob.johnson@example.com",
    firstName: "Bob",
    lastName: "Johnson",
    isActive: true,
    role: "USER",
    createdAt: "2023-03-10T00:00:00Z",
  },
  {
    id: "4",
    email: "alice.johnson@example.com",
    firstName: "Alice",
    lastName: "Johnson",
    isActive: true,
    role: "USER",
    createdAt: "2023-10-03T00:00:00Z",
  },
];

export const mockRecentUsers: RecentUser[] = [
  {
    id: "1",
    email: "john.doe@example.com",
    firstName: "John",
    lastName: "Doe",
    createdAt: "2023-10-01T00:00:00Z",
    isActive: true,
  },
  {
    id: "2",
    email: "jane.smith@example.com",
    firstName: "Jane",
    lastName: "Smith",
    createdAt: "2023-10-02T00:00:00Z",
    isActive: false,
  },
  {
    id: "3",
    email: "alice.johnson@example.com",
    firstName: "Alice",
    lastName: "Johnson",
    createdAt: "2023-10-03T00:00:00Z",
    isActive: true,
  },
];