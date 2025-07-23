import { useNavigate, Link } from "react-router-dom";
import { Briefcase, Plus, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";

const Navbar = () => {
  const userInfoString = localStorage.getItem("userInfo");
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
  const getFirstName = userInfo?.name?.split(" ")[0] ?? "";
  const getAvatar = userInfo?.name?.charAt(0)?.toUpperCase() ?? "";
  const [user] = useState({
    name: getFirstName,
    avatar: getAvatar,
  });

  const navigate = useNavigate();
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

  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              JobTracker Pro
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105">
              <Plus className="w-4 h-4" />
              <Link to="/create-job" className="hidden sm:inline">
                Add Job
              </Link>
            </button>
            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {user.avatar}
              </div>
              <span className="hidden md:inline text-gray-700 font-medium">{user.name}</span>
              <button
                onClick={logout}
                className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" onClick={logout} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
