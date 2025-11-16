import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load user's favorited projects
  const loadFavorites = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Please login to view favorites.");
      navigate("/login");
      return;
    }

    axios.get(`https://peer-project-hub-backend-seven.vercel.app/favorite/${user.uid}`)
      .then(res => {
        // Extract project data from favorites
        const projects = res.data.map(fav => fav.projectId);
        setFavorites(projects);
      })
      .catch(err => console.log("Error loading favorites:", err))
      .finally(() => setLoading(false));
  };

  // Remove from favorites
  const handleRemove = async (projectId) => {
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      await axios.delete(`https://peer-project-hub-backend-seven.vercel.app/favorite/${projectId}/${user.uid}`);
      // Refresh favorites list
      loadFavorites();
      alert("Removed from favorites!");
    } catch (err) {
      alert("Failed to remove");
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Favorites</h1>

      {favorites.length === 0 ? (
        <p className="text-gray-500">No favorited projects yet.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">Title</th>
              <th className="text-left">Description</th>
              <th className="text-left">Tags</th>
              <th className="text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {favorites.map((p) => (
              <tr key={p._id} className="border-b hover:bg-gray-100">

                <td
                  className="p-3 text-blue-600 cursor-pointer underline"
                  onClick={() => navigate(`/projects/${p._id}`)}
                >
                  {p.title}
                </td>

                <td>{p.description}</td>
                <td>{Array.isArray(p.tags) ? p.tags.join(", ") : ""}</td>

                <td className="p-3 flex gap-2">
                  {/* View */}
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                    onClick={() => navigate(`/projects/${p._id}`)}
                  >
                    View
                  </button>

                  {/* Remove from favorites */}
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => handleRemove(p._id)}
                  >
                    Remove
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}