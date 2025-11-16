import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);

  // State for comments
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // State for favorites
  const [isFavorited, setIsFavorited] = useState(false);

  // State for ratings
  const [userRating, setUserRating] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);

  // State for likes
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // Fetch comments from backend
  const loadComments = () => {
    axios.get(`https://peer-project-hub-backend-seven.vercel.app/comment/${id}`)
      .then(res => setComments(res.data))
      .catch(err => console.log("Error loading comments:", err));
  };

  // Fetch project details from backend
  const loadProject = async () => {
    try {
      const res = await axios.get(`https://peer-project-hub-backend-seven.vercel.app/project/${id}`);
      setProject(res.data);
    } catch (err) {
      console.log("Error fetching project", err);
    }
  };

  // Check if project is favorited by current user
  const checkFavoriteStatus = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    axios.get(`https://peer-project-hub-backend-seven.vercel.app/favorite/check/${id}/${user.uid}`)
      .then(res => setIsFavorited(res.data.isFavorited))
      .catch(err => console.log("Error checking favorite:", err));
  };

  // Load ratings for the project
  const loadRatings = () => {
    axios.get(`https://peer-project-hub-backend-seven.vercel.app/rating/${id}`)
      .then(res => {
        setAvgRating(res.data.avgRating);
        setTotalRatings(res.data.totalRatings);
        checkUserRating();
      })
      .catch(err => console.log("Error loading ratings:", err));
  };

  // Check user's existing rating
  const checkUserRating = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    axios.get(`https://peer-project-hub-backend-seven.vercel.app/rating/check/${id}/${user.uid}`)
      .then(res => setUserRating(res.data.rating))
      .catch(err => console.log("Error checking user rating:", err));
  };

  // Load likes for the project
  const loadLikes = () => {
    axios.get(`https://peer-project-hub-backend-seven.vercel.app/like/${id}`)
      .then(res => {
        setLikeCount(res.data.likeCount);
        checkUserLike();
      })
      .catch(err => console.log("Error loading likes:", err));
  };

  // Check if user liked the project
  const checkUserLike = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    axios.get(`https://peer-project-hub-backend-seven.vercel.app/like/check/${id}/${user.uid}`)
      .then(res => setIsLiked(res.data.isLiked))
      .catch(err => console.log("Error checking user like:", err));
  };

  // Load project on component mount
  useEffect(() => {
    loadProject();
    checkFavoriteStatus();
    loadRatings();
    loadLikes();
  }, []);

  // Load comments when project ID is available
  useEffect(() => {
    loadComments();
  }, [id]);

  // Handle favorite/unfavorite
  const handleFavorite = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Please login to bookmark projects.");
      return;
    }

    if (isFavorited) {
      axios.delete(`https://peer-project-hub-backend-seven.vercel.app/favorite/${id}/${user.uid}`)
        .then(() => {
          setIsFavorited(false);
          alert("Removed from favorites!");
        })
        .catch(err => console.log("Error removing favorite:", err));
    } else {
      axios.post("https://peer-project-hub-backend-seven.vercel.app/favorite", {
        projectId: id,
        userId: user.uid,
      })
        .then(() => {
          setIsFavorited(true);
          alert("Added to favorites!");
        })
        .catch(err => console.log("Error adding favorite:", err));
    }
  };

  // Handle rating submission
  const handleRating = (stars) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Please login to rate projects.");
      return;
    }

    axios.post("https://peer-project-hub-backend-seven.vercel.app/rating", {
      projectId: id,
      userId: user.uid,
      rating: stars,
    })
      .then(() => {
        setUserRating(stars);
        loadRatings();
        alert("Rating submitted!");
      })
      .catch(err => console.log("Error submitting rating:", err));
  };

  // Handle like/unlike
  const handleLike = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Please login to like projects.");
      return;
    }

    axios.post("https://peer-project-hub-backend-seven.vercel.app/like", {
      projectId: id,
      userId: user.uid,
    })
      .then(() => {
        loadLikes(); // Refresh like count
        alert(isLiked ? "Like removed!" : "Project liked!");
      })
      .catch(err => console.log("Error liking project:", err));
  };

  // Handle comment submission
  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Please login to post a comment.");
      return;
    }

    axios.post("https://peer-project-hub-backend-seven.vercel.app/comment", {
      projectId: id,
      userId: user.uid || "anonymous",
      username: user.email || user.username || "Anonymous User",
      text: newComment,
    })
      .then((res) => {
        console.log("Comment posted successfully:", res.data);
        alert("Comment posted!");
        setNewComment("");
        loadComments();
      })
      .catch((err) => {
        console.error("Error posting comment:", err.response?.data || err.message);
        alert("Failed to post comment");
      });
  };

  // Star rating component
  const StarRating = ({ value, onRate }) => {
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onRate(star)}
            className={`text-3xl cursor-pointer ${
              star <= value ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  if (!project) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-bold">{project.title}</h1>
          <p className="mt-3 text-gray-700">{project.description}</p>
        </div>

        {/* Action Buttons - Favorite & Like */}
        <div className="flex gap-2">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`px-4 py-2 rounded text-white font-semibold flex items-center gap-2 ${
              isLiked ? "bg-red-500" : "bg-gray-400"
            }`}
          >
            👍 {likeCount}
          </button>

          {/* Favorite Button */}
          <button
            onClick={handleFavorite}
            className={`px-4 py-2 rounded text-white font-semibold ${
              isFavorited ? "bg-red-600" : "bg-gray-400"
            }`}
          >
            {isFavorited ? "❤️ Favorited" : "🤍 Favorite"}
          </button>
        </div>
      </div>

      <p className="mt-3"><strong>Tags:</strong> {project.tags?.join(", ")}</p>

      {/* GitHub link */}
      <p className="mt-3">
        <strong>GitHub:</strong>{" "}
        <a className="text-blue-600 underline" href={project.link} target="_blank" rel="noreferrer">
          {project.link}
        </a>
      </p>

      {/* Live demo link */}
      <p className="mt-1">
        <strong>Live:</strong>{" "}
        <a className="text-blue-600 underline" href={project.live} target="_blank" rel="noreferrer">
          {project.live || "No live link"}
        </a>
      </p>

      <hr className="my-4" />

      {/* Rating Section */}
      <div className="mt-6 p-4 bg-gray-50 rounded">
        <h2 className="text-lg font-bold mb-2">⭐ Project Rating</h2>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Average: <span className="font-bold text-yellow-500">{avgRating}</span> / 5 
            <span className="text-gray-500 ml-2">({totalRatings} ratings)</span>
          </p>
        </div>

        <p className="text-sm font-semibold mb-2">Your Rating:</p>
        <StarRating value={userRating} onRate={handleRating} />
      </div>

      <hr className="my-4" />

      {/* Comments Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Comments</h2>

        <textarea
          className="w-full border p-2 rounded mb-2"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />

        <button
          className="bg-green-600 text-white px-4 py-1 rounded"
          onClick={handleSubmitComment}
        >
          Post Comment
        </button>

        <div className="mt-4 space-y-3">
          {comments.map(c => (
            <div key={c._id} className="border p-3 rounded">
              <p className="font-semibold">{c.username}</p>
              <p>{c.text}</p>
              <p className="text-xs text-gray-500">
                {new Date(c.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}