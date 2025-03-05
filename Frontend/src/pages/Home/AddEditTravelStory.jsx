import React, { useState } from "react";
import { MdAdd, MdDeleteOutline, MdUpdate, MdClose } from "react-icons/md";
import DataSelector from "../../components/Input/DataSelector";
import { GrTarget } from "react-icons/gr";
import { ToastContainer, toast } from 'react-toastify';
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
  const [title, setTitle] = useState(storyInfo?.title || "");
  const [storyImg, setStoryImg] = useState(storyInfo?.ImageUrl || null);
  const [story, setStory] = useState(storyInfo?.story || "");
  const [visitedLocations, setVisitedLocations] = useState(
    storyInfo?.visitedLocations || []
  );
  const [visitedDate, setVisitedDate] = useState(
    storyInfo?.visitedDate || null
  );
  const [error, setError] = useState("");

  const addNewTravelStory = async () => {
    try {
      let imageUrl = "";
      if (storyImg) {
        const imgUploadRes = await uploadImage(storyImg);
        imageUrl = imgUploadRes.imageUrl || "";
      }
      const response = await axiosInstance.post("add-travel-story", {
        title,
        story,
        ImageUrl: imageUrl || "",
        visitedLocations,
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
      });

      if (response.data && response.data.success) {
        toast.success("Story added successfully");
        await getAllTravelStories();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred while adding the story");
      }
    }
  };

  const updateTravelStory = async () => {
    const storyId = storyInfo._id;
    try {
      let imageUrl = "";
      let postData = {
        title,
        story,
        ImageUrl: storyInfo.ImageUrl || "",
        visitedLocations,
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
      };

      if (typeof storyImg === "object") {
        const imgUploadRes = await uploadImage(storyImg);
        imageUrl = imgUploadRes.imageUrl || "";
        postData = {
          ...postData,
          ImageUrl: imageUrl,
        };
      }

      const response = await axiosInstance.put(
        `/edit-travel-story/${storyId}`,
        postData
      );

      if (response.data && response.data.success) {
        toast.success("Story updated successfully");
        getAllTravelStories();
        onClose();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred while updating the story");
      }
    }
  };
//await and async use krla just now update krgnd puluvn una
// for the operation to complete
  const handleAddOrUpdateClick = async () => {
    console.log("Input Data:", {
      title,
      storyImg,
      story,
      visitedLocations,
      visitedDate,
    });
    if (!title) {
      setError("Please enter a title for the story");
      return;
    }
    if (!story) {
      setError("Please select an image for the story");
      return;
    }
    setError("");

    if (type === "edit") {
      await updateTravelStory(); //awit for the operation to complete
    } else {
      await addNewTravelStory();
    }
  };

  const handleDeleteStoryImg = async () => {
    const deleteImgRes = await axiosInstance.delete("/delete-image", {
      params: {
        ImageUrl: storyInfo.imageUrl,
      },
    });
    if (deleteImgRes.data) {
      const storyId = storyInfo._id;

      const postData = {
        title,
        story,
        visitedLocations,
        visitedDate: moment().valueOf(),
        ImageUrl: "",
      };
      // Update the story with the new image URL
      await axiosInstance.put(`/edit-travel-story/${storyId}`, postData);
      setStoryImg(null);
    }
  };

  return (
    <>
    <div className="relative">
      <div className="flex justify-between items-center">
        <h5 className="text-xl font-semibold text-slate-700">
          {type === "add" ? "Add Story" : "Update Story"}
        </h5>
        <div>
          <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg">
            {type === "add" ? (
              <button
                className="btn-small"
                onClick={async () => {
                  await handleAddOrUpdateClick(); // Wait for the operation to complete
                  onClose(); // Close the modal after the operation is done
                }}
              >
                <MdAdd className="text-lg" />
                ADD STORY
              </button>
            ) : (
              <>
                <button
                  className="btn-small"
                  onClick={async () => {
                    await handleAddOrUpdateClick(); // Wait for the operation to complete
                    onClose(); // Close the modal after the operation is done
                  }}
                >
                  <MdUpdate className="text-lg" />
                  UPDATE STORY
                </button>
              </>
            )}

            <button className="" onClick={onClose}>
              <MdClose className="text-xl text-slate-400" />
            </button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      </div>

      <div>
        <div className="flex-1 flex flex-col gap-2 pt-4">
          <label className="input-label">TITLE</label>
          <br />
          <input
            type="text"
            className="text-2xl text-slate-950 outline-none"
            placeholder="A day at the Great Wall"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />

          <div className="my-3">
            <DataSelector date={visitedDate} setDate={setVisitedDate} />
          </div>

          <ImageSelector
            Image={storyImg}
            setImage={setStoryImg}
            handleDeleteImg={handleDeleteStoryImg}
          />

          <div className="flex flex-col gap-2 mt-4">
            <label className="input-label">STORY</label>
            <textarea
              className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
              placeholder="Write your story here..."
              rows={10}
              value={story}
              onChange={({ target }) => setStory(target.value)}
            />
          </div>

          <div className="pt-3">
            <label className="input-label">VISITED LOCATIONS</label>
            <TagInput tags={visitedLocations} setTags={setVisitedLocations} />
          </div>
        </div>
      </div>
    </div>
    <ToastContainer />
    </>
  );
  
};

export default AddEditTravelStory;
