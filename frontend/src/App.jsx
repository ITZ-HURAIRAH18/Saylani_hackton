import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Campaigns from "./pages/Campaigns";
import CampaignDetail from "./pages/CampaignDetail";
import DonorDashboard from "./pages/DonorDashboard";
import NGODashboard from "./pages/NGODashboard";
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ renamed
import ChangePassword from "./pages/ChangePassword";
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-neutral-100 text-neutral-900">
        <Navbar />
        <div className="p-4">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Login />} /> 👈 default homepage
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/campaign/:id" element={<CampaignDetail />} />
            <Route path="/change-password" element={<ChangePassword />} />


            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/donor"
              element={
                <ProtectedRoute role="donor">
                  <DonorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/ngo"
              element={
                <ProtectedRoute role="ngo">
                  <NGODashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          toastStyle={{
            background: "rgba(15, 15, 15, 0.95)",
            color: "#f5f5f5",
            borderRadius: "14px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 12px 30px rgba(0, 0, 0, 0.35)",
            backdropFilter: "blur(10px)",
            fontWeight: 500,
          }}
          progressStyle={{ background: "#f5f5f5" }}
        />
      </div>
    </Router>
  );
}

export default App;
