import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react'; // ← add these icons

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // ← new state
  const [loading, setLoading] = useState(false);
  const { login, apiCall } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiCall('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      login(res.token, res.user);
    } catch (err) {
      // error already toasted in apiCall
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Vibrant blurred background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.15),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.12),transparent_40%)]" />
        <div className="absolute inset-0 backdrop-blur-[100px]" />
      </div>

      {/* Content layer */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* Brand / logo */}
        <div className="mb-10">
          <Link
            to="/"
            className="flex items-center justify-center gap-2.5 text-3xl font-bold tracking-tight text-indigo-600"
          >
            <svg className="h-9 w-9" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            IntelliLink
          </Link>
        </div>

        {/* Glassmorphic card */}
        <div
          className="
            w-full max-w-md
            bg-white/70 backdrop-blur-xl
            border border-white/30
            rounded-2xl shadow-2xl
            p-10
            transition-all duration-300
            hover:shadow-2xl
          "
        >
          <h2 className="text-3xl font-bold text-center mb-2 text-gray-900">
            Welcome back
          </h2>
          <p className="text-center text-gray-500 mb-10">
            Log in to manage your smart links
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email field */}
            <div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email address"
                className="
                  w-full px-5 py-3.5
                  bg-white/60 border border-gray-200
                  rounded-xl
                  text-gray-900 placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400
                  transition-all duration-200
                "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password field with toggle */}
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                placeholder="Password"
                className="
                  w-full px-5 py-3.5
                  bg-white/60 border border-gray-200
                  rounded-xl
                  text-gray-900 placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400
                  transition-all duration-200
                  pr-12
                "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* Eye icon toggle */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="
                  absolute inset-y-0 right-0
                  pr-4 flex items-center
                  text-gray-500 hover:text-indigo-600
                  focus:outline-none
                "
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full py-3.5 mt-3
                bg-gradient-to-r from-indigo-600 to-indigo-700
                text-white font-medium
                rounded-xl
                shadow-lg hover:shadow-xl
                hover:from-indigo-700 hover:to-indigo-800
                focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
                disabled:opacity-60 disabled:cursor-not-allowed
                transition-all duration-200
                transform hover:scale-[1.02] active:scale-[0.98]
              "
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="
                font-medium text-indigo-600
                hover:text-indigo-700 hover:underline
                transition-colors duration-200
              "
            >
              Create account
            </Link>
          </p>
        </div>

        <p className="mt-12 text-sm text-gray-500/80">
          © {new Date().getFullYear()} AgenticAI • All rights reserved
        </p>
      </div>
    </div>
  );
}