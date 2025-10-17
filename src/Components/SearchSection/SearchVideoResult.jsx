import React, { useEffect, useState } from "react";
import { useTheme } from "../../useContextHook/useTheme";
import { useAppContext } from "../../useContextHook/useContextApi";
import { Link, useParams } from "react-router-dom";
import { fetchApiForYoutubeData } from "../../utils/fetchApi";
import Sidebar from "../Sidebarsection/Sidebar";
import { formatPublishTime, formatViewCount } from "../../utils/helper";

const SearchVideoResult = () => {
  const [searchResult, setSearchResult] = useState([]);
  const { isDarkMode } = useTheme();
  const { setLoading, mobileMenu } = useAppContext();
  const { searchQuery } = useParams();

  const fetchSearchVideos = async () => {
    setLoading(true);
    try {
      const data = await fetchApiForYoutubeData("search", {
        part: "snippet",
        regionCode: "IN",
        q: searchQuery,
        type: "video",
        maxResults: 20,
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
    }
  };

  useEffect(() => {
    fetchSearchVideos();
  }, [searchQuery]);

  return (
    <div
      className={`flex w-full h-screen overflow-hidden ${
        isDarkMode ? "bg-gray-900 text-gray-300" : "bg-white text-gray-800"
      }`}
    >
      {/* Sidebar */}
      <div
        className={`
          fixed md:relative z-30 h-full w-[260px] md:w-[260px]
          transform transition-transform duration-300 ease-in-out
          ${mobileMenu ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <Sidebar />
      </div>

      {/* Main content */}
      <div
        className={`
          flex-grow overflow-y-auto overflow-x-hidden
          ${isDarkMode ? "bg-gray-900" : "bg-white"}
          px-4 md:ml-[260px]
        `}
      >
        <div className="max-w-6xl mx-auto w-full py-4">
          {searchResult.length > 0 ? (
            searchResult.map((result) => (
              <div
                key={result.id}
                className="flex flex-col md:flex-row mb-8 w-full overflow-hidden rounded-lg"
              >
                {/* Thumbnail */}
                <Link
                  to={`/video/${result?.snippet?.categoryId || "unknown"}/${result.id}`}
                  className="w-full md:w-1/3 flex-shrink-0"
                >
                  <img
                    src={result?.snippet?.thumbnails?.medium?.url}
                    alt={result?.snippet?.title}
                    className="w-full h-auto object-cover rounded-md"
                  />
                </Link>

                {/* Details */}
                <div className="md:ml-4 md:w-2/3 flex flex-col justify-center">
                  <h3 className="text-lg font-semibold line-clamp-2">
                    {result?.snippet?.title}
                  </h3>

                  <div
                    className={`text-sm mt-1 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {result?.snippet?.channelTitle}
                  </div>

                  <div
                    className={`text-xs ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {formatViewCount(result?.statistics?.viewCount)} views •{" "}
                    {formatPublishTime(result?.snippet?.publishedAt)}
                  </div>

                  <p className="mt-2 text-sm text-gray-400 line-clamp-2">
                    {result?.snippet?.description?.slice(0, 120)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-[80vh] text-gray-500">
              No videos found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchVideoResult;
