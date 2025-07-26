import { useEffect, useState } from "react";
import api from "../services/api";
import ChartCard from "../components/ChartCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Pie,
  LineChart,
  PieChart,
  ResponsiveContainer,
  Cell,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import {
  Rocket,
  Trophy,
  Users,
  Ban,
  BarChart3,
  Activity,
  Download,
  RefreshCw,
  Briefcase,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import Navbar from "../components/Navbar";

const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];

const StatsCard = ({ title, value, change, icon: Icon, color, trend }) => (
  <div
    className={`bg-gradient-to-br ${color} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-white/80 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
        {change && (
          <div className="flex items-center mt-2 text-sm">
            {trend === "up" ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : trend === "down" ? (
              <TrendingDown className="w-4 h-4 mr-1" />
            ) : (
              <Activity className="w-4 h-4 mr-1" />
            )}
            <span className="font-medium">{change}</span>
          </div>
        )}
      </div>
      <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
        <Icon className="w-8 h-8" />
      </div>
    </div>
  </div>
);

const AnalyticsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get("/jobs/stats", {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        setStats(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error loading analytics:", err);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
    window.location.reload();
  };

  const statusData = stats?.statusCounts
    ? Object.entries(stats.statusCounts).map(([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: count,
      }))
    : [];

  const barData =
    typeof stats?.thisMonth === "number" && typeof stats?.lastMonth === "number"
      ? [
          { name: "Last Month", Applications: stats.lastMonth },
          { name: "This Month", Applications: stats.thisMonth },
        ]
      : [];

  const lineData = Array.isArray(stats?.dailyCounts) ? stats.dailyCounts : [];

  const weeklyData = Array.isArray(stats?.weeklyTrend) ? stats.weeklyTrend : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-96 bg-gray-200 rounded-xl"></div>
              <div className="h-96 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 Analytics Dashboard</h1>
              <p className="text-gray-600">Track your job application progress and insights</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                Refresh
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {stats && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <StatsCard
                title="Total Applications"
                value={stats.total}
                change={`${stats.percentChange > 0 ? "+" : ""}${stats.percentChange}%`}
                icon={Briefcase}
                color="from-blue-500 to-blue-600"
                trend={stats.percentChange > 0 ? "up" : "down"}
              />
              <StatsCard
                title="Applied"
                value={stats.statusCounts.applied || 0}
                change={`${stats.percentChange > 0 ? "+" : ""}${stats.percentChange}%`}
                icon={Rocket}
                color="from-purple-500 to-purple-600"
              />
              <StatsCard
                title="Interviewing"
                value={stats.statusCounts.interviewing || 0}
                change={`${stats.percentChange > 0 ? "+" : ""}${stats.percentChange}%`}
                icon={Users}
                color="from-emerald-500 to-emerald-600"
              />
              <StatsCard
                title="Offers"
                value={stats.statusCounts.offer || 0}
                change={`${stats.percentChange > 0 ? "+" : ""}${stats.percentChange}%`}
                icon={Trophy}
                color="from-amber-500 to-amber-600"
              />
              <StatsCard
                title="Rejected"
                value={stats.statusCounts.rejected || 0}
                change={`${stats.percentChange > 0 ? "+" : ""}${stats.percentChange}%`}
                icon={Ban}
                color="from-red-500 to-red-600"
              />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Monthly Comparison */}
              <ChartCard
                title="Monthly Application Comparison"
                icon={BarChart3}
                iconColor="bg-blue-500"
              >
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barData}>
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "none",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Bar
                      dataKey="Applications"
                      fill="url(#blueGradient)"
                      radius={[6, 6, 0, 0]}
                    />
                    <defs>
                      <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#1d4ed8" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* Status Distribution */}
              <ChartCard
                title="Application Status Distribution"
                icon={PieChart}
                iconColor="bg-purple-500"
              >
                <ResponsiveContainer width="100%" height={300}>
                  {statusData.length > 0 ? (
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                      <Tooltip />
                    </PieChart>
                  ) : (
                    <div className="flex justify-center items-center h-full text-gray-500 text-sm">
                      No status data available
                    </div>
                  )}
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Full Width Charts */}
            <div className="space-y-6">
              {/* Daily Trend */}
              <ChartCard
                title="Daily Applications Trend"
                icon={LineChart}
                iconColor="bg-emerald-500"
                actions={
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span>Applications</span>
                  </div>
                }
              >
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={lineData}>
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "none",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#10b981"
                      strokeWidth={3}
                      fill="url(#colorGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* Weekly Performance */}
              <ChartCard
                title="Weekly Performance Overview"
                icon={Activity}
                iconColor="bg-amber-500"
                actions={
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>Applications</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      <span>Interviews</span>
                    </div>
                  </div>
                }
              >
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={weeklyData}>
                    <XAxis
                      dataKey="week"
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "none",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Bar
                      dataKey="applications"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                      name="Applications"
                    />
                    <Bar
                      dataKey="interviews"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                      name="Interviews"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
