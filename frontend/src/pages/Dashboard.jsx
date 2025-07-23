import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  BarChart3,
  Target,
  Clock,
  Users,
  CheckCircle,
  Briefcase,
} from "lucide-react";
import api from "../services/api";
import JobCard from "../components/JobCard";
import Navbar from "../components/Navbar";
import StatsCard from "../components/StatsCard";

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    if (!userInfo) {
      navigate("/");
      return;
    }

    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs", {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        setJobs(res.data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };

    fetchJobs();
  }, [navigate]);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      job.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || job.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: jobs.length,
    applied: jobs.filter(j => j.status === "applied").length,
    interviews: jobs.filter(j => j.status === "interview").length,
    offers: jobs.filter(j => j.status === "offer").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Track and manage your job applications</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Applications"
            value={stats.total}
            change="+12%"
            icon={Target}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <StatsCard
            title="Applied"
            value={stats.applied}
            change="+8%"
            icon={Clock}
            color="bg-gradient-to-r from-yellow-500 to-yellow-600"
          />
          <StatsCard
            title="Interviews"
            value={stats.interviews}
            change="+25%"
            icon={Users}
            color="bg-gradient-to-r from-purple-500 to-purple-600"
          />
          <StatsCard
            title="Offers"
            value={stats.offers}
            change="+100%"
            icon={CheckCircle}
            color="bg-gradient-to-r from-green-500 to-green-600"
          />
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl border border-gray-200/50 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search jobs or companies..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Job Applications */}
        <div className="bg-white rounded-xl border border-gray-200/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Applications</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <BarChart3 className="w-4 h-4" />
              <span>
                {filteredJobs.length} of {jobs.length} applications
              </span>
            </div>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {jobs.length === 0
                  ? "No job applications yet"
                  : "No applications match your search"}
              </h3>
              <p className="text-gray-500 mb-6">
                {jobs.length === 0
                  ? "Start tracking your job applications to see them here"
                  : "Try adjusting your search terms or filters"}
              </p>
              {jobs.length === 0 && (
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105">
                  Add Your First Job
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map(job => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
