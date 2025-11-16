import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    tags: "",
    link: "",
    live: "",
  });

  // Load project by ID
  useEffect(() => {
    axios.get(`https://peer-project-hub-backend-seven.vercel.app/project/${id}`).then((res) => {
      const data = res.data;
      setForm({
        title: data.title,
        description: data.description,
        tags: data.tags.join(","), // Convert array -> CSV
        link: data.link,
        live: data.live,
      });
    });
  }, [id]);

  // Update Project
  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .put(`https://peer-project-hub-backend-seven.vercel.app/project/${id}`, {
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()), // Convert CSV -> array
      })
      .then(() => {
        alert("Project Updated!");
        navigate("/projects");
      });
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Edit Project</h1>

      <form onSubmit={handleSubmit}>
        <input
          className="p-2 border w-full mb-3"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          className="p-2 border w-full mb-3"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          className="p-2 border w-full mb-3"
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
        />

        <input
          className="p-2 border w-full mb-3"
          placeholder="Code Link"
          value={form.link}
          onChange={(e) => setForm({ ...form, link: e.target.value })}
        />

        <input
          className="p-2 border w-full mb-3"
          placeholder="Live Link"
          value={form.live}
          onChange={(e) => setForm({ ...form, live: e.target.value })}
        />

        <button className="bg-blue-500 text-white px-6 py-2 rounded">
          Update
        </button>
      </form>
    </div>
  );
}
