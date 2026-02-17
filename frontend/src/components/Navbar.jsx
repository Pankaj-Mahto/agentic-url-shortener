import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { LinkIcon, LogOut, LayoutDashboard, LogIn } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav
      className="
        sticky top-0 z-50
        bg-white/70 backdrop-blur-md border-b border-white/20
        shadow-sm transition-all duration-300
      "
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="
            flex items-center gap-2.5
            text-2xl font-bold tracking-tight
            text-indigo-600 hover:text-indigo-700
            transition-colors duration-200
          "
        >
          <LinkIcon className="h-7 w-7" />
          IntelliLink
        </Link>

        {/* Right side buttons/links */}
        <div className="flex items-center gap-6">
          {user ? (
            <>
              {/* Dashboard Link */}
              <Link
                to="/dashboard"
                className="
                  group flex items-center gap-2
                  text-gray-700 hover:text-indigo-600
                  font-medium transition-all duration-200
                  relative px-1 py-1
                "
              >
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
                <span
                  className="
                    absolute bottom-0 left-0 h-0.5 w-0
                    bg-indigo-500 rounded-full
                    group-hover:w-full transition-all duration-300
                  "
                />
              </Link>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="
                  group flex items-center gap-2
                  bg-gradient-to-r from-red-500 to-rose-600
                  text-white font-medium
                  px-5 py-2.5 rounded-xl
                  shadow-sm hover:shadow-md
                  hover:scale-[1.03] active:scale-[0.98]
                  transition-all duration-200
                "
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </>
          ) : (
            // {/* Login Button – fixed: no comma after to="/login" */}
            <Link
              to="/login"
              className="
                group flex items-center gap-2
                bg-gradient-to-r from-indigo-600 to-indigo-700
                text-white font-medium
                px-6 py-2.5 rounded-xl
                shadow-md hover:shadow-lg
                hover:scale-[1.03] active:scale-[0.98]
                transition-all duration-200
              "
            >
              <LogIn className="h-5 w-5" />
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}