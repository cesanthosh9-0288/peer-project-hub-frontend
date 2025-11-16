import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
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
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-80">
        <h1 className="text-2xl font-semibold mb-4 text-center">Peer Project Hub</h1>
        <p className="text-gray-600 text-center mb-6">Sign in to continue</p>

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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded font-semibold"
        >
          Login
        </button>

        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
      </div>
    </div>
  );
}