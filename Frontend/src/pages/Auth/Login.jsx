import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../../components/Input/PasswordInput";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }

    if (!password) {
      setError("Please enter a password");
      return;
    }

    setError("");
    setLoading(true);

    // Login API Call
    try {
      const response = await axiosInstance.post("/login", {
        email: email,
        password: password,
      });

      // Handle success login response
      if (response.data && response.data.accessToken) {
        console.log("Login successful, token:", response.data.accessToken);
        localStorage.setItem("token", response.data.accessToken);

        // Check if the user is an admin
        if (email === "admin@wanderlust.com" && password === "Admin") {
          console.log("Admin detected, navigating to /admindashboard");
          navigate("/admindashboard"); // Use absolute path
        } else {
          console.log("Regular user, navigating to /home");
          navigate("/home"); // Navigate to home page for regular users
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-cyan-50 overflow-hidden relative">
      <div className="login-ui-box right-10 -top-40" />
      <div className="login-ui-box" />
      <div className="login-ui-box bg-cyan-200 -bottom-40 right-1/2" />
      <div className="container h-screen flex justify-center items-center px-20 mx-auto">
        {/* Left Side: Background Image and Text */}
        <div className="w-2/4 h-[90vh] flex items-end bg-login-bg-img bg-cover bg-center rounded-lg shadow-lg p-10 z-50 relative">
          <div className="absolute top-10 left-10 text-white">
            <h4 className="text-4xl font-bold mb-4">
              Capture Your <br />
              Journeys
            </h4>
            <p className="text-[15px] text-white leading-6 pr-6 mt-4">
              <br />
              Record your travel experiences and memories in your personal
              travel journal. Share your travel stories with the world.
            </p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-2/4 p-10 bg-white rounded-lg shadow-lg z-50">
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl font-semibold mb-7">Login</h4>

            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={({ target }) => {
                setEmail(target.value);
              }}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <br />
            <PasswordInput
              value={password}
              onChange={({ target }) => {
                setPassword(target.value);
              }}
            />
            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
            <br />
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="text sm text-gray-500 text-center my-4">Or</p>

            <button
              type="button"
              className="btn-light btn-primary"
              onClick={() => navigate("/signup")}
            >
              CREATE ACCOUNT
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;