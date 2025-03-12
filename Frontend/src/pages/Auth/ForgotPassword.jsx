// Create a new file: ForgotPassword.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("/forgot-password", {
        email: email
      });

      if (response.data && !response.data.error) {
        setSuccess("Password reset link sent to your email");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
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
        <div className="w-full max-w-md p-10 bg-white rounded-lg shadow-lg z-50">
          <form onSubmit={handleSubmit}>
            <h4 className="text-2xl font-semibold mb-7">Reset Password</h4>
            <p className="text-gray-600 mb-6">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            
            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
            {success && <p className="text-green-500 text-xs pb-1">{success}</p>}
            
            <button type="submit" className="btn-primary w-full mt-4" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <div className="text-center mt-6">
              <button
                type="button"
                className="text-cyan-600 hover:underline"
                onClick={() => navigate("/login")}
              >
                Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;