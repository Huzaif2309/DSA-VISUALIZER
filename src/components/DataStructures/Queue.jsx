import React from "react";

const Queue = ({ queue, setQueue }) => {
  const [input, setInput] = React.useState("");

  const handleEnqueue = () => {
    if (input.trim() === "") return;
    setQueue([...queue, input]);
    setInput("");
  };

  const handleDequeue = () => {
    if (queue.length === 0) return;
    setQueue(queue.slice(1));
  };

  const handleClear = () => {
    setQueue([]);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          maxLength={8}
          onChange={(e) => setInput(e.target.value)}
          className="px-3 py-1 rounded-md border border-blue-400 bg-gray-900 text-white"
          placeholder="Value"
        />
        <button
          onClick={handleEnqueue}
          className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        >
          Enqueue
        </button>
        <button
          onClick={handleDequeue}
          className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold"
        >
          Dequeue
        </button>
        <button
          onClick={handleClear}
          className="px-3 py-1 rounded-md bg-gray-600 hover:bg-gray-700 text-white font-semibold"
        >
          Clear
        </button>
      </div>
      <div className="flex items-center gap-2 mt-2">
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
    </div>
  );
};

export default Queue;