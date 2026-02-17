import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom'; 


export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, apiCall } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiCall('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
      login(data.token, data.user);
    } catch (err) {
      // Error toasted
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

    {/* Content */}
    <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Optional logo / brand at top - you can remove if not needed */}
      <div className="mb-10">
        <Link
          to="/"
          className="flex items-center justify-center gap-2.5 text-3xl font-bold tracking-tight text-indigo-600"
        >
          <svg className="h-9 w-9" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          IntelliLink
        </Link>
      </div>

      {/* Main card */}
      <div className="
        w-full max-w-md
        bg-white/70 backdrop-blur-xl
        border border-white/30
        rounded-2xl shadow-2xl
        p-10
        transition-all duration-300
        hover:shadow-2xl
      ">
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-900">
          Create your account
        </h2>
        <p className="text-center text-gray-500 mb-10">
          Start building smarter links today
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="text"
              placeholder="Full name"
              className="
                w-full px-5 py-3.5
                bg-white/60 border border-gray-200
                rounded-xl
                text-gray-900 placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400
                transition-all duration-200
              "
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <input
              type="email"
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
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Create password"
              className="
                w-full px-5 py-3.5
                bg-white/60 border border-gray-200
                rounded-xl
                text-gray-900 placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400
                transition-all duration-200
              "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

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
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="
              font-medium text-indigo-600
              hover:text-indigo-700 hover:underline
              transition-colors duration-200
            "
          >
            Sign in
          </Link>
        </p>
      </div>

      {/* Optional subtle footer text */}
      <p className="mt-12 text-sm text-gray-500/80">
        © {new Date().getFullYear()} AgenticAI • All rights reserved
      </p>
    </div>
  </div>
);
}