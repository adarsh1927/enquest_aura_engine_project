// frontend/src/app/page.tsx
"use client";

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function Home() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Style Engine</h1>

      {isAuthenticated ? (
        <div className="text-center">
          <p className="text-xl text-green-600 mb-4">You are logged in!</p>
          <Link href="/quiz" className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 mr-4">
            Start My Style Quiz
          </Link>
          <button onClick={logout} className="bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-600">
            Log Out
          </button>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">Please log in to discover your style.</p>
          <div>
            <Link href="/login" className="text-blue-600 hover:underline text-lg mr-4">
              Log In
            </Link>
            <Link href="/signup" className="text-blue-600 hover:underline text-lg">
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}