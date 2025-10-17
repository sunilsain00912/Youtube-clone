import React from "react";
import { formatPublishTime, formatViewCount } from "../../utils/helper";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";

const VideoComments = ({ comment }) => {
  const snippet = comment?.snippet?.topLevelComment?.snippet;

  return (
    <div
      className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 mb-6 p-4 rounded-xl 
      bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 
      transition-all duration-300 shadow-sm border border-gray-200 dark:border-gray-700"
    >
      {/* Avatar */}
      <img
        src={snippet?.authorProfileImageUrl}
        alt={snippet?.authorDisplayName}
        className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-300 dark:ring-gray-600"
      />

      {/* Comment Content */}
      <div className="flex-1">
        {/* Header: Name + Time */}
        <div className="flex flex-wrap items-center gap-x-2">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {snippet?.authorDisplayName}
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatPublishTime(snippet?.publishedAt)}
          </span>
        </div>

        {/* Comment Text */}
        <p
          className="text-sm mt-2 leading-relaxed text-gray-700 dark:text-gray-300 
          whitespace-pre-line break-words"
          dangerouslySetInnerHTML={{ __html: snippet?.textDisplay }}
        />

        {/* Like & Dislike Buttons */}
        <div className="flex items-center gap-4 mt-3">
          <button
            className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-blue-500 
            transition-colors duration-200"
          >
            <FaThumbsUp className="text-sm" />
            <span className="text-xs">
              {formatViewCount(snippet?.likeCount || 0)}
            </span>
          </button>

          <button
            className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-red-500 
            transition-colors duration-200"
          >
            <FaThumbsDown className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoComments;
