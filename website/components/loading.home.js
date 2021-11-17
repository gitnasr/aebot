import React from 'react'

function LoadingHomeShimmer() {
    return (
        <div
        className="border border-blue-300 shadow rounded-md p-4 max-w-lg w-full mx-auto mt-5 h-auto space-x-1"
        dir="rtl"
      >
        <div className="animate-pulse flex flex-col sm:flex-row space-x-4 m-auto">
        <div className=" bg-blue-400 h-auto w-3/6 rounded-md"></div>
        <div className="flex-1 space-y-4 py-1 p-2">
          <div className="h-4 bg-blue-400 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-blue-400 rounded"></div>
            <div className="h-4 bg-blue-400 rounded w-5/6"></div>
            <div className="h-4 bg-blue-400 rounded w-5/12"></div>
            <div className="h-4 bg-blue-400 rounded w-4/6"></div>
            <div className="h-7 bg-blue-400 rounded-full w-7  mx-auto"></div>
            <div className="h-12 bg-blue-400 rounded w-full"></div>
          </div>
        </div>
      </div>
      </div>
    )
}

export default LoadingHomeShimmer
