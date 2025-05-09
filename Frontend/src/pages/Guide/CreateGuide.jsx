import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const CreateGuide = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const existingData = location.state || {};

  const [formData, setFormData] = useState({
    fullname: "",
    age: "",
    dateOfBirth: "",
    gender: "",
    contactNumber: "",
    email: "",
    address: "",
    about: "",
    workExperience: "",
    profilePic: "",
  });

  const [errors, setErrors] = useState({
    fullname: "",
    age: "",
    dateOfBirth: "",
    gender: "",
    contactNumber: "",
    email: "",
    address: "",
    about: "",
    workExperience: "",
  });

  const [touched, setTouched] = useState({
    fullname: false,
    age: false,
    dateOfBirth: false,
    gender: false,
    contactNumber: false,
    email: false,
    address: false,
    about: false,
    workExperience: false,
  });

  useEffect(() => {
    if (existingData.fullname) {
      setFormData(existingData);
    }
  }, [existingData]);

  const validateField = (name, value) => {
    let error = "";
    
    switch (name) {
      case "fullname":
        if (!value.trim()) error = "Full name is required";
        else if (value.length < 3) error = "Name must be at least 3 characters";
        break;
      case "age":
        if (!value) error = "Age is required";
        else if (isNaN(value)) error = "Age must be a number";
        else if (value < 18) error = "Must be at least 18 years old";
        else if (value > 100) error = "Age must be realistic";
        break;
      case "dateOfBirth":
        if (!value) error = "Date of birth is required";
        else {
          const dob = new Date(value);
          const today = new Date();
          const age = today.getFullYear() - dob.getFullYear();
          if (age < 18) error = "Must be at least 18 years old";
        }
        break;
      case "gender":
        if (!value) error = "Gender is required";
        break;
      case "contactNumber":
        if (!value) error = "Contact number is required";
        else if (!/^\d{10}$/.test(value)) error = "Must be 10 digits";
        break;
      case "email":
        if (!value) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) 
          error = "Invalid email format";
        break;
      case "address":
        if (!value.trim()) error = "Address is required";
        else if (value.length < 10) error = "Address too short";
        break;
      case "about":
        if (!value.trim()) error = "About is required";
        else if (value.length < 20) error = "Please write at least 20 characters";
        break;
      case "workExperience":
        if (!value) error = "Experience is required";
        else if (isNaN(value)) error = "Must be a number";
        else if (value < 0) error = "Cannot be negative";
        else if (value > 50) error = "Experience seems unrealistic";
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    const error = validateField(name, formData[name]);
    setErrors({ ...errors, [name]: error });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Validate field if it's been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors({ ...errors, [name]: error });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.match("image.*")) {
      alert("Please select an image file");
      return;
    }
    

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, profilePic: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      if (key !== "profilePic") {
        const error = validateField(key, formData[key]);
        newErrors[key] = error;
        if (error) isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const existingGuides = JSON.parse(localStorage.getItem("guideProfiles")) || [];

    // Check if editing (via email match), then update
    const updatedGuides = existingGuides.filter(g => g.email !== formData.email);
    updatedGuides.push(formData);

    localStorage.setItem("guideProfiles", JSON.stringify(updatedGuides));

    
    // Mark all fields as touched to show errors
    const allTouched = {};
    Object.keys(touched).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    if (validateForm()) {
      localStorage.setItem("guideProfile", JSON.stringify(formData));
      alert(
        existingData.fullname 
          ? "Profile updated successfully!" 
          : "Profile created successfully!"
      );
      navigate("/guideprofile");
    }
  };

  const isFormValid = () => {
    return (
      formData.fullname &&
      formData.age &&
      formData.dateOfBirth &&
      formData.gender &&
      formData.contactNumber &&
      formData.email &&
      formData.address &&
      formData.workExperience &&
      formData.about &&
      Object.values(errors).every(error => !error)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Guide Profile</h2>
          <p className="mt-2 text-sm text-gray-600">
            {existingData.fullname ? "Update your profile information" : "Create your guide profile"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Full Name */}
            <div>
              <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-1 block w-full border ${
                  errors.fullname && touched.fullname ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                required
              />
              {errors.fullname && touched.fullname && (
                <p className="mt-1 text-sm text-red-600">{errors.fullname}</p>
              )}
            </div>

            {/* Age */}
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                Age *
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                onBlur={handleBlur}
                min="18"
                max="100"
                className={`mt-1 block w-full border ${
                  errors.age && touched.age ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                required
              />
              {errors.age && touched.age && (
                <p className="mt-1 text-sm text-red-600">{errors.age}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                Date of Birth *
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-1 block w-full border ${
                  errors.dateOfBirth && touched.dateOfBirth ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                required
              />
              {errors.dateOfBirth && touched.dateOfBirth && (
                <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                Gender *
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-1 block w-full border ${
                  errors.gender && touched.gender ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && touched.gender && (
                <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
              )}
            </div>

            {/* Contact Number */}
            <div>
              <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
                Contact Number *
              </label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength="10"
                pattern="[0-9]{10}"
                className={`mt-1 block w-full border ${
                  errors.contactNumber && touched.contactNumber ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                required
              />
              {errors.contactNumber && touched.contactNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.contactNumber}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-1 block w-full border ${
                  errors.email && touched.email ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                required
              />
              {errors.email && touched.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address *
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`mt-1 block w-full border ${
                errors.address && touched.address ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              required
            />
            {errors.address && touched.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address}</p>
            )}
          </div>

          {/* About */}
          <div>
            <label htmlFor="about" className="block text-sm font-medium text-gray-700">
              About Yourself *
            </label>
            <textarea
              id="about"
              name="about"
              rows={3}
              value={formData.about}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`mt-1 block w-full border ${
                errors.about && touched.about ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              required
            />
            {errors.about && touched.about && (
              <p className="mt-1 text-sm text-red-600">{errors.about}</p>
            )}
          </div>

          {/* Work Experience */}
          <div>
            <label htmlFor="workExperience" className="block text-sm font-medium text-gray-700">
              Work Experience (Years) *
            </label>
            <input
              type="number"
              id="workExperience"
              name="workExperience"
              value={formData.workExperience}
              onChange={handleChange}
              onBlur={handleBlur}
              min="0"
              max="50"
              className={`mt-1 block w-full border ${
                errors.workExperience && touched.workExperience ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              required
            />
            {errors.workExperience && touched.workExperience && (
              <p className="mt-1 text-sm text-red-600">{errors.workExperience}</p>
            )}
          </div>

          {/* Profile Picture */}
          <div>
            <label htmlFor="profilePic" className="block text-sm font-medium text-gray-700">
              Profile Picture
            </label>
            <div className="mt-1 flex items-center">
              {formData.profilePic ? (
                <img
                  src={formData.profilePic}
                  alt="Profile preview"
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                  <svg
                    className="h-full w-full text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </span>
              )}
              <label
                htmlFor="file-upload"
                className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
              >
                <span>Upload</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid()}
              className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                isFormValid() ? "bg-indigo-600 hover:bg-indigo-700" : "bg-indigo-400 cursor-not-allowed"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {existingData.fullname ? "Update Profile" : "Create Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGuide;