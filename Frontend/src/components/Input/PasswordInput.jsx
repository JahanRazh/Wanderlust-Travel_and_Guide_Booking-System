import React from "react"; // Import the React library to create a React component.
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6"; // Import icons for eye and eye-slash from Font Awesome.

const PasswordInput = ({ value, onChange, placeholder }) => {
  // Define a functional component that receives props: value, onChange, and placeholder.

  const [isShowPassword, setIsShowPassword] = React.useState(false);
  // Declare a state variable `isShowPassword` and a function `setIsShowPassword` to toggle password visibility.
  // Initially set to `false` to hide the password.

  const togglePassword = () => {
    setIsShowPassword(!isShowPassword);
    // Toggle the state value between `true` and `false` to show or hide the password.
  };

  return (
    <div className="relative w-full mb-4">
      {/* A wrapper container for the input field and the icon button */}
      
      <input
        type={isShowPassword ? "text" : "password"}
        // The input type is dynamically set to "text" when the password is visible and "password" when hidden.
        value={value}
        // Sets the value of the input to the `value` prop.
        onChange={onChange}
        // Calls the `onChange` function passed as a prop when the input value changes.
        placeholder={placeholder || "Password"}
        // Sets the placeholder for the input. Defaults to "Password" if no placeholder is provided.
        className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
        // Styling classes for Tailwind CSS to style the input field.
      />
      
      <div
        className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
        // Positions the icon to the right of the input field.
        onClick={togglePassword}
        // Calls `togglePassword` when the icon is clicked.
      >
        {isShowPassword ? (
          <FaRegEye 
          // If the password is visible, show the open-eye icon.
          size={20} 
          className="text-current cursor-pointer" />
        ) : (
          <FaRegEyeSlash 
          // If the password is hidden, show the slashed-eye icon.
          size={20} 
          className="text-gray-600" />
        )}
      </div>
    </div>
  );
};

export default PasswordInput;
// Exports the PasswordInput component so it can be used in other files.
