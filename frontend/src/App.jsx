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
        <Routes>
          {/* Public routes - full screen pages without padding */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Pages with navbar and padding */}
          <Route path="/campaigns" element={<div className="p-4"><Campaigns /></div>} />
          <Route path="/campaign/:id" element={<div className="p-4"><CampaignDetail /></div>} />
          <Route path="/change-password" element={<div className="p-4"><ChangePassword /></div>} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div className="p-4"><Dashboard /></div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/donor"
            element={
              <ProtectedRoute role="donor">
                <div className="p-4"><DonorDashboard /></div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/ngo"
            element={
              <ProtectedRoute role="ngo">
                <div className="p-4"><NGODashboard /></div>
              </ProtectedRoute>
            }
          />
        </Routes>
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
