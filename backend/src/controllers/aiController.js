import { GoogleGenAI } from "@google/genai";
import User from "../models/User.js";
import Job from "../models/JobApplication.js";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const getFitScore = async (req, res) => {
  try {
    const { jobId, jobDescription } = req.body;
    const user = await User.findById(req.user._id);
    const job = await Job.findById(jobId);

    if (!user || !user.resumeText) {
      return res
        .status(400)
        .json({ message: "Resume not found. Please upload a resume first." });
    }

    if (job?.aiFit?.evaluated) {
      return res.json(job.aiFit);
    }

    const prompt = `
You're a job application AI. Given the following RESUME and JOB DESCRIPTION, analyze how well the resume fits the job.

Return a JSON object like this:
{
  "fitScore": 0-100 (integer),
  "summary": "short summary of match",
  "matchedSkills": [],
  "missingSkills": []
}

RESUME:
${user.resumeText}

JOB DESCRIPTION:
${jobDescription}
    `.trim();

    const result = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    const text = result.text;

    // Extract JSON from Gemini response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { fitScore: 0 };

    job.aiFit = {
      fitScore: parsed.fitScore || 0,
      summary: parsed.summary || "",
      matchedSkills: parsed.matchedSkills || [],
      missingSkills: parsed.missingSkills || [],
      evaluated: true,
    };
    await job.save();

    res.json(parsed);
  } catch (err) {
    console.error("Gemini Fit Score error:", err);
    res.status(500).json({ message: "Failed to evaluate fit score." });
  }
};
