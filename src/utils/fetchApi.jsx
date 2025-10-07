import axios from "axios";

const BASE_URL = "https://www.googleapis.com/youtube/v3";
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export const fetchApiForYoutubeData = async (endpoint, params = {}) => {
  try {
    const response = await axios.get(`${BASE_URL}/${endpoint}`, {
      params: {
        ...params,
        key: API_KEY,
      },
    });

    console.log("This is my response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching YouTube data:", error.message);
    return null;
  }
};

//37.38 yt
