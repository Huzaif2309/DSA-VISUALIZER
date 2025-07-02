import { useState, useEffect, useRef } from "react";
import algoIcon from "../assets/icon.png";
import { NavLink, useNavigate } from 'react-router'
import { House, Activity, Search, LogIn } from 'lucide-react';
import { motion } from "framer-motion";
import DSAChatbot from "./DSAChatbot";

function Navbar({ algorithm, setAlgorithm }) {
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const searchRef = useRef(null);
  const labelRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        labelRef.current &&
        !labelRef.current.contains(event.target)
      ) {
        setShowSearch(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [])

  const algorithmsList = [
    { name: "Bubble Sort", key: "Bubble Sort" },
    { name: "Selection Sort", key: "Selection Sort" },
    { name: "Insertion Sort", key: "Insertion Sort" },
    { name: "Merge Sort", key: "Merge Sort" },
    { name: "Quick Sort", key: "Quick Sort" },
  ];

  const filterAlgorithms = algorithmsList.filter((algo) =>
    algo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAlgorithmSelection = (algokey) => {
    setAlgorithm([algokey]);
    navigate('/Visualizer')
    setShowSearch(false);
    setSearchQuery("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && filterAlgorithms.length > 0) {
      handleAlgorithmSelection(filterAlgorithms[0].key)
    }
  }

  return (
    <>
      <nav className="pb-2 relative z-50">
        {/* Desktop Navbar */}
        <div className="hidden lg:block w-full">
          <div className="container m-auto w-[50rem] flex justify-between items-center font-semibold rounded-xl gap-2 py-3 px-6 text-white text-lg bg-[#181826] shadow-lg border border-[#23234a]">
            <div className="flex gap-10 rounded-md text-[15px]">
              <NavLink className="flex items-center gap-1 transition hover:text-blue-400" to="/"><House />Home</NavLink>
              <label
                ref={labelRef}
                htmlFor="search1"
                className="flex items-center gap-1 cursor-pointer transition hover:text-blue-400"
                onClick={() => setShowSearch(!showSearch)}
              >
                <Search />Search
              </label>
              <NavLink className="flex items-center gap-1 transition hover:text-blue-400" to="/Visualizer"><Activity />Visualizer</NavLink>
            </div>

            <div className="flex items-center gap-4">
              <DSAChatbot />
              {/* <NavLink className="rounded-md p-1 border text-[15px] flex items-center text-blue-500 hover:text-blue-400" to="/Login"><span>Login</span>&nbsp;<LogIn /></NavLink> */}
            </div>

            <motion.div
              ref={searchRef}
              initial={false}
              animate={{ y: showSearch ? 135 : -500 }}
              transition={{ duration: 0.6, ease: 'anticipate' }}
              className="absolute z-20 w-[30%] mx-4"
            >
              <motion.input
                type="search"
                placeholder="🔍 Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                className="rounded-md w-full font-medium text-white shadow shadow-blue-800 outline-none p-3 bg-[#23234a] border border-[#3b31ac] placeholder-white"
                id="search1"
              />
              {searchQuery && (
                <ul className="absolute top-full left-0 w-full mt-2 rounded-md bg-[#181826] text-white shadow-lg p-2 max-h-60 overflow-y-auto border border-[#3b31ac]">
                  {filterAlgorithms.length > 0 ? (
                    filterAlgorithms.map((algo) => (
                      <li
                        key={algo.key}
                        onClick={() => handleAlgorithmSelection(algo.key)}
                        className="p-2 hover:bg-[#23234a] rounded-md cursor-pointer transition"
                      >
                        {algo.name}
                      </li>
                    ))
                  ) : (
                    <li className="p-2 text-gray-400">No algorithms found!</li>
                  )}
                </ul>
              )}
            </motion.div>
          </div>
        </div>

        {/* Mobile Navbar */}
        <div className="w-full h-14 fixed z-50 bottom-0 lg:hidden">
          <div className="flex justify-around items-center h-full bg-[#181826] border-t border-[#23234a] text-white shadow-[0px_-10px_20px_-10px_rgba(0,0,0,0.7)]">
            <NavLink className="flex flex-col items-center text-sm gap-1 hover:text-blue-500 transition" to="/"><House size={20} />Home</NavLink>
            <label
              htmlFor="search"
              onClick={() => setShowSearch(!showSearch)}
              className="flex flex-col items-center text-sm gap-1 hover:text-blue-500 transition cursor-pointer"
            >
              <Search size={20} />Search
            </label>
            <NavLink className="flex flex-col items-center text-sm gap-1 hover:text-blue-500 transition" to="/Visualizer"><Activity size={20} />Visualizer</NavLink>
            <div className="flex flex-col items-center text-sm gap-1 hover:text-blue-500 transition">
              <DSAChatbot />
            </div>
          </div>

          {/* Mobile Search */}
          <motion.div
            initial={false}
            animate={{ y: showSearch ? 20 : -100 }}
            transition={{ duration: 0.6, ease: 'anticipate' }}
            className="fixed top-1 left-1/2 -translate-x-1/2 w-[92%] md:hidden z-50"
          >
            <motion.input
              type="search"
              placeholder="🔍 Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full p-3 rounded-md shadow shadow-green-600 font-medium outline-none bg-[#23234a] text-white border border-[#3b31ac] placeholder-white"
              id="search"
            />
            {searchQuery && (
              <ul className="absolute top-full left-0 w-full mt-2 rounded-md bg-[#181826] text-white shadow-lg p-2 max-h-60 overflow-y-auto border border-[#3b31ac]">
                {filterAlgorithms.length > 0 ? (
                  filterAlgorithms.map((algo) => (
                    <li
                      key={algo.key}
                      onClick={() => handleAlgorithmSelection(algo.key)}
                      className="p-2 hover:bg-[#23234a] rounded-md cursor-pointer transition"
                    >
                      {algo.name}
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-gray-400">No algorithms found!</li>
                )}
              </ul>
            )}
          </motion.div>
        </div>
      </nav>
    </>
  )
}

export default Navbar