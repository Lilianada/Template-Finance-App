import React from "react";

function LoadingScreen() {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 flex justify-center items-center z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-900"></div>
      </div>
    );
  }
  
  export default LoadingScreen;
  