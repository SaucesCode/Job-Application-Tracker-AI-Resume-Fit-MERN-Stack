import { useEffect, useState } from "react";
import { User, Mail, Lock, Save, Camera, Edit } from "lucide-react";
import api from "../services/api";
import Navbar from "../components/Navbar";

const ProfilePage = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const getAvatar = userInfo?.name?.charAt(0)?.toUpperCase() ?? "";
  const [stats, setStats] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const dateJoined = userInfo?.joinDate
    ? new Date(userInfo.joinDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  useEffect(() => {
    if (userInfo) {
      setForm({
        name: userInfo.name || "",
        email: userInfo.email || "",
        password: "",
        bio: form.bio || "",
      });
    }

    const fetchStats = async () => {
      try {
        const res = await api.get("/jobs/stats", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Stats fetch failed", err);
      }
    };

    fetchStats();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await api.put(
        "/users/profile",
        {
          name: form.name,
          email: form.email,
          password: form.password || undefined,
          bio: form.bio || "",
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      // Update local storage and state
      localStorage.setItem("userInfo", JSON.stringify(res.data));
      setMessage("✅ Profile updated successfully.");
      setLoading(false);
    } catch (err) {
      setMessage("❌ Failed to update profile.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
          <p className="text-gray-600">Manage your profile and account preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {getAvatar}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{userInfo.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{userInfo.email}</p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{stats.total ?? 0}</p>
                    <p className="text-xs text-gray-500">Applications</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {stats?.statusCounts?.offer ?? 0}
                    </p>
                    <p className="text-xs text-gray-500">Offers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Profile Information
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Update your personal information and email address
                    </p>
                  </div>
                  <Edit className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div className="p-6">
                {message && (
                  <div
                    className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
                      message.includes("✅")
                        ? "bg-green-50 text-green-800 border border-green-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                  >
                    <span>{message}</span>
                  </div>
                )}

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    {/* Email Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="Enter your email address"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Lock className="w-4 h-4 inline mr-2" />
                      New Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Leave blank to keep current password"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Password must be at least 8 characters long
                    </p>
                  </div>

                  {/* Member Since Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Member Since
                    </label>
                    <input
                      type="text"
                      value={dateJoined}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                      disabled
                    />
                  </div>

                  {/* Bio Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                      rows={4}
                      value={form.bio}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                      placeholder="Tell us a bit about yourself and your career goals..."
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-6 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={e => {
                        e.preventDefault();
                        handleSubmit(e);
                      }}
                      disabled={loading}
                      className="flex items-center space-x-2 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
