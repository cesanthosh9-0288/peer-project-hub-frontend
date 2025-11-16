import { useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      console.log("Firebase user:", firebaseUser);

      // Create user object with Firebase UID
      const userObj = {
        uid: firebaseUser.uid,  // Firebase UID
        username: firebaseUser.displayName || firebaseUser.email.split("@")[0],
        email: firebaseUser.email,
      };

      console.log("User object created:", userObj);

      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(userObj));
      console.log("Saved to localStorage");

      // Create user in backend database
      try {
        console.log("Sending POST /user...");
        const res = await axios.post("https://peer-project-hub-backend-seven.vercel.app/user", {
          userId: userObj.uid,
          username: userObj.username,
          email: userObj.email,
          bio: "No bio added yet",
        });
        console.log("✅ User created in database:", res.data);
      } catch (dbErr) {
        console.error("Database error:", dbErr.response?.data || dbErr.message);
        // Continue anyway - user is in localStorage
      }

      // Navigate to projects
      navigate("/projects", { state: { message: "Login Successful!" } });

    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed: " + err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-80">
        <h1 className="text-2xl font-semibold mb-4 text-center">Peer Project Hub</h1>
        <p className="text-gray-600 text-center mb-6">Sign in to continue</p>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded font-semibold flex items-center justify-center gap-2"
        >
          🔐 Sign in with Google
        </button>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
      </div>
    </div>
  );
}   