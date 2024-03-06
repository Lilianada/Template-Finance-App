import React from "react";

const DotLoader = () => {
    return (
      <div className="flex justify-center items-center">
        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-pulse"></div>
        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-pulse ml-1.5" style={{ animationDelay: '0.5s' }}></div>
        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-pulse ml-1.5" style={{ animationDelay: '1s' }}></div>
      </div>
    );
  };
  
  export default DotLoader;
  