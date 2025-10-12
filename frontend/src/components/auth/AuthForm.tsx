// frontend/src/components/auth/AuthForm.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import { apiService } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

// Define the props the component will accept
interface AuthFormProps {
  formType: 'login' | 'signup';
}

export default function AuthForm({ formType }: AuthFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { login } = useAuth();

  const isLogin = formType === 'login';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const data = await apiService.post('auth/jwt/create/', {
          email: formData.email,
          password: formData.password,
        });
        login(data.access);
        router.push('/');
      } else {
        await apiService.post('auth/users/', {
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          password: formData.password,
        });
        router.push('/login?signupSuccess=true'); // Redirect to login after signup
      }
    } catch (err: any) {
      setIsLoading(false);
      console.error(err);
      // Check if the error message is a JSON string
      try {
        const errorData = JSON.parse(err.message);
        const specificError = errorData.email?.[0] || errorData.password?.[0] || errorData.detail || 'An unknown error occurred.';
        setError(specificError);
      } catch (parseError) {
        // If it's not JSON, it's likely a network error string like "Failed to fetch"
        setError(err.message || 'A network error occurred. Is the backend running?');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isLogin ? 'Sign in to your account' : 'Create a new account'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <Input label="First Name" name="firstName" type="text" value={formData.firstName} onChange={handleChange} required />
                <Input label="Last Name" name="lastName" type="text" value={formData.lastName} onChange={handleChange} required />
              </>
            )}
            <Input label="Email address" name="email" type="email" value={formData.email} onChange={handleChange} required />
            <Input label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
              >
                {isLoading ? 'Processing...' : (isLogin ? 'Sign in' : 'Create Account')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}