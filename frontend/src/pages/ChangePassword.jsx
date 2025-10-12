import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";

const ChangePassword = () => {
  const { token } = useAuth();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await axiosInstance.put(
        `/auth/change-password`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(res.data.message);
      setForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 shadow-lg rounded-xl w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-indigo-700 text-center">
          Change Password
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}
        {message && (
          <p className="text-green-600 text-sm mb-4 text-center">{message}</p>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-2">
            Current Password
          </label>
          <input
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200 focus:outline-none"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm mb-2">
            New Password
          </label>
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200 focus:outline-none"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-all duration-200"
        >
          Update Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
