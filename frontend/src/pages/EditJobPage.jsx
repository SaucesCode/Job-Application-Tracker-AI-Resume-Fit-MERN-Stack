import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

const EditJobPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [form, setForm] = useState({
    company: "",
    position: "",
    jobDescription: "",
    status: "saved",
    dateApplied: "",
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const job = res.data;
        setForm({
          company: job.company,
          position: job.position,
          jobDescription: job.jobDescription || "",
          status: job.status,
          dateApplied: job.dateApplied?.split("T")[0] || "",
        });
      } catch (err) {
        console.error("Error loading job:", err);
        navigate("/dashboard");
      }
    };

    fetchJob();
  }, [id]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.put(`/jobs/${id}`, form, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      navigate("/dashboard");
    } catch (err) {
      console.error("Error updating job:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Edit Job</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
          <input
            type="text"
            name="position"
            value={form.position}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
          <textarea
            name="jobDescription"
            value={form.jobDescription}
            onChange={handleChange}
            className="w-full border rounded p-2"
            rows="4"
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="saved">Saved</option>
            <option value="applied">Applied</option>
            <option value="interviewing">Interviewing</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>
          <input
            type="date"
            name="dateApplied"
            value={form.dateApplied}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditJobPage;
