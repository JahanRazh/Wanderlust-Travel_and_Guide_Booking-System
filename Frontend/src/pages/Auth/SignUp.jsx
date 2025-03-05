import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../../components/Input/PasswordInput";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

const SignUp = () => {
  // State hooks for form fields, error messages, and loading status
  const [name, setName] = useState(""); // Holds the user's name
  const [email, setEmail] = useState(""); // Holds the user's email
  const [password, setPassword] = useState(""); // Holds the user's password
  const [error, setError] = useState(null); // Stores error messages for validation or API issues
  const [loading, setLoading] = useState(false); // Indicates if the form is submitting
  const navigate = useNavigate(); // Navigation hook from react-router-dom

  // Handle the form submission
  const handleSignup = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Basic form validation
    if (!name) {
      setError("Please enter a valid name"); // Show error if name is empty
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email"); // Show error if email is invalid
      return;
    }

    if (!password) {
      setError("Please enter a valid password"); // Show error if password is empty
      return;
    }

    setError(""); // Clear any previous errors
    setLoading(true); // Set loading state to true during API call

    // Signup API Call
    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: name, // Use 'name' instead of 'fullName'
        email: email,
        password: password,
      });
      // Handle success login response
      if (response.data && response.data.accessToken) {
        // Store the access token in local storage
        localStorage.setItem("token", response.data.accessToken);
        // Navigate to the dashboard upon successful signup
        navigate("/dashboard");
      }
    } catch (error) {
      // Handle error scenarios
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message); // Show API error message
      } else {
        setError("Something went wrong. Please try again later."); // Show generic error
      }
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="h-screen bg-cyan-50 overflow-hidden relative">
      {/* Decorative UI boxes for background design */}
      <div className="login-ui-box right-10 -top-40" />
      <div className="login-ui-box" />
      <div className="login-ui-box bg-cyan-200 -bottom-40 right-1/2" />

      {/* Main container for signup form */}
      <div className="container h-screen flex justify-center items-center px-20 mx-auto">
        {/* Left Side: Background Image and Text */}
        <div className="w-2/4 h-[90vh] flex items-end bg-Signup-bg-img bg-cover bg-center rounded-lg shadow-lg p-10 z-50 relative">
          <div className="absolute top-10 left-10 text-white">
            <h4 className="text-4xl font-bold mb-4">
              Capture Your <br /> Journeys
            </h4>
            <p className="text-[15px] text-white leading-6 pr-6 mt-4">
              <br />
              Record your travel experiences and memories in your personal
              travel journal. Share your travel stories with the world.
            </p>
          </div>
        </div>

        {/* Right Side: Signup Form */}
        <div className="w-2/4 p-10 bg-white rounded-lg shadow-lg z-50">
          <form onSubmit={handleSignup}>
            <h4 className="text-2xl font-semibold mb-7">SignUp</h4>

            {/* Input for Full Name */}
            <label htmlFor="fullName" className="sr-only">
              Full Name
            </label>
            <input
              id="fullName"         // Unique identifier for the input field
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={({ target }) => {         // Update the name state when the input value changes
                setName(target.value);       //Update the name state when the input value changes
              }}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <br />

            {/* Input for Email */}
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

            {/* Password Input Component */}
            <PasswordInput
              value={password}
              onChange={({ target }) => {
                setPassword(target.value);
              }}
            />

            {/* Error Message Display */}
            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
            <br />

            {/* Submit Button */}
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Creating account..." : "CREATE ACCOUNT"}
            </button>

            <p className="text sm text-gray-500 text-center my-4">Or</p>

            {/* Navigate to Login Page */}
            <button
              type="button"
              className="btn-light btn-primary"
              onClick={() => navigate("/login")}
            >
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
