import React, { useState, useEffect } from "react";

const Loader = () => {
  const [currentProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    const loader = setInterval(() => {
      setCurrentProgress((prevProgress) => {
        let newProgress = prevProgress + Math.random() * 40;
        if (newProgress > 100) newProgress = 100;
        if (newProgress === 100) clearInterval(loader);
        return newProgress;
      });
    }, 800);

    return () => clearInterval(loader);
  }, []);

  return (
    <div className="h-1 bg-red-500 transition-all duration-200 absolute z-40 top-0"
    style={{ width: `${currentProgress}%` }}>
       
    </div>
  );
};

export default Loader;
