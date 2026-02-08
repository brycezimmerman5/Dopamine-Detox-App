import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export function SignUpScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const { signUp, isLoading } = useAuthStore();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    const { error: err } = await signUp(email, password);
    if (err) setError(err.message);
    else {
      setError('Check your email to confirm your account');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-app-bg px-6">
      <h1 className="text-3xl font-bold text-gray-50 text-center mb-2">
        Create Account
      </h1>
      <p className="text-gray-400 text-center mb-8">
        Start your dopamine reset journey
      </p>

      <form onSubmit={handleSignUp} className="w-full max-w-sm">
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
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-[#1f2937] rounded-xl px-4 py-4 text-gray-50 placeholder-gray-500 mb-4 border-0 outline-none focus:ring-2 focus:ring-green-500"
          disabled={isLoading}
        />
        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full bg-[#1f2937] rounded-xl px-4 py-4 text-gray-50 placeholder-gray-500 mb-4 border-0 outline-none focus:ring-2 focus:ring-green-500"
          disabled={isLoading}
        />
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-500 text-gray-900 font-semibold py-4 rounded-xl mb-6 hover:bg-green-600 disabled:opacity-70 transition"
        >
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </button>
        <Link
          to="/login"
          className="block text-center text-green-500 hover:text-green-400"
        >
          Already have an account? Sign in
        </Link>
      </form>
    </div>
  );
}
