import React from "react";
import { GrMapLocation } from "react-icons/gr";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import moment from "moment";

const TravelStoryCard = ({
  ImgUrl,
  title,
  date,
  story,
  visitedLocations = [],
  isFavorite,
  favoriteCount = 0, // Add favoriteCount prop
  onFavoriteClick,
  onClick,
}) => {
  return (
    <div className="mt-5 shadow-md rounded-lg overflow-hidden bg-white hover:shadow-lg hover:shadow-slate-200 transition-all ease-in-out relative cursor-pointer">
      <img
        src={ImgUrl}
        alt={title}
        className="w-full h-56 object-cover rounded-t-lg"
        onClick={onClick}
      />

      {/* Favorite button with count */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <div className="bg-white/80 rounded-full px-2 py-1 text-xs flex items-center">
          <FaHeart className="text-red-500 mr-1" />
          <span>{favoriteCount}</span>
        </div>
        <button
          className="w-10 h-10 flex items-center justify-center bg-white/80 rounded-full border border-white/30"
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteClick();
          }}
        >
          {isFavorite ? (
            <FaHeart className="text-red-500 text-lg" />
          ) : (
            <FaRegHeart className="text-gray-600 text-lg" />
          )}
        </button>
      </div>

      <div className="p-4" onClick={onClick}>
        <div className="flex items-center grp-3">
          <div className="flex-1">
            <h6 className="text-sm font-medium">{title}</h6>
            <span className="text-xs text-slate-500">
              {date ? moment(date).format("DD MMM YYYY") : "-"}
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-600 mt-2">{story?.slice(0, 60)}...</p>
        {visitedLocations.length > 0 && (
          <div className="inline-flex items-center gap-2 text-xs text-[13px] text-cyan-600 bg-cyan-200/40 rounded mt-3 px-2 py-1">
            <GrMapLocation className="text-sm" />
            {visitedLocations.map((location, index) => (
              <span key={index}>
                {location}
                {index < visitedLocations.length - 1 && ","}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelStoryCard;
