import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../../useContextHook/useContextApi";
import { useTheme } from "../../useContextHook/useTheme.jsx";
import { fetchApiForYoutubeData } from "../../utils/fetchApi";
import { formatPublishTime, formatViewCount } from "../../utils/helper";
import {
  FaDownload,
  FaThumbsDown,
  FaThumbsUp,
  FaArrowLeft,
} from "react-icons/fa";
import VideoComments from "../VideoSection/VideoComment";
import RelatedVideos from "../VideoSection/RelatedVideo";

const VideoDetails = () => {
  const { categoryId, videoId } = useParams();
  const { setLoading } = useAppContext();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const [selectedVideoDetails, setSelectedVideoDetails] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [channelData, setChannelData] = useState(null);
  const [commentData, setCommentData] = useState([]);

  // 🔹 Fetch selected video details
  const fetchSelectedVideoDetails = async () => {
    setLoading(true);
    try {
      const data = await fetchApiForYoutubeData("videos", {
        part: "snippet,contentDetails,statistics",
        id: videoId,
      });
      setSelectedVideoDetails(data?.items?.[0]);
    } catch (error) {
      console.error("Error fetching selected video:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch channel data
  const fetchChannelData = async () => {
    if (!selectedVideoDetails?.snippet?.channelId) return;
    setLoading(true);
    try {
      const data = await fetchApiForYoutubeData("channels", {
        part: "snippet,contentDetails,statistics",
        id: selectedVideoDetails.snippet.channelId,
      });
      setChannelData(data?.items?.[0]);
    } catch (error) {
      console.log("Error fetching channel data:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch comments
  const fetchVideoComments = async () => {
    setLoading(true);
    try {
      const data = await fetchApiForYoutubeData("commentThreads", {
        part: "snippet",
        videoId,
        maxResults: 20,
      });
      setCommentData(data?.items || []);
    } catch (error) {
      console.log("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSelectedVideoDetails();
    fetchVideoComments();
  }, [videoId]);

  // 🔹 Auto-scroll to the video player when the page loads
  useEffect(() => {
    const scrollToPlayer = () => {
      const videoSection = document.getElementById("video-player-section");
      if (videoSection) {
        videoSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    // Small delay to ensure DOM is ready
    const timeout = setTimeout(scrollToPlayer, 600);

    return () => clearTimeout(timeout);
  }, [videoId]);

  useEffect(() => {
    fetchChannelData();
  }, [selectedVideoDetails]);

  const toggleDescription = () => setShowFullDescription(!showFullDescription);

  const description = selectedVideoDetails?.snippet?.description || "";
  const truncatedDescription = description.slice(0, 240);

  // 🔹 Simulated download handler
  const handleDownload = () => {
    alert(
      "For security and YouTube policy reasons, direct downloads are disabled.\n\nYou can implement your own backend proxy to fetch and save video content locally."
    );
  };

  return (
    <div
      className={`flex justify-center flex-row min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <div className="w-full flex flex-col p-4 lg:flex-row lg:space-x-4">
        {/* LEFT SECTION */}
        <div className="flex flex-col lg:w-[65%] px-4 py-3 lg:py-6 overflow-y-auto">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 mb-4 px-4 py-2 rounded-full font-semibold ${
              isDarkMode
                ? "bg-gray-800 text-white hover:bg-gray-700"
                : "bg-gray-300 text-black hover:bg-gray-400"
            } transition`}
          >
            <FaArrowLeft /> Back
          </button>

          {/* ✅ Added ID wrapper around video player */}
          <div
            id="video-player-section"
            className="h-[300px] md:h-[450px] lg:h-[500px] xl:h-[600px] rounded-lg overflow-hidden"
          >
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0&controls=1&fs=1`}
              title="YouTube video player"
              frameBorder="0"
              className="rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>

          {/* Video Info */}
          {selectedVideoDetails && (
            <div className="mt-4 flex flex-col gap-6">
              <h2 className="text-2xl font-bold leading-snug">
                {selectedVideoDetails.snippet?.title}
              </h2>

              {/* Channel Info */}
              <div className="flex flex-wrap items-center mb-4">
                <Link
                  to={`/channel/${selectedVideoDetails.snippet?.channelId}`}
                  className="flex items-center hover:opacity-80 transition"
                >
                  <img
                    src={
                      channelData?.snippet?.thumbnails?.default?.url ||
                      "https://via.placeholder.com/48x48"
                    }
                    alt={channelData?.snippet?.title || "Channel"}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="mt-3 ml-2 lg:mt-0">
                    <h3 className="text-lg font-bold hover:underline">
                      {channelData?.snippet?.title || "Channel"}
                    </h3>
                    <p
                      className={`font-medium text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {formatViewCount(
                        channelData?.statistics?.subscriberCount || 0
                      )}{" "}
                      subscribers
                    </p>
                  </div>
                </Link>

                <button
                  className={`${
                    isDarkMode
                      ? "bg-white text-black hover:bg-gray-300"
                      : "bg-black text-white hover:bg-gray-800"
                  } font-semibold px-6 py-2 lg:py-3 mt-2 lg:mt-0 ml-3 rounded-full transition`}
                >
                  Subscribe
                </button>
              </div>

              {/* Like + Download */}
              <div className="flex items-center justify-between space-x-4">
                <button
                  className={`flex items-center space-x-2 rounded-full px-4 py-2 md:px-6 md:py-3 ${
                    isDarkMode ? "bg-black" : "bg-slate-200"
                  }`}
                >
                  <FaThumbsUp />
                  <span>
                    {formatViewCount(
                      selectedVideoDetails.statistics?.likeCount || 0
                    )}
                  </span>
                  <div className="h-5 w-[1px] bg-gray-400 mx-2"></div>
                  <FaThumbsDown />
                </button>

                <button
                  onClick={handleDownload}
                  className={`flex items-center space-x-2 rounded-full px-4 py-2 md:px-6 md:py-3 ${
                    isDarkMode ? "bg-black" : "bg-slate-200"
                  }`}
                >
                  <FaDownload />
                  <span>Download</span>
                </button>
              </div>

              {/* Description */}
              <div
                className={`rounded-xl p-4 ${
                  isDarkMode ? "bg-gray-800" : "bg-slate-200"
                }`}
              >
                <p
                  className={`${
                    isDarkMode ? "text-gray-200" : "text-gray-900"
                  }`}
                >
                  {formatViewCount(selectedVideoDetails.statistics?.viewCount)}{" "}
                  views •{" "}
                  {formatPublishTime(selectedVideoDetails.snippet?.publishedAt)}
                </p>

                <p className="mt-2">
                  {showFullDescription ? description : truncatedDescription}
                  {description.length > 240 && (
                    <button
                      onClick={toggleDescription}
                      className="text-blue-500 ml-2 font-medium"
                    >
                      {showFullDescription ? "Show less" : "Show more"}
                    </button>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Comments */}
          <div className="mt-8">
            <p
              className={`${
                isDarkMode ? "text-gray-200" : "text-black"
              } font-semibold text-lg mb-4`}
            >
              {formatViewCount(
                selectedVideoDetails?.statistics?.commentCount || 0
              )}{" "}
              Comments
            </p>
            {commentData.map((comment) => (
              <VideoComments comment={comment} key={comment.id} />
            ))}
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="lg:w-[35%] p-4 overflow-y-auto">
          <h3 className="text-xl font-bold mb-4">Related Videos</h3>
          <RelatedVideos categoryId={categoryId} />
        </div>
      </div>
    </div>
  );
};

export default VideoDetails;
