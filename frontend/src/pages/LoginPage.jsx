import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import { Eye, EyeOff, Briefcase, TrendingUp, Users, Target } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    if (!form.email || !form.password) {
      toast.error("Missing credentials");
    }
    try {
      const res = await api.post("/users/login", form);
      localStorage.setItem("userInfo", JSON.stringify(res.data));
      await new Promise(resolve => setTimeout(resolve, 1500));

      setTimeout(() => {
        toast.success("Logged In!");
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      toast.error(err.response.data.message);
      console.log("Error on login: ", err.message);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex">
      {/* Left Side - Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="flex items-center mb-8">
            <div className="p-3 bg-blue-600 rounded-xl mr-4">
              <Briefcase className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              JobTracker Pro
            </h1>
          </div>

          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Take Control of Your
            <span className="block text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
              Career Journey
            </span>
          </h2>

          <p className="text-xl text-slate-300 mb-12 leading-relaxed">
            Track applications, manage interviews, and land your dream job with our
            comprehensive career management platform.
          </p>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <Target className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Smart Application Tracking</h3>
                <p className="text-slate-400">Never lose track of an opportunity again</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="p-2 bg-purple-600/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Progress Analytics</h3>
                <p className="text-slate-400">Visualize your job search progress</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-600/20 rounded-lg">
                <Users className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Interview Management</h3>
                <p className="text-slate-400">Schedule and prepare for success</p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-xl"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 lg:px-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center mb-4">
              <div className="p-2 bg-blue-600 rounded-lg mr-3">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">JobTracker Pro</h1>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-slate-300">Sign in to continue your job search journey</p>
            </div>

            <div onSubmit={() => console.log("Button Click!")} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 text-slate-300">
                  <span></span>
                </label>
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-slate-300">
                Don't have an account?{" "}
                <Link
                  to={"/register"}
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                >
                  Sign up for free
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-6 text-center text-slate-400 text-sm">
            <p>Secure login protected by enterprise-grade encryption</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
