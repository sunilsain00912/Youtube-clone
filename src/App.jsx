import React from "react";
import Header from "./Components/HeaderSection/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Feed from "./Components/FeedSection/Feed";
import SearchVideoResult from "./Components/SearchSection/SearchVideoResult";
import VideoDetails from "./Components/VideoSection/VideoDetails";
import ChannelPage from "./Components/ChannelPage/ChannelPage"; // 🆕 import channel page
import { AppContext } from "./useContextHook/useContextApi";
import { ThemeProvider } from "./useContextHook/useTheme";

const App = () => {
  return (
    <AppContext>
      <ThemeProvider>
        <BrowserRouter>
          <div className="flex flex-col w-full">
            {/* Header */}
            <Header />

            {/* Routes */}
            <Routes>
              <Route path="/" element={<Feed />} />
              <Route path="/search/:searchQuery" element={<SearchVideoResult />} />
              <Route
                path="/video/:categoryId/:videoId"
                element={<VideoDetails />}
              />
              
              {/* 🆕 Channel Page Route */}
              <Route path="/channel/:channelId" element={<ChannelPage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </AppContext>
  );
};

export default App;
