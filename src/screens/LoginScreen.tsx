import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export function LoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { signIn, isLoading } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    const { error: err } = await signIn(email, password);
    if (err) setError(err.message);
    else navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-app-bg px-6">
      <h1 className="text-3xl font-bold text-gray-50 text-center mb-2">
        Dopamine Detox
      </h1>
      <p className="text-gray-400 text-center mb-8">Sign in to continue</p>

      <form onSubmit={handleLogin} className="w-full max-w-sm">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-[#1f2937] rounded-xl px-4 py-4 text-gray-50 placeholder-gray-500 mb-4 border-0 outline-none focus:ring-2 focus:ring-green-500"
          disabled={isLoading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-[#1f2937] rounded-xl px-4 py-4 text-gray-50 placeholder-gray-500 mb-4 border-0 outline-none focus:ring-2 focus:ring-green-500"
          disabled={isLoading}
        />
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-app-accent text-gray-900 font-semibold py-4 rounded-xl mb-6 hover:opacity-90 disabled:opacity-70 transition"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
        <Link
          to="/signup"
          className="block text-center text-app-accent hover:opacity-80"
        >
          Don't have an account? Sign up
        </Link>
      </form>
    </div>
  );
}
