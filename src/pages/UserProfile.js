import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user profile
  const loadUserProfile = async () => {
    try {
      const res = await axios.get(`https://peer-project-hub-backend-seven.vercel.app/user/${userId}`);
      setUser(res.data);
    } catch (err) {
      console.log("Error loading user profile:", err);
    }
  };

  // Fetch user's projects
  const loadUserProjects = async () => {
    try {
      const res = await axios.get(`https://peer-project-hub-backend-seven.vercel.app/user/${userId}/projects`);
      setProjects(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log("Error loading user projects:", err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserProfile();
    loadUserProjects();
  }, [userId]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!user) return <p className="p-6">User not found</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      
      {/* User Info Section */}
      <div className="bg-blue-50 p-6 rounded border-l-4 border-blue-600 mb-6">
        <h1 className="text-3xl font-bold">{user.username}</h1>
        <p className="text-gray-600 mt-1">{user.email}</p>
        <p className="text-gray-700 mt-3 italic">"{user.bio}"</p>
      </div>

      <hr className="my-6" />

      {/* User's Projects Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Projects by {user.username} ({projects.length})
        </h2>

        {projects.length === 0 ? (
          <p className="text-gray-500">This user has no projects yet.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 text-left">Title</th>
                <th className="text-left">Description</th>
                <th className="text-left">Tags</th>
                <th className="text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {projects.map((p) => (
                <tr key={p._id} className="border-b hover:bg-gray-100">
                  <td className="p-3 text-blue-600 cursor-pointer underline"
                    onClick={() => navigate(`/projects/${p._id}`)}
                  >
                    {p.title}
                  </td>
                  <td>{p.description}</td>
                  <td>{Array.isArray(p.tags) ? p.tags.join(", ") : ""}</td>
                  <td className="p-3">
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                      onClick={() => navigate(`/projects/${p._id}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}