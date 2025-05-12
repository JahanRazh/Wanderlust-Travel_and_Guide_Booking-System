import React, { useState, useEffect } from "react";
import { MdAdd, MdDeleteOutline, MdUpdate, MdClose } from "react-icons/md";
import DataSelector from "../../components/Input/DataSelector";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ImageSelector from "../../components/Input/ImageSelector";
import TagInput from "../../components/Input/TagInput";
import uploadImage from "../../utils/uploadImage";
import axiosInstance from "../../utils/axiosInstance";
import moment from "moment";

const AddEditTravelStory = ({
  storyInfo,
  type,
  onClose,
  getAllTravelStories,
}) => {
  const [formData, setFormData] = useState({
    title: storyInfo?.title || "",
    storyImg: storyInfo?.ImageUrl || null,
    story: storyInfo?.story || "",
    visitedLocations: storyInfo?.visitedLocations || [],
    visitedDate: storyInfo?.visitedDate || moment().toDate()
  });

  const [errors, setErrors] = useState({
    title: "",
    story: "",
    visitedLocations: "",
    storyImg: "",
    visitedDate: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isTouched, setIsTouched] = useState({
    title: false,
    story: false,
    visitedLocations: false,
    storyImg: false,
    visitedDate: false
  });

  useEffect(() => {
    if (isTouched.title) validateField('title', formData.title);
    if (isTouched.story) validateField('story', formData.story);
    if (isTouched.visitedLocations) validateField('visitedLocations', formData.visitedLocations);
    if (isTouched.storyImg) validateField('storyImg', formData.storyImg);
    if (isTouched.visitedDate) validateField('visitedDate', formData.visitedDate);
  }, [formData]);

  const validateField = (field, value) => {
    let error = "";
    
    switch (field) {
      case 'title':
        if (!value.trim()) {
          error = "Title is required";
        } else if (value.length > 100) {
          error = "Title must be less than 100 characters";
        } else if (value.length < 5) {
          error = "Title must be at least 5 characters";
        }
        break;
        
      case 'story':
        if (!value.trim()) {
          error = "Story content is required";
        } else if (value.length < 20) {
          error = "Story must be at least 20 characters";
        } else if (value.length > 5000) {
          error = "Story must be less than 5000 characters";
        }
        break;
        
      case 'visitedLocations':
        if (value.length === 0) {
          error = "At least one location is required";
        } else if (value.length > 10) {
          error = "Maximum 10 locations allowed";
        } else if (value.some(loc => loc.length > 50)) {
          error = "Location names must be less than 50 characters";
        } else if (value.some(loc => !/^[a-zA-Z0-9\s,'-]*$/.test(loc))) {
          error = "Location names contain invalid characters";
        }
        break;
        
      
        
      case 'visitedDate':
        if (!value) {
          error = "Visited date is required";
        } else if (moment(value).isAfter(moment())) {
          error = "Visited date cannot be in the future";
        } else if (moment(value).isBefore(moment().subtract(100, 'years'))) {
          error = "Visited date is too far in the past";
        }
        break;
        
      default:
        break;
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
    return !error;
  };

  const validateForm = () => {
    const titleValid = validateField('title', formData.title);
    const storyValid = validateField('story', formData.story);
    const locationsValid = validateField('visitedLocations', formData.visitedLocations);
    const imageValid = validateField('storyImg', formData.storyImg);
    const dateValid = validateField('visitedDate', formData.visitedDate);
    
    setIsTouched({
      title: true,
      story: true,
      visitedLocations: true,
      storyImg: true,
      visitedDate: true
    });
    
    return titleValid && storyValid && locationsValid && imageValid && dateValid;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (!isTouched[field]) {
      setIsTouched(prev => ({ ...prev, [field]: true }));
    }
    
    if (isTouched[field]) {
      validateField(field, value);
    }
  };

  const handleBlur = (field) => {
    if (!isTouched[field]) {
      setIsTouched(prev => ({ ...prev, [field]: true }));
      validateField(field, formData[field]);
    }
  };

  const addNewTravelStory = async () => {
    setIsLoading(true);
    try {
      let imageUrl = "";
      if (formData.storyImg && typeof formData.storyImg !== 'string') {
        const imgUploadRes = await uploadImage(formData.storyImg);
        imageUrl = imgUploadRes.imageUrl || "";
      } else if (formData.storyImg) {
        imageUrl = formData.storyImg;
      }

      const response = await axiosInstance.post("add-travel-story", {
        title: formData.title,
        story: formData.story,
        ImageUrl: imageUrl,
        visitedLocations: formData.visitedLocations,
        visitedDate: moment(formData.visitedDate).valueOf()
      });

      if (response.data?.success) {
        toast.success("Story added successfully");
        await getAllTravelStories();
        onClose();
      }
    } catch (error) {
      console.error("Error adding story:", error);
      const errorMessage = error.response?.data?.message || "An error occurred while adding the story";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTravelStory = async () => {
    setIsLoading(true);
    try {
      let imageUrl = formData.storyImg;
      
      if (formData.storyImg && typeof formData.storyImg === 'object') {
        const imgUploadRes = await uploadImage(formData.storyImg);
        imageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.put(
        `/edit-travel-story/${storyInfo._id}`,
        {
          title: formData.title,
          story: formData.story,
          ImageUrl: imageUrl,
          visitedLocations: formData.visitedLocations,
          visitedDate: moment(formData.visitedDate).valueOf()
        }
      );

      if (response.data?.success) {
        toast.success("Story updated successfully");
        await getAllTravelStories();
        onClose();
      }
    } catch (error) {
      console.error("Error updating story:", error);
      const errorMessage = error.response?.data?.message || "An error occurred while updating the story";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      if (type === "edit") {
        await updateTravelStory();
      } else {
        await addNewTravelStory();
      }
    } catch (error) {
      console.error("Operation failed:", error);
    }
  };

  const handleDeleteStoryImg = async () => {
    if (!storyInfo?.ImageUrl) {
      handleInputChange('storyImg', null);
      return;
    }

    try {
      setIsLoading(true);
      const deleteImgRes = await axiosInstance.delete("/delete-image", {
        params: {
          ImageUrl: storyInfo.ImageUrl,
        },
      });
      
      if (deleteImgRes.data?.success) {
        handleInputChange('storyImg', null);
        toast.success("Image deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      const errorMessage = error.response?.data?.message || "Failed to delete image";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative p-4 bg-white rounded-lg shadow-lg max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {type === "add" ? "Add New Travel Story" : "Edit Travel Story"}
        </h2>
        <div className="flex items-center gap-2">
          <button
            className={`flex items-center gap-1 px-4 py-2 rounded-md ${
              type === "add" 
                ? "bg-green-600 hover:bg-green-700 text-white" 
                : "bg-blue-600 hover:bg-blue-700 text-white"
            } transition-colors disabled:opacity-50`}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="animate-spin">↻</span>
            ) : type === "add" ? (
              <>
                <MdAdd className="text-lg" />
                Add Story
              </>
            ) : (
              <>
                <MdUpdate className="text-lg" />
                Update Story
              </>
            )}
          </button>
          <button 
            className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
            onClick={onClose}
            disabled={isLoading}
          >
            <MdClose className="text-xl" />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Title Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="A day at the Great Wall"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            onBlur={() => handleBlur('title')}
            disabled={isLoading}
            maxLength={100}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {formData.title.length}/100 characters
          </p>
        </div>

        {/* Date Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Visited Date *
          </label>
          <DataSelector 
            date={formData.visitedDate} 
            setDate={(date) => handleInputChange('visitedDate', date)}
            disabled={isLoading}
            maxDate={new Date()}
          />
          {errors.visitedDate && (
            <p className="mt-1 text-sm text-red-600">{errors.visitedDate}</p>
          )}
        </div>

        {/* Image Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Story Image {type === "add" && "*"}
          </label>
          <ImageSelector
            Image={formData.storyImg}
            setImage={(img) => {
              handleInputChange('storyImg', img);
              handleBlur('storyImg');
            }}
            handleDeleteImg={handleDeleteStoryImg}
            disabled={isLoading}
          />
          {errors.storyImg && (
            <p className="mt-1 text-sm text-red-600">{errors.storyImg}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Recommended size: 1200x800 pixels
          </p>
        </div>

        {/* Story Content Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Story Content *
          </label>
          <textarea
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[200px] ${
              errors.story ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Write your story here..."
            value={formData.story}
            onChange={(e) => handleInputChange('story', e.target.value)}
            onBlur={() => handleBlur('story')}
            disabled={isLoading}
            maxLength={5000}
          />
          {errors.story && (
            <p className="mt-1 text-sm text-red-600">{errors.story}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {formData.story.length}/5000 characters (minimum 20)
          </p>
        </div>

        {/* Visited Locations Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Visited Locations and tags *
          </label>
          <TagInput 
            tags={formData.visitedLocations} 
            setTags={(tags) => {
              handleInputChange('visitedLocations', tags);
              handleBlur('visitedLocations');
            }}
            disabled={isLoading}
            maxTags={10}
          />
          {errors.visitedLocations && (
            <p className="mt-1 text-sm text-red-600">{errors.visitedLocations}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Press Enter or comma to add a location (max 10, letters and basic punctuation only)
          </p>
        </div>
      </div>

      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default AddEditTravelStory;