import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import { Eye, EyeOff, Briefcase, CheckCircle, Shield, Zap, Clock } from "lucide-react";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });

    // Calculate password strength
    if (e.target.name === "password") {
      const password = e.target.value;
      let strength = 0;
      if (password.length >= 8) strength++;
      if (/[A-Z]/.test(password)) strength++;
      if (/[a-z]/.test(password)) strength++;
      if (/[0-9]/.test(password)) strength++;
      if (/[^A-Za-z0-9]/.test(password)) strength++;
      setPasswordStrength(strength);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post("/users/register", form);
      localStorage.setItem("userInfo", JSON.stringify(res.data));
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("Registration successfull");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Registration Failed. Please try again.");
      console.log("Error on registration: ", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 3) return "Medium";
    return "Strong";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex">
      {/* Left Side - Registration Form */}
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
              <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
              <p className="text-slate-300">Start your career journey with us today</p>
            </div>

            <div onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

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
                    placeholder="Create a strong password"
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

                {form.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-300">Password Strength</span>
                      <span
                        className={`text-xs font-medium ${
                          passwordStrength <= 2
                            ? "text-red-400"
                            : passwordStrength <= 3
                            ? "text-yellow-400"
                            : "text-green-400"
                        }`}
                      >
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating account...</span>
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-slate-300">
                Already have an account?{" "}
                <Link
                  to={"/"}
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-6 text-center text-slate-400 text-sm">
            <p>Protected by enterprise-grade security • Free forever</p>
          </div>
        </div>
      </div>

      {/* Right Side - Benefits & Features */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-bl from-purple-600/20 to-blue-600/20 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="flex items-center mb-8">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mr-4">
              <Briefcase className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              JobTracker Pro
            </h1>
          </div>

          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Your Career Success
            <span className="block text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text">
              Starts Here
            </span>
          </h2>

          <p className="text-xl text-slate-300 mb-12 leading-relaxed">
            Join thousands of professionals who've accelerated their career growth with our
            powerful job tracking platform.
          </p>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-600/20 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Completely Free</h3>
                <p className="text-slate-400">Full access to all features, no hidden costs</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Instant Setup</h3>
                <p className="text-slate-400">Get started in under 60 seconds</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="p-2 bg-purple-600/20 rounded-lg">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Secure & Private</h3>
                <p className="text-slate-400">Your data is encrypted and protected</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="p-2 bg-yellow-600/20 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Save 10+ Hours Weekly</h3>
                <p className="text-slate-400">Automate your job search workflow</p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-xl"></div>
      </div>
    </div>
  );
};

export default RegisterPage;
