import axios from "axios";
import { useEffect, useState } from "react";

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        console.log("📊 Loading analytics...");
        const res = await axios.get(
          "https://peer-project-hub-backend-seven.vercel.app/analytics"
        );
        console.log("✅ Analytics data:", res.data);
        setAnalytics(res.data.data);
      } catch (err) {
        console.error("❌ Error loading analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if (loading) return <p className="p-6 text-center">Loading analytics...</p>;
  if (!analytics) return <p className="p-6 text-center">Failed to load analytics</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">📊 Platform Analytics</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {/* Total Projects */}
        <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
          <h3 className="text-gray-600 text-sm font-semibold">Total Projects</h3>
          <p className="text-4xl font-bold text-blue-600">{analytics.totalProjects}</p>
        </div>

        {/* Total Users */}
        <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-600">
          <h3 className="text-gray-600 text-sm font-semibold">Total Users</h3>
          <p className="text-4xl font-bold text-green-600">{analytics.totalUsers}</p>
        </div>

        {/* Total Comments */}
        <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-600">
          <h3 className="text-gray-600 text-sm font-semibold">Total Comments</h3>
          <p className="text-4xl font-bold text-purple-600">{analytics.totalComments}</p>
        </div>

        {/* Total Likes */}
        <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-600">
          <h3 className="text-gray-600 text-sm font-semibold">Total Likes</h3>
          <p className="text-4xl font-bold text-red-600">{analytics.totalLikes}</p>
        </div>

        {/* Total Ratings */}
        <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-600">
          <h3 className="text-gray-600 text-sm font-semibold">Total Ratings</h3>
          <p className="text-4xl font-bold text-yellow-600">{analytics.totalRatings}</p>
        </div>

        {/* Total Favorites */}
        <div className="bg-pink-50 p-6 rounded-lg border-l-4 border-pink-600">
          <h3 className="text-gray-600 text-sm font-semibold">Total Favorites</h3>
          <p className="text-4xl font-bold text-pink-600">{analytics.totalFavorites}</p>
        </div>
      </div>

      {/* Featured Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Most Liked Project */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-300">
          <h2 className="text-xl font-bold mb-4">🔥 Most Liked Project</h2>
          {analytics.mostLikedProject && analytics.mostLikedProject.projectDetails.length > 0 ? (
            <div>
              <p className="text-sm text-gray-600">Project:</p>
              <p className="text-lg font-semibold mb-2">
                {analytics.mostLikedProject.projectDetails[0].title}
              </p>
              <p className="text-sm text-gray-600">Description:</p>
              <p className="text-gray-700 mb-3">
                {analytics.mostLikedProject.projectDetails[0].description}
              </p>
              <p className="text-2xl font-bold text-red-600">
                👍 {analytics.mostLikedProject.likeCount} Likes
              </p>
            </div>
          ) : (
            <p className="text-gray-500">No likes yet</p>
          )}
        </div>

        {/* Most Rated Project */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-300">
          <h2 className="text-xl font-bold mb-4">⭐ Most Rated Project</h2>
          {analytics.mostRatedProject && analytics.mostRatedProject.projectDetails.length > 0 ? (
            <div>
              <p className="text-sm text-gray-600">Project:</p>
              <p className="text-lg font-semibold mb-2">
                {analytics.mostRatedProject.projectDetails[0].title}
              </p>
              <p className="text-sm text-gray-600">Description:</p>
              <p className="text-gray-700 mb-3">
                {analytics.mostRatedProject.projectDetails[0].description}
              </p>
              <div className="flex items-center gap-3">
                <p className="text-2xl font-bold text-yellow-600">
                  {analytics.mostRatedProject.avgRating.toFixed(1)} ⭐
                </p>
                <p className="text-gray-600">
                  ({analytics.mostRatedProject.count} ratings)
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No ratings yet</p>
          )}
        </div>
      </div>
    </div>
  );
}