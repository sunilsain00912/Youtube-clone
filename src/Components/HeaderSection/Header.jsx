import React, { useState } from "react";
import { useAppContext } from "../../useContextHook/useContextApi.jsx";
import { useTheme } from "../../useContextHook/useTheme.jsx";
import Loader from "../../utils/loader.jsx";
import { CgClose } from "react-icons/cg";
import { SlMenu } from "react-icons/sl";
import { Link, useNavigate } from "react-router-dom";

import { IoIosSearch, IoMdMic, IoMdMicOff } from "react-icons/io";
import { MdVideoCall } from "react-icons/md";
import { FaBell } from "react-icons/fa";
import { RiAccountCircleLine } from "react-icons/ri";
import { FiMoon, FiSun } from "react-icons/fi";
import useSpeechRecognitions from "../../useContextHook/useSpeechRecognition.jsx";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { loading, mobileMenu, setMobileMenu } = useAppContext();
  const { isDarkMode, toggleTheme } = useTheme();

  const navigate = useNavigate();

  const { listening, stopListening, startListening, browserSupportsSpeechRecognition } =
    useSpeechRecognitions(setSearchQuery);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const handleSearchQuery = () => {
    if (searchQuery?.length > 0) navigate(`/search/${searchQuery}`);
  };

  const handleClearSearchQuery = () => setSearchQuery("");

  const mobileToggleMenu = () => setMobileMenu(!mobileMenu);

  return (
    <div
      className={`sticky top-0 z-10 flex flex-row items-center justify-between h-20 shadow-lg px-4 md:px-5 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-700"
      }`}
    >
      {loading && <Loader />}

      {/* Left section: menu + logo */}
      <div className="flex items-center">
        {/* Hamburger */}
        <div
          className={`flex md:hidden mr-4 cursor-pointer items-center justify-center h-9 w-9 rounded-full ${
            isDarkMode
              ? "hover:bg-gray-700"
              : "hover:bg-gray-200"
          }`}
          onClick={mobileToggleMenu}
        >
          {mobileMenu ? (
            <CgClose className="text-lg" />
          ) : (
            <SlMenu className="text-lg" />
          )}
        </div>

        {/* Logo */}
        <Link to="/" className="flex items-center h-20">
          <img
            src="/yt_dekstop.png"
            alt="youtube_desktop_logo"
            className={`hidden md:block h-full object-contain ${
              isDarkMode ? "invert" : ""
            }`}
          />
          <img
            src="/youtube_mobile.png"
            alt="youtube_mobile_logo"
            className={`block md:hidden h-20 object-contain ${
              isDarkMode ? "invert" : ""
            }`}
          />
        </Link>
      </div>

      {/* Center: search bar */}
      <div className="flex items-center group relative">
        <div
          className={`flex h-10 md:ml-10 md:pl-5 border rounded-l-3xl ${
            isDarkMode ? "border-gray-700" : "border-gray-300"
          }`}
        >
          <div className="w-10 items-center justify-center hidden group-focus-within:md:flex">
            <IoIosSearch className="text-xl" />
          </div>
          <input
            type="text"
            placeholder="Search anything..."
            className={`pl-5 text-sm bg-transparent outline-none md:pl-0 w-32 sm:w-44 md:w-64 lg:w-[500px] ${
              isDarkMode ? "text-white" : "text-black"
            }`}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyUp={(e) => e.key === "Enter" && handleSearchQuery()}
            value={searchQuery}
          />
          {searchQuery && (
            <button
              className="absolute right-24 md:right-32 top-1/2 transform -translate-y-1/2"
              onClick={handleClearSearchQuery}
            >
              <CgClose className="text-xl" />
            </button>
          )}
        </div>

        {/* Search button */}
        <button
          className={`flex items-center justify-center w-[40px] md:w-[60px] h-10 rounded-r-3xl border border-l-0 ${
            isDarkMode
              ? "border-gray-700 bg-gray-700 hover:bg-gray-600"
              : "border-gray-300 bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={handleSearchQuery}
        >
          <IoIosSearch className="text-xl" />
        </button>

        {/* Mic button */}
        <button
          className={`flex items-center justify-center w-[40px] md:w-[60px] h-8 md:h-10 rounded-full ml-2 ${
            isDarkMode
              ? "hover:bg-gray-700"
              : "hover:bg-gray-200"
          }`}
          onClick={() => (listening ? stopListening() : startListening())}
        >
          {listening ? (
            <IoMdMicOff className="text-xl" />
          ) : (
            <IoMdMic className="text-xl" />
          )}
        </button>
      </div>

      {/* Right section: icons */}
      <div className="flex items-center space-x-2 md:space-x-4">
        <button
          className={`hidden md:flex items-center justify-center h-10 w-10 rounded-full ${
            isDarkMode
              ? "hover:bg-gray-700"
              : "hover:bg-gray-200"
          }`}
        >
          <MdVideoCall className="text-xl" />
        </button>

        <button
          className={`hidden md:flex items-center justify-center h-10 w-10 rounded-full ${
            isDarkMode
              ? "hover:bg-gray-700"
              : "hover:bg-gray-200"
          }`}
        >
          <FaBell className="text-xl" />
        </button>

        <div className="flex space-x-2">
          <button
            className={`hidden md:flex items-center justify-center h-10 w-10 rounded-full ${
              isDarkMode
                ? "hover:bg-gray-700"
                : "hover:bg-gray-200"
            }`}
          >
            <RiAccountCircleLine className="text-xl" />
          </button>
          <button
            onClick={toggleTheme}
            className={`flex items-center justify-center h-10 w-10 rounded-full ${
              isDarkMode
                ? "hover:bg-gray-700"
                : "hover:bg-gray-200"
            }`}
          >
            {isDarkMode ? (
              <FiSun className="text-xl text-yellow-300" />
            ) : (
              <FiMoon className="text-xl text-gray-800" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
