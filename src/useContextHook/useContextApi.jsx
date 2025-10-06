import React, { useContext, createContext, useEffect, useState } from "react";
import { fetchApiForYoutubeData } from "../utils/fetchApi.jsx";

export const context = createContext();

export const AppContext = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState("0");
  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState([]);
  const [mobileMenu, setMobileMenu] = useState(false);

  const fetchYoutubeData = async (params) => {
    setLoading(true);
    try {
      const res = await fetchApiForYoutubeData("videos", params);
      setVideoData(res.items);
      console.log(res.items);
    } catch (error) {
      console.error(error, "Failed to fetch video data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCategory === "0") {
      fetchYoutubeData({
        part: "snippet, contentDetails, statistics",
        chart: "mostPopular",
        regionCode: "IN",
        maxResults: 10,
      });
    } else {
      fetchYoutubeData({
        part: "snippet, contentDetails, statistics",
        chart: "mostPopular",
        regionCode: "IN",
        maxResults: 10,
        videoCategoryId: selectedCategory,
      });
    }
  }, [selectedCategory]);

  return (
    <context.Provider
      value={{
        selectedCategory,
        setSelectedCategory,
        loading,
        setLoading,
        videoData,
        setVideoData,
        mobileMenu,
        setMobileMenu,
      }}
    >
      {children}
    </context.Provider>
  );
};

export const useAppContext = () => useContext(context);
