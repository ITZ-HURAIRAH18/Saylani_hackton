import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth(); // get user + logout from context

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white shadow-lg border-b border-indigo-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-2xl font-bold tracking-tight hover:text-indigo-200 transition-colors duration-200"
          >
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <span className="text-lg font-black text-white">F</span>
            </div>
            <span className="bg-gradient-to-r from-white to-indigo-100 bg-clip-text text-transparent">
              FundHub
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            {!user ? (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="ml-2 px-6 py-2 bg-white text-indigo-700 rounded-lg hover:bg-indigo-50 transition-all duration-200 font-medium shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  Sign Up
                </Link>
              </>
            ) : user.role === "ngo" ? (
              <>
                <Link 
                  to="/dashboard"
                  className="px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/campaigns"
                  className="px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium"
                >
                  My Campaigns
                </Link>
                <div className="ml-4 pl-4 border-l border-white/20">
                  <button
                    onClick={logout}
                    className="px-4 py-2 bg-red-500/90 hover:bg-red-500 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md transform hover:-translate-y-0.5 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/dashboard/donor"
                  className="px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/campaigns"
                  className="px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium"
                >
                  Browse Campaigns
                </Link>
                <div className="ml-4 pl-4 border-l border-white/20">
                  <button
                    onClick={logout}
                    className="px-4 py-2 bg-red-500/90 hover:bg-red-500 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md transform hover:-translate-y-0.5 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;