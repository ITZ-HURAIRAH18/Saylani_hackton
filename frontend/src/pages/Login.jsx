import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { login, verifyOtp } = useAuth(); // ✅ both functions from context

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false); // ✅ new state
  const [otp, setOtp] = useState(""); // ✅ OTP input

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // STEP 1: Handle email/password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await login(formData.email, formData.password);

      if (res.user && res.token) {
        // ✅ Admin or direct login
        saveUserAndRedirect(res.user, res.token);
      } else if (res.message?.includes("OTP")) {
        // ✅ OTP sent case
        setOtpSent(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 2: Verify OTP
  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await verifyOtp(formData.email, otp.trim());
      if (res.user && res.token) {
        saveUserAndRedirect(res.user, res.token);
      }
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Save user + token and redirect
  const saveUserAndRedirect = (user, token) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    dispatch(setUser(user));

    if (user.role === "ngo") {
      navigate("/dashboard/ngo");
    } else if (user.role === "donor") {
      navigate("/dashboard/donor");
    } else {
      navigate("/dashboard/admin");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center py-12">
      <div className="max-w-md w-full mx-4 space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-gray-800 to-black rounded-2xl flex items-center justify-center shadow-lg border border-gray-700">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-300">Sign in to your FundHub account</p>
        </div>

        {/* Auth Section */}
        <div className="bg-black/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700 p-8">
          {error && (
            <div className="mb-6 bg-gray-900 border border-red-600 text-red-400 px-4 py-3 rounded-lg flex items-center space-x-2">
              <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {!otpSent ? (
            // STEP 1: Login Form
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-white block">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-600 rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-white focus:border-white bg-gray-900/50 text-white placeholder-gray-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold text-white block">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-gray-600 rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-white focus:border-white bg-gray-900/50 text-white placeholder-gray-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 text-black font-semibold rounded-xl bg-gradient-to-r from-white to-gray-200 hover:from-gray-100 hover:to-white shadow-lg transition-all duration-200"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          ) : (
            // STEP 2: OTP Form
            <form onSubmit={handleOtpVerify} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="otp" className="text-sm font-semibold text-white block">
                  Enter OTP sent to your email
                </label>
                <input
                  type="text"
                  name="otp"
                  id="otp"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full border border-gray-600 rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-white focus:border-white bg-gray-900/50 text-white placeholder-gray-500 text-center font-mono tracking-widest"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 text-black font-semibold rounded-xl bg-gradient-to-r from-white to-gray-200 hover:from-gray-100 hover:to-white shadow-lg transition-all duration-200"
              >
                {isLoading ? "Verifying OTP..." : "Verify OTP"}
              </button>
            </form>
          )}

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-300">
              Don't have an account?{" "}
              <a href="/signup" className="font-semibold text-white hover:text-gray-300 transition-colors duration-200">Sign up here</a>
            </p>
            <a href="/forgot-password" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
              Forgot your password?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
