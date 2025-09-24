import { useAuth } from "../context/AuthContext";
import NGODashboard from "./NGODashboard";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return <p>Please login</p>;

  if (user.role === "ngo") {
    return <NGODashboard />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Donor Dashboard</h1>
      <p>Here you will see your donation history (coming next).</p>
    </div>
  );
}
