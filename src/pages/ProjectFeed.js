import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProjectFeed() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);

  // Search & filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterValue, setFilterValue] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(5); // Show 5 projects per page

  const navigate = useNavigate();

  // Load all projects from backend
  const loadData = async () => {
    try {
      const res = await axios.get("https://peer-project-hub-backend-seven.vercel.app/projects");
      setProjects(Array.isArray(res.data) ? res.data : []);
      setFilteredProjects(Array.isArray(res.data) ? res.data : []);
      setCurrentPage(1); // Reset to page 1 when loading
    } catch (err) {
      console.log("Error fetching projects:", err);
      setProjects([]);
      setFilteredProjects([]);
    }
  };

  // Apply search & filter logic
  const applyFilters = () => {
    let filtered = projects;

    // Filter by search query (title or description)
    if (searchQuery.trim()) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by tag
    if (filterType === "tag" && filterValue.trim()) {
      filtered = filtered.filter(p =>
        Array.isArray(p.tags) && p.tags.some(tag =>
          tag.toLowerCase().includes(filterValue.toLowerCase())
        )
      );
    }

    setFilteredProjects(filtered);
    setCurrentPage(1); // Reset to page 1 when filtering
  };

  // Calculate pagination values
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const startIndex = (currentPage - 1) * projectsPerPage;
  const endIndex = startIndex + projectsPerPage;
  const currentProjects = filteredProjects.slice(startIndex, endIndex);

  // Trigger filter whenever search or filter values change
  useEffect(() => {
    applyFilters();
  }, [searchQuery, filterType, filterValue, projects]);

  // Delete project
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await axios.delete(`https://peer-project-hub-backend-seven.vercel.app/project/${id}`);
        loadData();
      } catch (err) {
        alert("Delete failed!");
      }
    }
  };

  // Edit project page
  const handleEdit = (id) => {
    navigate(`/editproject/${id}`);
  };

  // Navigate to Add Project page
  const handleAddProject = () => {
    navigate("/add");
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-6">

      {/* --------- Top Bar --------- */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">All Projects</h1>

        <button
          onClick={handleAddProject}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Add Project
        </button>
      </div>

      {/* --------- Search & Filter Bar --------- */}
      <div className="mb-6 p-4 bg-gray-50 rounded border">

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by title or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        {/* Filter Type Selector */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1">Filter By:</label>
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setFilterValue("");
              }}
              className="w-full p-2 border rounded"
            >
              <option value="all">All Projects</option>
              <option value="tag">By Tag</option>
            </select>
          </div>

          {/* Filter Value Input */}
          {filterType !== "all" && (
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">
                {filterType === "tag" ? "Enter Tag:" : "Enter Username:"}
              </label>
              <input
                type="text"
                placeholder={filterType === "tag" ? "e.g., React, MongoDB" : "e.g., John"}
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          )}
        </div>

        {/* Results count and pagination info */}
        <p className="text-sm text-gray-600 mt-2">
          Found {filteredProjects.length} project(s) |
          Page {currentPage} of {totalPages || 1}
        </p>
      </div>

      {/* --------- Project Table --------- */}
      {filteredProjects.length === 0 ? (
        <p className="text-gray-500">No projects found.</p>
      ) : (
        <>
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
              {/* Display only current page projects */}
              {currentProjects.map((p) => (
                <tr key={p._id} className="border-b hover:bg-gray-100">

                  {/* Project Title - Click to view details */}
                  <td
                    className="p-3 text-blue-600 cursor-pointer underline"
                    onClick={() => navigate(`/projects/${p._id}`)}
                  >
                    {p.title}
                  </td>

                  {/* Project Description */}
                  <td>{p.description}</td>

                  {/* Project Tags */}
                  <td>{Array.isArray(p.tags) ? p.tags.join(", ") : ""}</td>

                  {/* Action Buttons */}
                  <td className="p-3 flex gap-2">
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                      onClick={() => handleEdit(p._id)}
                    >
                      Edit
                    </button>

                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() => handleDelete(p._id)}
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

          {/* --------- Pagination Controls --------- */}
          <div className="mt-6 flex justify-center gap-2">
            {/* Previous Button */}
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${currentPage === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
            >
              Previous
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded ${currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                  }`}
              >
                {page}
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${currentPage === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}