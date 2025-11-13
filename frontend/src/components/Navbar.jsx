import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-white shadow-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Section */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-2xl font-bold tracking-tight hover:text-white transition-colors duration-200"
          >
            <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <span className="text-lg font-black text-neutral-100">F</span>
            </div>
            <span className="bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">
              FundHub
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            {!user ? (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="ml-2 px-6 py-2 bg-white text-neutral-900 rounded-lg hover:bg-neutral-200 transition-all duration-200 font-medium shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {/* Different dashboard links for NGO / Donor */}
                {user.role === "ngo" ? (
                  <>
                    <Link 
                      to="/dashboard"
                      className="px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/campaigns"
                      className="px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium"
                    >
                      My Campaigns
                    </Link>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/dashboard/donor"
                      className="px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/campaigns"
                      className="px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium"
                    >
                      Browse Campaigns
                    </Link>
                  </>
                )}

                {/* 🔒 Change Password + Logout */}
                <div className="ml-4 pl-4 border-l border-white/15 flex items-center space-x-3">
                  <Link
                    to="/change-password" // <-- new route
                    className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-lg backdrop-blur-sm transition-all duration-200 font-medium shadow-sm hover:shadow-md transform hover:-translate-y-0.5 border border-white/20"
                  >
                    Change Password
                  </Link>

                  <button
                    onClick={logout}
                    className="px-4 py-2 bg-white/15 hover:bg-white/20 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md transform hover:-translate-y-0.5 flex items-center space-x-2 text-white border border-white/15"
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
