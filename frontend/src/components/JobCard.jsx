import { Form } from "react-router";
import {
  Building2,
  Calendar,
  Clock,
  TrendingUp,
  CheckCircle,
  XCircle,
  Edit3,
  Trash2,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router";

const JobCard = ({ job }) => {
  const getStatusConfig = status => {
    const configs = {
      applied: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: Clock,
        iconColor: "text-blue-600",
      },
      interview: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: Users,
        iconColor: "text-yellow-600",
      },
      offer: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
        iconColor: "text-green-600",
      },
      rejected: {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle,
        iconColor: "text-red-600",
      },
    };
    return configs[status] || configs.applied;
  };

  const navigate = useNavigate();
  const statusConfig = getStatusConfig(job.status);
  const StatusIcon = statusConfig.icon;

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await api.delete(`/jobs/${job._id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      onDeleted(job._id); // notify parent
    } catch (err) {
      alert("Failed to delete job.");
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200/50 p-6 hover:shadow-lg transition-all duration-200 group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {job.position}
            </h3>
            <div
              className={`flex items-center space-x-1 px-3 py-1 rounded-full border ${statusConfig.color}`}
            >
              <StatusIcon className={`w-4 h-4 ${statusConfig.iconColor}`} />
              <span className="text-sm font-medium capitalize">{job.status}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-gray-600 mb-3">
            <Building2 className="w-4 h-4" />
            <span className="font-medium">{job.company}</span>
            <span className="text-gray-400">•</span>
            <span className="text-sm">{job.location}</span>
            <span className="text-gray-400">•</span>
            <span className="text-sm">{job.type}</span>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Applied {new Date(job.dateApplied).toLocaleDateString()}</span>
            </div>
            {job.salary && (
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4" />
                <span>{job.salary}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {Math.floor(Math.random() * 30) + 1} days ago
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate(`/edit-job/${job._id}`)}
            className="flex items-center space-x-1 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            <span className="text-sm font-medium">Edit</span>
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center space-x-1 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-sm font-medium">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
