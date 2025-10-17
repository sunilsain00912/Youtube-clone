import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppContext } from "../../useContextHook/useContextApi";
import { useTheme } from "../../useContextHook/useTheme.jsx";
import { fetchApiForYoutubeData } from "../../utils/fetchApi";
import { formatViewCount } from "../../utils/helper";

const ChannelPage = () => {
  const { channelId } = useParams();
  const { setLoading } = useAppContext();
  const { isDarkMode } = useTheme();

  const [channelDetails, setChannelDetails] = useState(null);
  const [videos, setVideos] = useState([]);
  const [shorts, setShorts] = useState([]);
  const [activeTab, setActiveTab] = useState("videos");

  // 🧩 Fetch Channel Info
  const fetchChannelDetails = async () => {
    setLoading(true);
    try {
      const data = await fetchApiForYoutubeData("channels", {
        part: "snippet,statistics,brandingSettings",
        id: channelId,
      });
      setChannelDetails(data?.items?.[0]);
    } catch (error) {
      console.error("Error fetching channel:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🧩 Fetch Channel Videos (and detect Shorts)
  const fetchChannelVideos = async () => {
    setLoading(true);
    try {
      const data = await fetchApiForYoutubeData("search", {
        channelId,
        part: "snippet",
        order: "date",
        maxResults: 50,
      });

      const allVideos = data?.items || [];

      // Separate shorts using heuristic: vertical title / #shorts keyword
      const shortVideos = allVideos.filter(
        (v) =>
          v?.snippet?.title?.toLowerCase().includes("short") ||
          v?.snippet?.description?.toLowerCase().includes("#shorts")
      );

      const regularVideos = allVideos.filter(
        (v) => !shortVideos.includes(v)
      );

      setVideos(regularVideos);
      setShorts(shortVideos);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannelDetails();
    fetchChannelVideos();
  }, [channelId]);

  if (!channelDetails) return null;

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      {/* Banner */}
      <div className="w-full h-[200px] md:h-[300px] relative">
        <img
          src={
            channelDetails?.brandingSettings?.image?.bannerExternalUrl ||
            "https://via.placeholder.com/1200x300"
          }
          alt="Channel Banner"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Channel Header */}
      <div className="flex flex-col md:flex-row items-center justify-between p-4 md:px-10">
        <div className="flex items-center space-x-4">
          <img
            src={
              channelDetails?.snippet?.thumbnails?.high?.url ||
              "https://via.placeholder.com/80"
            }
            alt={channelDetails?.snippet?.title}
            className="w-20 h-20 rounded-full"
          />
          <div>
            <h2 className="text-2xl font-bold">
              {channelDetails?.snippet?.title}
            </h2>
            <p className="text-sm text-gray-400">
              {formatViewCount(channelDetails?.statistics?.subscriberCount)}{" "}
              subscribers •{" "}
              {formatViewCount(channelDetails?.statistics?.videoCount)} videos
            </p>
          </div>
        </div>

        <button
          className={`mt-4 md:mt-0 px-6 py-2 rounded-full font-semibold ${
            isDarkMode
              ? "bg-white text-black hover:bg-gray-300"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          Subscribe
        </button>
      </div>

      {/* Tabs */}
      <div className="flex justify-center border-b border-gray-500 mb-4">
        {["videos", "shorts", "about"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-semibold capitalize ${
              activeTab === tab
                ? isDarkMode
                  ? "border-b-2 border-white"
                  : "border-b-2 border-black"
                : "text-gray-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Section */}
      <div className="p-4 md:px-10">
        {/* Regular Videos */}
        {activeTab === "videos" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Link
                key={video.id.videoId}
                to={`/video/${video.snippet.categoryId || "0"}/${video.id.videoId}`}
                className="group"
              >
                <div className="relative">
                  <img
                    src={video.snippet?.thumbnails?.medium?.url}
                    alt={video.snippet?.title}
                    className="w-full rounded-lg group-hover:scale-105 transition-transform"
                  />
                </div>
                <h3 className="mt-2 font-semibold text-sm line-clamp-2">
                  {video.snippet?.title}
                </h3>
              </Link>
            ))}
          </div>
        )}

        {/* Shorts */}
        {activeTab === "shorts" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {shorts.length > 0 ? (
              shorts.map((video) => (
                <Link
                  key={video.id.videoId}
                  to={`/video/${video.snippet.categoryId || "0"}/${video.id.videoId}`}
                >
                  <div className="relative">
                    <div className="aspect-[9/16] overflow-hidden rounded-lg">
                      <img
                        src={video.snippet?.thumbnails?.high?.url}
                        alt={video.snippet?.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                    <p className="text-xs mt-1 text-center line-clamp-2">
                      {video.snippet?.title}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-center text-gray-400 text-sm">
                No Shorts available for this channel.
              </p>
            )}
          </div>
        )}

        {/* About Section */}
        {activeTab === "about" && (
          <div className="max-w-3xl mx-auto mt-10 p-6 rounded-2xl shadow-md border border-gray-700 bg-opacity-10 bg-gray-800/20 text-center">
            <h3 className="text-xl font-bold mb-4">About This Channel</h3>
            <p className="text-black leading-relaxed mb-4 whitespace-pre-line">
              {channelDetails?.snippet?.description ||
                "No description available for this channel."}
            </p>
            <div className="flex justify-center text-sm text-gray-400 space-x-4">
              <p>
                <span className="font-semibold text-gray-300">
                  {formatViewCount(channelDetails?.statistics?.viewCount)}
                </span>{" "}
                total views
              </p>
              <p>
                Joined{" "}
                {new Date(
                  channelDetails?.snippet?.publishedAt
                ).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChannelPage;