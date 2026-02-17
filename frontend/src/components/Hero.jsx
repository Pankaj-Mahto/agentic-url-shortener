import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="flex items-center justify-center py-20">

      <div className="max-w-4xl text-center px-6">

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-gray-800 mb-6"
        >
          AI Powered URL Shortener
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-600 text-lg mb-8"
        >
          Shorten URLs, track clicks, and get intelligent analytics with Agentic AI.
        </motion.p>

        <Link
          to="/register"
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
        >
          Get Started Free
        </Link>

      </div>

    </section>
  );
}
