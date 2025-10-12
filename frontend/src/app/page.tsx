// frontend/src/app/page.tsx
"use client";

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function Home() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.5rem' }}>Welcome to the Style Engine</h1>

      {isAuthenticated ? (
        <div>
          <p style={{ fontSize: '1.2rem', color: 'green' }}>You are logged in!</p>
          <button onClick={logout} style={{ padding: '0.5rem 1rem', marginTop: '1rem' }}>
            Log Out
          </button>
          {/* We will add the "Start Quiz" button here later */}
        </div>
      ) : (
        <div>
          <p style={{ fontSize: '1.2rem', color: 'red' }}>You are not logged in.</p>
          <div style={{ marginTop: '1rem' }}>
            <Link href="/login" style={{ marginRight: '1rem', color: '#0070f3' }}>
              Log In
            </Link>
            <Link href="/signup" style={{ color: '#0070f3' }}>
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}