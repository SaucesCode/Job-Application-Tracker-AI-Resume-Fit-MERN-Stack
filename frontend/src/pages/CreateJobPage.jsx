import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

const CreateJobPage = () => {
  const navigate = useNavigate();
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

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post("/jobs", form, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating job:", error.response?.data || error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Add New Job Application</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="company"
            placeholder="Company Name"
            value={form.company}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
          <input
            type="text"
            name="position"
            placeholder="Job Title / Position"
            value={form.position}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
          <textarea
            name="jobDescription"
            placeholder="Job Description (optional)"
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
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Save Job
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateJobPage;
