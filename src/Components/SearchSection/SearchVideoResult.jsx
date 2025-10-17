import React, { useEffect, useState } from "react";
import { useTheme } from "../../useContextHook/useTheme";
import { useAppContext } from "../../useContextHook/useContextApi";
import { Link, useParams, useNavigate } from "react-router-dom";
import { fetchApiForYoutubeData } from "../../utils/fetchApi";
import Sidebar from "../Sidebarsection/Sidebar";
import { formatPublishTime, formatViewCount } from "../../utils/helper";

const SearchVideoResult = () => {
  const [searchResult, setSearchResult] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const { isDarkMode } = useTheme();
  const { setLoading, mobileMenu } = useAppContext();
  const { searchQuery } = useParams();
  const navigate = useNavigate();

  const fetchSearchVideos = async () => {
    setLoading(true);
    setLoadingData(true);
    try {
      const data = await fetchApiForYoutubeData("search", {
        part: "snippet",
        regionCode: "IN",
        q: searchQuery,
        type: "video",
        maxResults: 25,
      });

      const videoIds = data.items.map((item) => item.id.videoId).join(",");
      const videoDetailsResponse = await fetchApiForYoutubeData("videos", {
        part: "snippet,contentDetails,statistics",
        id: videoIds,
      });

      setSearchResult(videoDetailsResponse?.items || []);
    } catch (error) {
      console.error("Error fetching search videos", error);
    } finally {
      setLoading(false);
      setLoadingData(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    fetchSearchVideos();
  }, [searchQuery]);

  const handleChannelClick = (channelId) => {
    navigate(`/channel/${channelId}`);
  };

  return (
    <div
      className={`flex w-full h-screen overflow-hidden ${
        isDarkMode ? "bg-gray-900 text-gray-300" : "bg-white text-gray-800"
      }`}
    >
      {/* Sidebar */}
      <div
        className={`fixed md:relative z-30 h-full w-[260px] md:w-[260px]
          transform transition-transform duration-300 ease-in-out
          ${mobileMenu ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div
        className={`flex-grow overflow-y-auto overflow-x-hidden px-3 sm:px-5 md:px-8 py-4 md:ml-[260px] transition-all duration-200 ${
          isDarkMode ? "bg-gray-900" : "bg-white"
        }`}
      >
        <div className="max-w-6xl mx-auto w-full space-y-6">
          <h2
            className={`text-2xl font-semibold mb-4 ${
              isDarkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Search Results for “{searchQuery}”
          </h2>

          {/* Loading Skeleton */}
          {loadingData ? (
            <div className="space-y-5">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={`flex flex-col md:flex-row gap-4 animate-pulse ${
                    isDarkMode ? "bg-gray-800" : "bg-gray-100"
                  } rounded-lg p-3`}
                >
                  <div className="w-full md:w-1/3 h-44 bg-gray-700 rounded-lg" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 w-3/4 bg-gray-700 rounded"></div>
                    <div className="h-4 w-1/2 bg-gray-700 rounded"></div>
                    <div className="h-3 w-5/6 bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : searchResult.length > 0 ? (
            searchResult.map((result) => (
              <div
                key={result.id}
                className={`flex flex-col md:flex-row items-start md:items-center gap-4 p-3 rounded-lg transition-all duration-200 ${
                  isDarkMode
                    ? "hover:bg-gray-800"
                    : "hover:bg-gray-100 border-b border-gray-200"
                }`}
              >
                {/* Thumbnail */}
                <Link
                  to={`/video/${result?.snippet?.categoryId || "unknown"}/${result.id}`}
                  className="w-full md:w-1/3 flex-shrink-0 relative group"
                >
                  <img
                    src={result?.snippet?.thumbnails?.medium?.url}
                    alt={result?.snippet?.title}
                    className="w-full h-auto object-cover rounded-xl transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <div
                    className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded-md"
                    title="Video Duration"
                  >
                    {result?.contentDetails?.duration
                      ?.replace("PT", "")
                      .replace("M", ":")
                      .replace("S", "")}
                  </div>
                </Link>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-center">
                  <h3
                    className={`text-lg md:text-xl font-semibold line-clamp-2 ${
                      isDarkMode ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    {result?.snippet?.title}
                  </h3>

                  {/* Channel name */}
                  <button
                    onClick={() => handleChannelClick(result?.snippet?.channelId)}
                    className={`text-sm mt-1 font-medium text-start ${
                      isDarkMode
                        ? "text-blue-400 hover:underline"
                        : "text-blue-600 hover:underline"
                    }`}
                  >
                    {result?.snippet?.channelTitle}
                  </button>

                  {/* Stats */}
                  <div
                    className={`text-xs mt-1 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {formatViewCount(result?.statistics?.viewCount)} views •{" "}
                    {formatPublishTime(result?.snippet?.publishedAt)}
                  </div>

                  {/* Description */}
                  <p
                    className={`mt-2 text-sm line-clamp-2 ${
                      isDarkMode ? "text-gray-400" : "text-gray-700"
                    }`}
                  >
                    {result?.snippet?.description?.slice(0, 120)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-[70vh] text-gray-500 text-lg">
              No videos found for “{searchQuery}”
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchVideoResult;
