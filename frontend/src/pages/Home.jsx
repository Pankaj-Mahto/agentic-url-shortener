// src/pages/Home.jsx

import { useNavigate } from 'react-router-dom';
import { Link2, MousePointer2, BarChart3, Sparkles, ArrowRight } from 'lucide-react';
import Navbar from "../components/Navbar";
import Footer from '../components/Footer';
export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
    <Navbar/>
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-indigo-100 shadow-sm mb-6">
          <Sparkles className="h-5 w-5 text-indigo-600" />
          <span className="text-sm font-medium text-indigo-700">AI URL Shortener</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
          Smart Links.<br className="hidden sm:block" /> Powered by AI.
        </h1>

        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mb-10">
          Shorten URLs, track clicks, get AI-powered suggestions, and understand your audience — all in one beautiful dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-5">
          <button
            onClick={() => navigate('/register')}
            className="group relative px-8 py-4 bg-indigo-600 text-white font-semibold text-lg rounded-xl shadow-lg hover:bg-indigo-700 transition-all duration-200 flex items-center gap-3"
          >
            Get Started — It's Free
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => navigate('/login')}
            className="px-8 py-4 bg-white text-indigo-700 font-semibold text-lg rounded-xl border-2 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200"
          >
            Sign In
          </button>
        </div>
      </div>

      {/* Features / Stats preview section */}
      <div className="w-full max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <FeatureCard
            icon={<Link2 className="h-8 w-8 text-indigo-600" />}
            title="Instant Short Links"
            description="Create short, beautiful /s/ links in seconds with custom AI-generated titles & descriptions."
          />

          <FeatureCard
            icon={<MousePointer2 className="h-8 w-8 text-teal-600" />}
            title="Real-time Analytics"
            description="See exactly who's clicking, when, and from where — beautiful charts included."
          />

          <FeatureCard
            icon={<BarChart3 className="h-8 w-8 text-amber-600" />}
            title="AI-Powered Insights"
            description="Get smart suggestions, detect trends, and optimize your links automatically."
          />
        </div>
      </div>

      {/* Footer-ish CTA */}
      <div className="py-16 bg-white/40 backdrop-blur-sm border-t border-indigo-100/50 text-center">
        <p className="text-gray-600 mb-6 text-lg">
          Ready to make every link smarter?
        </p>
        <button
          onClick={() => navigate('/register')}
          className="px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xl rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-all duration-300"
        >
          Start Shortening Now
        </button>
        <Footer/>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white/70 backdrop-blur-md border border-white/80 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center">
      <div className="mb-5 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}