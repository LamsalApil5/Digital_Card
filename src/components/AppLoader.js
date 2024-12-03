import React, { useState, useEffect } from "react";

const AppLoader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false); 
    }, 1000); 
  }, []);

  return (
    <div
      className="bg-white" 
    >
      {/* Loader without background overlay */}
      {isLoading && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-white">
          <div className="w-16 h-16 border-4 border-t-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Your app content */}
      {!isLoading && <div className="app-content"></div>}
    </div>
  );
};

export default AppLoader;
