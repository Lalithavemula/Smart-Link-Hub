import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Link, Navigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { useForm } from 'react-hook-form';
import { useForm as useHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

const loginSchema = z.object({
  usernameOrEmail: z.string().min(1, 'Username or Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Login() {
  const { login, user } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useHookForm({
    resolver: zodResolver(loginSchema),
  });

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data);
      toast.success('Logged in successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4 transition-colors duration-300">
      <Card className="w-full max-w-md dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl rounded-3xl">
        <CardContent className="pt-8 px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Welcome Back</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Sign in to SmartLink Hub</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Username or Email"
              placeholder="e.g. johndoe"
              {...register('usernameOrEmail')}
              error={errors.usernameOrEmail?.message}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              error={errors.password?.message}
            />
            <div className="pt-2">
              <Button type="submit" className="w-full py-2.5 text-base rounded-xl" isLoading={loading}>
                Sign In
              </Button>
            </div>
          </form>
          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:underline font-semibold transition-colors">
              Create one
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
