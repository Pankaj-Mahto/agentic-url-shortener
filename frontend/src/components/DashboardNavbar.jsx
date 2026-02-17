import { LogOut } from "lucide-react";

export default function DashboardNavbar({ logout }) {
  return (
    <div className="bg-white shadow-sm border-b">

      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <h1 className="text-2xl font-bold text-indigo-600">
          Agentic AI Dashboard
        </h1>

        <button
          onClick={logout}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>

    </div>
  );
}
