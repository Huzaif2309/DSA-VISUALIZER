import React from "react";

const Queue = ({ queue }) => (
  <div className="flex items-center gap-2 mt-2 justify-center">
    <span className="text-xs text-gray-400">Front</span>
    {queue.length === 0 ? (
      <div className="px-4 py-2 rounded bg-gray-800 text-gray-400 border border-gray-700">Empty</div>
    ) : (
      queue.map((item, idx) => (
        <div
          key={idx}
          className={`px-4 py-2 rounded bg-blue-500 text-white border border-blue-700 font-bold text-lg transition-all duration-200 ${
            idx === 0 ? "ring-2 ring-green-400" : ""
          }`}
        >
          {item}
        </div>
      ))
    )}
    <span className="text-xs text-gray-400">Rear</span>
  </div>
);

export default Queue;