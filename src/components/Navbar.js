import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Navbar() {
  const navigate = useNavigate();

  // Firebase Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("user");
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">

        {/* Logo/Title */}
        <h1 className="text-2xl font-bold cursor-pointer" onClick={() => navigate("/projects")}>
          Peer Project Hub
        </h1>

        {/* Navigation Links */}
        <div className="flex gap-6 items-center">
          <button
            onClick={() => navigate("/projects")}
            className="hover:text-gray-200"
          >
            Projects
          </button>

          <Link to="/analytics" className="text-gray-700 hover:text-blue-600">
            📊 Analytics
          </Link>

          <button
            onClick={() => navigate("/favorites")}
            className="hover:text-gray-200"
          >
            ❤️ Favorites
          </button>

          <button
            onClick={() => navigate("/add")}
            className="bg-green-600 px-4 py-1 rounded hover:bg-green-700"
          >
            + Add Project
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-600 px-4 py-1 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>

      </div>
    </nav>
  );
}