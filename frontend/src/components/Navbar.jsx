import { useNavigate, Link, useLocation } from "react-router-dom";
import { Briefcase, Plus, LogOut, BarChart3, Layout } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userInfoString = localStorage.getItem("userInfo");
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
  const getFirstName = userInfo?.name?.split(" ")[0] ?? "";
  const getAvatar = userInfo?.name?.charAt(0)?.toUpperCase() ?? "";
  const [user] = useState({
    name: getFirstName,
    avatar: getAvatar,
  });

  const logout = () => {
    const toastId = toast.loading("Logging out..."); // Show loading spinner
    setTimeout(() => {
      localStorage.removeItem("userInfo");

      toast.success("Logged out!", {
        id: toastId, // Replace loading toast
        duration: 2000,
      });

      navigate("/"); // Redirect after logout
    }, 1500); // wait 1.5s for visual feedback
  };

  const isActive = path => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <h1
              onClick={() => navigate("/dashboard")}
              className="text-xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity"
            >
              JobTracker Pro
            </h1>
          </div>

          {/* Navigation and Actions */}
          <div className="flex items-center justify-between space-x-5">
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-2 pr-52">
              <Link
                to="/dashboard"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                  isActive("/dashboard")
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Layout className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/analytics"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                  isActive("/analytics")
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Analytics</span>
              </Link>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center space-x-2">
              <Link
                to="/dashboard"
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isActive("/dashboard")
                    ? "bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
                title="Dashboard"
              >
                <Layout className="w-5 h-5" />
              </Link>

              <Link
                to="/analytics"
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isActive("/analytics")
                    ? "bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
                title="Analytics"
              >
                <BarChart3 className="w-5 h-5" />
              </Link>
            </div>

            {/* Add Job Button */}
            <Link
              to="/create-job"
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Job</span>
            </Link>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {user.avatar}
              </div>
              <span className="hidden lg:inline text-gray-700 font-medium">{user.name}</span>
              <button
                onClick={logout}
                className="p-2 text-gray-500 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
