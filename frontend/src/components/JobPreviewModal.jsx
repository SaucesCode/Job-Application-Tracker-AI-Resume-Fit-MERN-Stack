import { useEffect, useState } from "react";
import {
  Building2,
  Calendar,
  DollarSign,
  User,
  ExternalLink,
  FileText,
  MessageSquare,
  Target,
} from "lucide-react";
import api from "../services/api";

const JobPreviewModal = ({ jobId, onClose }) => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fit, setFit] = useState(null);
  const [loadingFit, setLoadingFit] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${jobId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setJob(res.data);

        // ✅ Use the saved aiFit if it exists
        if (res.data.aiFit?.fitScore !== undefined) {
          setFit(res.data.aiFit);
        } else {
          // ❌ Otherwise, call Gemini only once
          await fetchFitScore(res.data);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error loading job:", err);
        setLoading(true);
      }
    };

    const fetchFitScore = async jobData => {
      setLoadingFit(true);
      try {
        const res = await api.post(
          "/ai/fit-score",
          {
            jobId: jobData._id,
            jobDescription: jobData.description,
          },
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );
        setFit(res.data);
      } catch (err) {
        console.error("Fit score failed:", err);
      } finally {
        setLoadingFit(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const getStatusColor = status => {
    switch (status?.toLowerCase()) {
      case "Applied":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Interview":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Offer":
        return "bg-green-100 text-green-800 border-green-200";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "Saved":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getFitScoreColor = score => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white p-6 relative">
          <div className="pr-12">
            <h1 className="text-2xl font-bold mb-2">{job.position}</h1>
            <div className="flex items-center gap-2 text-slate-200 mb-3">
              <Building2 size={16} />
              <span className="text-lg">{job.company}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-300">
              <span className="bg-white/10 px-3 py-1 rounded-full">{job.jobType}</span>
              <span
                className={`px-3 py-1 rounded-full border capitalize ${getStatusColor(
                  job.status
                )} bg-white text-slate-800`}
              >
                {job.status}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="p-6">
            {/* Key Information Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {job.salary && (
                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign size={18} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-900">Salary Range</p>
                    <p className="text-green-700">{job.salary}</p>
                  </div>
                </div>
              )}

              {job.dateApplied && (
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-blue-900">Date Applied</p>
                    <p className="text-blue-700">
                      {new Date(job.dateApplied).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              )}

              {job.applicationUrl && (
                <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <ExternalLink size={18} className="text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-purple-900 mb-1">Application Link</p>
                    <a
                      href={job.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-800 underline text-sm break-all transition-colors"
                    >
                      Open Application Portal
                    </a>
                  </div>
                </div>
              )}

              {job.contactPerson && (
                <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-100">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <User size={18} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-orange-900">Contact Person</p>
                    <p className="text-orange-700 text-sm">{job.contactPerson}</p>
                  </div>
                </div>
              )}
            </div>

            {/* AI Fit Score from Gemini */}
            {loadingFit ? (
              <div className="mb-6 text-sm text-gray-500">
                Analyzing resume vs job description...
              </div>
            ) : fit ? (
              <div className="mb-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Target size={18} className="text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-indigo-900">AI Match Analysis</h3>
                </div>
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-600">Fit Score:</span>
                    <span className={`text-xl font-bold ${getFitScoreColor(fit.fitScore)}`}>
                      {fit.fitScore}/100
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        fit.fitScore >= 80
                          ? "bg-green-500"
                          : fit.fitScore >= 60
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${fit.fitScore}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-indigo-700 text-sm leading-relaxed mt-2">{fit.summary}</p>

                {fit.matchedSkills?.length > 0 && (
                  <div className="mt-4">
                    <p className="text-green-700 font-semibold text-sm mb-1">
                      ✅ Matched Skills:
                    </p>
                    <ul className="text-green-700 text-sm list-disc list-inside">
                      {fit.matchedSkills.map((skill, i) => (
                        <li key={i}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {fit.missingSkills?.length > 0 && (
                  <div className="mt-4">
                    <p className="text-red-600 font-semibold text-sm mb-1">
                      ❌ Missing Skills:
                    </p>
                    <ul className="text-red-600 text-sm list-disc list-inside">
                      {fit.missingSkills.map((skill, i) => (
                        <li key={i}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-red-500 mb-6">No AI fit data available.</div>
            )}

            {/* Job Description */}
            {job.jobDescription && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <FileText size={20} className="text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Job Description</h3>
                </div>
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {job.jobDescription}
                  </p>
                </div>
              </div>
            )}

            {/* Notes */}
            {job.notes && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare size={20} className="text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Personal Notes</h3>
                </div>
                <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-100">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {job.notes}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPreviewModal;
