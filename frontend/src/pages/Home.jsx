export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <h1 className="text-5xl font-bold text-gray-800 mb-6">Agentic AI URL Shortener</h1>
      <p className="text-xl text-gray-600 mb-10">Shorten links with smart AI suggestions, analytics & more.</p>
      <div className="space-x-6">
        <a href="/login" className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition">
          Login
        </a>
        <a href="/register" className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition">
          Register
        </a>
      </div>
    </div>
  );
}