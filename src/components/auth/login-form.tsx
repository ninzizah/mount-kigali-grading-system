'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { findUser, addUser } from '@/lib/data';
import type { UserRole } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const handleLogin = async () => {
    // Hidden admin login
    if (email === 'Admin' && password === '1212') {
      const adminUser = await findUser('Admin', 'admin', '1212');
      if (adminUser) {
        localStorage.setItem('user', JSON.stringify(adminUser));
        router.push('/admin/dashboard');
        return;
      }
    }

    const user = await findUser(email, role, password);

    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      router.push(`/${user.role}/dashboard`);
    } else {
      toast({
        title: 'Login Failed',
        description: 'Invalid credentials or role.',
        variant: 'destructive',
      });
    }
  };

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      toast({
        title: 'Sign Up Failed',
        description: 'Please fill out all fields.',
        variant: 'destructive',
      });
      return;
    }
    try {
      await addUser({ name, email, role, password });
      toast({
        title: 'Sign Up Successful',
        description: 'You can now log in with your new account.',
      });
      setAuthMode('login'); // Switch to login view
      // Clear fields
      setName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      toast({
        title: 'Sign Up Failed',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-2xl">
          {authMode === 'login' ? 'Welcome Back' : 'Create an Account'}
        </CardTitle>
        <CardDescription>
          {authMode === 'login'
            ? 'Enter your credentials to access your dashboard.'
            : 'Fill in the details to create a new account.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {authMode === 'signup' && (
          <div className="space-y-2">
            <Label htmlFor="signup-name">Full Name</Label>
            <Input
              id="signup-name"
              type="text"
              placeholder="shema honore"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="auth-email">Email</Label>
          <Input
            id="auth-email"
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="auth-password">Password</Label>
          <Input
            id="auth-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="auth-role">I am a...</Label>
          <Select
            value={role}
            onValueChange={(value) => setRole(value as UserRole)}
          >
            <SelectTrigger id="auth-role">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="lecturer">Lecturer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={authMode === 'login' ? handleLogin : handleSignUp}
          className="w-full"
          type="submit"
        >
          {authMode === 'login' ? 'Login' : 'Sign Up'}
        </Button>
      </CardContent>
      <CardFooter className="justify-center">
        <Button variant="link" onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}>
          {authMode === 'login'
            ? "Don't have an account? Sign Up"
            : 'Already have an account? Log In'}
        </Button>
      </CardFooter>
    </Card>
  );
}
