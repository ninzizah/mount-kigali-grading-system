'use server';

import type { User as UserType, UserRole } from './types';
import { connectToDatabase } from './db';
import User from './models/user';

// This mock data is for development purposes.
// When you connect to MongoDB, this array will no longer be needed.
const initialUsers: UserType[] = [
  {
    id: 'admin-user',
    name: 'Admin',
    email: 'Admin',
    role: 'admin',
    createdAt: new Date().toISOString(),
    password: '1212',
  },
];

const findHardcodedAdmin = (email: string, password?: string) => {
  if (email === 'Admin' && password === '1212') {
    return initialUsers[0];
  }
  return undefined;
};

export async function getUsers(): Promise<UserType[]> {
  await connectToDatabase();
  const users = await User.find({ role: { $ne: 'admin' } }).sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(users)); // Serialize data to plain objects
}

export async function findUser(
  email: string,
  role: UserRole,
  password?: string
): Promise<UserType | undefined> {
  // Handle hardcoded admin user separately
  if (role === 'admin') {
    return findHardcodedAdmin(email, password);
  }

  await connectToDatabase();
  // Find the user by email and role first
  const user = await User.findOne({ email, role });

  // If no user is found, or if the password doesn't match, return undefined
  if (!user || user.password !== password) {
    return undefined;
  }
  
  return JSON.parse(JSON.stringify(user)); // Serialize data
}

export async function addUser(
  userData: Pick<UserType, 'name' | 'email' | 'role' | 'password'>
): Promise<UserType> {
  await connectToDatabase();
  // In a real app, you should hash the password before saving
  const newUser = new User({ ...userData, createdAt: new Date() });
  await newUser.save();
  return JSON.parse(JSON.stringify(newUser)); // Serialize data
}

export async function updateUser(
  userId: string,
  userData: Partial<Omit<UserType, 'id' | 'createdAt'>>
): Promise<UserType | undefined> {
  await connectToDatabase();
  const updatedUser = await User.findByIdAndUpdate(userId, userData, { new: true });
  if (!updatedUser) return undefined;
  return JSON.parse(JSON.stringify(updatedUser)); // Serialize data
}

export async function deleteUser(userId: string): Promise<boolean> {
  await connectToDatabase();
  const result = await User.findByIdAndDelete(userId);
  return !!result;
}
