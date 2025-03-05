/**
 * TagInput Component
 * 
 * This component allows users to input and manage tags (e.g., locations). It includes an input field
 * where users can type a tag and a button to add the tag to the list. Tags are displayed as a JSON string
 * for demonstration purposes.
 * 
 * Props:
 * - tags: An array of strings representing the current tags.
 * - setTags: A function to update the tags array.
 * 
 * Features:
 * - Users can type a tag in the input field and press "Enter" or click the "+" button to add it.
 * - The input field is cleared after a tag is added.
 * - Tags are trimmed of leading/trailing spaces before being added.
 * 
 * Dependencies:
 * - React-icons (MdAdd, MdClose, GrMapLocation): Used for icons in the UI.
 * - React useState: Manages the state of the input field.
 * 
 * Example Usage:
 * <TagInput tags={tags} setTags={setTags} />
 */
import React, { useState } from "react";
import { MdAdd, MdClose } from "react-icons/md";
import { GrMapLocation } from "react-icons/gr";

const TagInput = ({ tags, setTags }) => {
  // State to manage the input value
  const [inputValue, setInputValue] = useState("");

  // Function to add a new tag
  const addNewTag = () => {
    if (inputValue.trim() !== "") {
      setTags([...tags, inputValue.trim()]); // Add the trimmed input value to the tags array
      setInputValue(""); // Clear the input field
    }
  };

  // Function to handle input changes
  const handleInputChange = (e) => {
    setInputValue(e.target.value); // Update the input value state
  };

  // Function to handle the "Enter" key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addNewTag(); // Add the tag when "Enter" is pressed
    }
  };
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove)); // Remove the tag from the tags array
  }

  return (
    <div>
      {/* Display the current tags as a JSON string for debugging/demo purposes */}
      {/*{JSON.stringify(tags)}*/}
      
      {tags.length > 0 && (
        <div className="flex item-center flex-wrap gap-2 mt-2">
          {tags.map((tag, index) => (
            <span key={index} className="flex item-center gap-2 text-sm text-cyan-600 bg-cyan-100 px-3 py-1 rounded">
              <GrMapLocation className="text-sm" /> {tag} {/* Location icon */}
              
              <button onClick={() => handleRemoveTag(tag)}>  
                <MdClose/> {/* Close icon */}
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Container for the input field and add button */}
      <div className="flex items-center gap-2">
        {/* Input field for typing tags */}
        <input
          type="text"
          value={inputValue}
          className="text-sm bg-transparent border px-3 py-2 rounded outline-none"
          placeholder="Add a location"
          onChange={handleInputChange} // Update input value on change
          onKeyDown={handleKeyDown} // Add tag on "Enter" key press
        />
        
        {/* Button to add a new tag */}
        <button
          className="w-8 h-8 flex items-center justify-center rounded border border-cyan-500 hover:bg-cyan-500"
          onClick={addNewTag} // Add tag on button click
        >
          <MdAdd className="text-2xl text-cyan-500 hover:text-white" /> {/* Add icon */}
        </button>
      </div>
    </div>
  );
};

export default TagInput;