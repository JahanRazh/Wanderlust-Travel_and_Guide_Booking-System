import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PasswordInput from "../../components/Input/PasswordInput";
import axiosInstance from "../../utils/axiosInstance";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();

  // Debugging: Log the token from the URL
  useEffect(() => {
    console.log("Token from URL:", token);
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setError("Please enter both password fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long"); // Minimum password length requirement
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter"); // Ensure uppercase letter
      return;
    }

    if (!/[a-z]/.test(password)) {
      setError("Password must contain at least one lowercase letter"); // Ensure lowercase letter
      return;
    }

    if (!/[0-9]/.test(password)) {
      setError("Password must contain at least one number"); // Ensure at least one number
      return;
    }

    if (!/[!@#$%^&*]/.test(password)) {
      setError("Password must contain at least one special character (!@#$%^&*)"); // Ensure special character
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("/reset-password", {
        token,
        newPassword: password,
      });

      if (response.data && !response.data.error) {
        setSuccess("Password reset successful");

        // Save the new token if returned
        if (response.data.accessToken) {
          localStorage.setItem("token", response.data.accessToken);
        }

        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/home");
        }, 2000);
      }
    } catch (error) {
      console.error("Reset password error:", error);
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
            <h4 className="text-2xl font-semibold mb-7">Reset Your Password</h4>
            <p className="text-gray-600 mb-6">
              Please enter your new password below.
            </p>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <PasswordInput
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <PasswordInput
                value={confirmPassword}
                onChange={({ target }) => setConfirmPassword(target.value)}
              />
            </div>

            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
            {success && <p className="text-green-500 text-xs pb-1">{success}</p>}

            <button type="submit" className="btn-primary w-full mt-4" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;