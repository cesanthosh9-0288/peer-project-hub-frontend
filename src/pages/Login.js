import { useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Simple Login (fallback)
  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await axios.post("https://peer-project-hub-backend-seven.vercel.app/login", {
        username: user,
        password: pass,
      });

      if (res.data === true) {
        const userObj = {
          uid: Date.now().toString(),
          username: user,
          email: user + "@example.com",
        };

        localStorage.setItem("user", JSON.stringify(userObj));
        navigate("/projects");
      } else {
        setError("Invalid credentials!");
      }
    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      console.log("✅ Google login successful:", firebaseUser.email);

      const userObj = {
        uid: firebaseUser.uid,
        username: firebaseUser.displayName || firebaseUser.email.split("@")[0],
        email: firebaseUser.email,
      };

      localStorage.setItem("user", JSON.stringify(userObj));
      console.log("✅ User saved to localStorage");

      // Try to create user in backend (optional)
      try {
        await axios.post("https://peer-project-hub-backend-seven.vercel.app/user", {
          userId: userObj.uid,
          username: userObj.username,
          email: userObj.email,
          bio: "No bio added yet",
        });
        console.log("✅ User created in backend");
      } catch (err) {
        console.log("⚠️ Backend user creation failed (non-critical)");
      }

      navigate("/projects");
    } catch (err) {
      console.error("❌ Google login error:", err);
      setError(err.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-80">
        <h1 className="text-2xl font-semibold mb-4 text-center">Peer Project Hub</h1>
        <p className="text-gray-600 text-center mb-6">Sign in to continue</p>

        {/* Google Sign-In Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-3 rounded font-semibold mb-4 flex items-center justify-center gap-2"
        >
          🔐 {loading ? "Loading..." : "Sign in with Google"}
        </button>

        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or use demo account</span>
          </div>
        </div>

        {/* Simple Login (Demo) */}
        <input
          className="border p-2 mb-3 w-full rounded"
          placeholder="Username (San)"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />

        <input
          className="border p-2 mb-3 w-full rounded"
          type="password"
          placeholder="Password (test1234)"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white p-3 rounded font-semibold"
        >
          {loading ? "Loading..." : "Demo Login"}
        </button>

        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

        {/* Demo Credentials */}
        <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-600">
          <p className="font-semibold mb-1">Demo Account:</p>
          <p>Username: San</p>
          <p>Password: test1234</p>
        </div>
      </div>
    </div>
  );
}