import React from 'react';

const Construction = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800 p-6">
      <div className="max-w-md text-center">
        {/* Visual Icon */}
        <div className="mb-8 flex justify-center">
          <div className="p-4 bg-yellow-100 rounded-full">
            <svg 
              className="w-16 h-16 text-yellow-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" 
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-4xl font-bold mb-4 tracking-tight">
          Under Construction
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          We're currently working hard to bring you a better experience. 
          Check back soon!
        </p>
      </div>
      
      <footer className="mt-16 text-sm text-gray-400">
        &copy; {new Date().getFullYear()} Alta Maritime. All rights reserved.
      </footer>
    </div>
  );
};

export default Construction;