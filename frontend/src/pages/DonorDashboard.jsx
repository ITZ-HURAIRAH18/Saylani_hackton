// src/pages/DonorDashboard.jsx  (drop-in replacement)
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import {
  CurrencyRupeeIcon,
  HeartIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

const DonorDashboard = () => {
  const { token } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------- data ---------- */
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await axiosInstance.get("/dashboard/donor", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDonations(Array.isArray(res.data) ? res.data : res.data.donations || []);
      } catch {
        setDonations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, [token]);

  /* ---------- helpers ---------- */
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(amount);

  const total = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
  const count = donations.length;
  const avg = count ? total / count : 0;

  /* ---------- loading ---------- */
  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-neutral-700 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  /* ---------- empty ---------- */
  if (donations.length === 0)
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/85 backdrop-blur rounded-2xl shadow-xl border border-white/30 p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-neutral-200 to-neutral-300 rounded-full flex items-center justify-center mx-auto mb-5">
            <HeartIcon className="w-8 h-8 text-neutral-700" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Start Your Journey</h2>
          <p className="text-gray-600 mb-6">You haven't made any donations yet. Discover campaigns and make your first impact!</p>
          <a
            href="/campaigns"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-neutral-900 to-neutral-700 text-white font-medium shadow hover:shadow-lg transition hover:-translate-y-0.5"
          >
            Explore Campaigns <ArrowRightIcon className="w-4 h-4" />
          </a>
        </div>
      </div>
    );

  /* ---------- main ---------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-100 to-neutral-200">
      {/* header */}
      <header className="bg-gradient-to-r from-neutral-900 to-neutral-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Donations</h1>
            <p className="text-neutral-300 mt-1">Track your impact and contribution history</p>
          </div>
          <div className="w-14 h-14 bg-white/15 rounded-full flex items-center justify-center">
            <HeartIcon className="w-7 h-7" />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <MetricCard label="Total Donated" value={formatCurrency(total)} icon={<CurrencyRupeeIcon className="w-6 h-6" />} gradient="from-neutral-100 to-neutral-200" text="text-neutral-800" />
          <MetricCard label="Campaigns Supported" value={count} icon={<HeartIcon className="w-6 h-6" />} gradient="from-neutral-100 to-neutral-150" text="text-neutral-800" />
          <MetricCard label="Average Donation" value={formatCurrency(avg)} icon={<ChartBarIcon className="w-6 h-6" />} gradient="from-neutral-150 to-neutral-200" text="text-neutral-800" />
        </div>

        {/* table */}
        <div className="bg-white/85 backdrop-blur rounded-2xl shadow-xl border border-white/30 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-neutral-100 to-neutral-200 border-b border-neutral-200">
            <h2 className="text-lg font-semibold text-gray-900">Donation History</h2>
            <p className="text-sm text-gray-600 mt-1">Your complete contribution record</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Campaign</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Message</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {donations.map((d, i) => (
                  <tr key={d._id} className={`hover:bg-neutral-100 transition ${i % 2 ? "bg-white/60" : "bg-gray-50/50"}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-neutral-200 to-neutral-300 rounded-lg flex items-center justify-center">
                          <HeartIcon className="w-5 h-5 text-neutral-700" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{d.campaign?.title || "Campaign"}</p>
                          <p className="text-xs text-gray-500">ID: {d._id.slice(-8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-neutral-900 text-white">
                        {formatCurrency(d.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{d.message || <span className="text-gray-400 italic">No message</span>}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(d.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 bg-gray-50/80 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
            <span>Showing {donations.length} donation{donations.length !== 1 ? "s" : ""}</span>
            <a href="/campaigns" className="inline-flex items-center gap-1 text-neutral-800 hover:text-neutral-600 transition">
              Find more campaigns <ArrowRightIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- components ---------- */
const MetricCard = ({ label, value, icon, gradient, text }) => (
  <div className={`bg-white/90 rounded-2xl shadow-lg border border-white/30 p-6 flex items-center gap-5 bg-gradient-to-br ${gradient} ${text}`}>
    <div className="w-12 h-12 rounded-xl bg-white/70 border border-white/40 flex items-center justify-center">{icon}</div>
    <div>
      <p className="text-sm opacity-80">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

export default DonorDashboard;