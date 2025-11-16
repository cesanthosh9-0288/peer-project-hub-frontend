import React, { useState } from "react";
import axios from "axios";

export default function AddProject() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    tags: "",
    link: "",
    live: "",
    authorName: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("=== ADD PROJECT SUBMISSION ===");
    console.log("Form data:", form);

    // Validate all required fields
    if (!form.title.trim() || !form.description.trim() || !form.link.trim() || !form.authorName.trim()) {
      console.error("❌ Validation failed: Missing required fields");
      alert("Please fill all required fields (Title, Description, GitHub Link, Author Name)");
      return;
    }

    const payload = {
      title: form.title,
      description: form.description,
      tags: form.tags.split(",").map(t => t.trim()).filter(t => t),
      link: form.link,
      live: form.live,
      authorName: form.authorName,
    };

    console.log("✅ Validation passed");
    console.log("📤 Payload to send:", payload);

    try {
      console.log("📡 Sending POST to: https://peer-project-hub-backend-seven.vercel.app/addproject");
      
      const res = await axios.post("https://peer-project-hub-backend-seven.vercel.app/addproject", payload);
      
      console.log("✅ Response received:", res.data);

      if (res.data.success) {
        console.log("✅ Project added successfully!");
        alert("Project Added!");
        window.location.href = "/projects";
      } else {
        console.error("❌ Backend returned success: false");
        console.error("Response data:", res.data);
        alert("Failed to add project: " + res.data.data);
      }
    } catch (err) {
      console.error("❌ ERROR:", err);
      console.error("Error message:", err.message);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      alert("Server error: " + (err.response?.data?.data || err.message));
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add New Project</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Project Title - REQUIRED */}
        <div>
          <label className="block text-sm font-semibold mb-1">Project Title *</label>
          <input
            type="text"
            name="title"
            placeholder="e.g., Chat Application"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            value={form.title}
            required
          />
        </div>

        {/* Project Description - REQUIRED */}
        <div>
          <label className="block text-sm font-semibold mb-1">Description *</label>
          <textarea
            name="description"
            placeholder="Describe your project..."
            className="w-full p-2 border rounded"
            onChange={handleChange}
            value={form.description}
            required
          />
        </div>

        {/* Project Tags */}
        <div>
          <label className="block text-sm font-semibold mb-1">Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            placeholder="e.g., React, Node.js, MongoDB"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            value={form.tags}
          />
        </div>

        {/* GitHub Link - REQUIRED */}
        <div>
          <label className="block text-sm font-semibold mb-1">GitHub Link *</label>
          <input
            type="text"
            name="link"
            placeholder="https://github.com/..."
            className="w-full p-2 border rounded"
            onChange={handleChange}
            value={form.link}
            required
          />
        </div>

        {/* Live Demo Link */}
        <div>
          <label className="block text-sm font-semibold mb-1">Live Demo Link</label>
          <input
            type="text"
            name="live"
            placeholder="https://demo.com"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            value={form.live}
          />
        </div>

        {/* Author Name - REQUIRED */}
        <div>
          <label className="block text-sm font-semibold mb-1">Your Name *</label>
          <input
            type="text"
            name="authorName"
            placeholder="e.g., John Doe"
            className="w-full p-2 border rounded"
            onChange={handleChange}
            value={form.authorName}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700"
        >
          Add Project
        </button>

      </form>
    </div>
  );
}