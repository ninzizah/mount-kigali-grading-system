import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string, role: 'student' | 'lecturer') => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  users: User[];
  addUser: (user: Omit<User, 'id' | 'createdAt' | 'lastLogin'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const initialUsers: User[] = [
  { 
    id: '1', 
    email: 'student@rwanda.rw', 
    name: 'John Uwimana', 
    role: 'student',
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date(),
    isActive: true
  },
  { 
    id: '2', 
    email: 'lecturer@rwanda.rw', 
    name: 'Dr. Marie Mukamana', 
    role: 'lecturer',
    createdAt: new Date('2024-01-10'),
    lastLogin: new Date(),
    isActive: true
  },
  { 
    id: '3', 
    email: 'admin@rwanda.rw', 
    name: 'Admin User', 
    role: 'admin',
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date(),
    isActive: true
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simple mock authentication
    const foundUser = users.find(u => u.email === email && u.isActive);
    if (foundUser && password === 'password123') {
      const updatedUser = { ...foundUser, lastLogin: new Date() };
      setUser(updatedUser);
      setUsers(users.map(u => u.id === foundUser.id ? updatedUser : u));
      return true;
    }
    return false;
  };

  const signup = async (email: string, password: string, name: string, role: 'student' | 'lecturer'): Promise<boolean> => {
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      return false;
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role,
      createdAt: new Date(),
      lastLogin: new Date(),
      isActive: true
    };
    
    setUsers([...users, newUser]);
    setUser(newUser);
    return true;
  };

  const addUser = (userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date(),
      lastLogin: undefined,
    };
    setUsers([...users, newUser]);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(users.map(u => u.id === id ? { ...u, ...updates } : u));
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };
  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup, 
      logout, 
      isAuthenticated, 
      users, 
      addUser, 
      updateUser, 
      deleteUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};