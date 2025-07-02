import { motion } from "motion/react";
import { useState } from "react";

function RenderBars({ arr, steps, currentStep,raceMode,algorithm,algorithmType, searchTarget}) {
  const current = steps[currentStep] || {
    array: arr,
    compare: [],
    swap: [], 
    sorted: [],
  ...(algorithmType ==="searching" ? {
    current:-1,
    found:-1,
    left:-1,
    right:-1,
    mid:-1,
    target:searchTarget
  }:{})
  }
  const [viewMode, setViewMode] = useState("box");

  const barWidth = 42;
  const barSpacing = 50;
  const boxSize = 60;
  const gap = 10;
  
  // Fixed height calculation to prevent overflow
  const maxBarHeight = raceMode && algorithm.length >= 2 ? 120 : 180; // Reduced height for race mode
  const topPadding = 60; // Space for text above bars
  const bottomPadding = 60; // Space for indices below bars
  const leftPadding = 30; // Left margin to prevent touching border
  const rightPadding = 30; // Right margin to prevent touching border
  const totalSVGHeight = maxBarHeight + topPadding + bottomPadding;
  const totalSVGWidth = (arr.length * (viewMode === "bars" ? barSpacing : (boxSize + gap))) + leftPadding + rightPadding;
  const maxValue = arr.length > 0 ? Math.max(...arr) : 1;
  const scale = maxBarHeight / maxValue; // Scale bars to fit within maxBarHeight

  const getColor = (index, current) => {
    if(algorithmType ==="searching"){
            if(current.found === index) return "#16e53c";
            if(current.current === index) return "#ff1c1ce9";
            if(current.mid === index) return "orange";
            if(current.left <= index & index <= current.right) return "purple";
            return "steelblue";
        }
    else{
    if (current.sorted?.includes(index)) return "#16e53c";
    if (current.swap?.includes(index)) return "orange";
    if (current.compare?.includes(index)) return "#ff1c1ce9";
    return "steelblue";
  }
};
  
    const isSearchComplete = currentStep === steps.length - 1;
    const isFound = current.found !== -1;

  return (
    <div className="flex flex-col justify-center items-center h-full overflow-hidden">
      <button className={`shadow mt-2 active:scale-90 shadow-gray-500 font-semibold text-green-700 hover:text-yellow-600 hover:shadow-gray-400 ${algorithm.length>=2?" md:mt-1 absolute top-[-30px] right-0 md:top-0 md:relative py-1 mt-1 md:px-4 md:py-2 px-2 text-[10px]":"px-4 py-2"}  rounded-2xl cursor-pointer`} onClick={() => setViewMode(viewMode === "bars" ? 'box' : 'bars')}>{viewMode==='bars'?'Box':'Bars'}</button>

            {algorithmType === "searching" && isSearchComplete && (
                <motion.div
                initial={{opacity:0, scale:0.5}}
                animate={{opacity:1,scale:1}}
                transition={{duration:0.5,ease:"easeOut"}}
                className="mt-3 text-sm lg:text-xl font-semibold">
                {isFound? <div className="rounded-md p-1 shadow-sm shadow-green-500 text-green-500"> <strong className="font-extrabold">{searchTarget}</strong> Found 🎉😊</div>: <div className="rounded-md p-1 shadow-sm shadow-rose-500 text-rose-500"> <strong className="font-extrabold text-rose-700">{searchTarget}</strong> not found 🥲</div>}
                </motion.div>
            )}

      
            {algorithmType === "sorting" && currentStep === steps.length - 1 && (
                <motion.div
                initial={{opacity:0, scale:0.5}}
                animate={{opacity:1,scale:1}}
                transition={{duration:0.5,ease:"easeOut"}}
                className={`mt-2 shadow shadow-gray-500 p-1 ${algorithm.length >= 2 ? "lg:text-[10px]" : ""} text-[10px] mx-4 lg:text-xl font-semibold text-white`}>
               ✅ Sorting Completed 🎉 Sorted Array : [{current.array.join(", ")}]
                </motion.div>
            )}
      
      {/* Add a scrollable container for the SVG */}
      <div className={`w-full ${algorithm.length==2?"flex-row":"flex-col"} ${raceMode && algorithm.length==3?"h-[15vh] lg:h-[50vh]":"h-[26vh] lg:h-[50vh]"} overflow-auto`}>
        <svg className="p-2 w-full h-full"
          viewBox={`0 0 ${totalSVGWidth} ${totalSVGHeight}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {
            current.array.map((value, index) => (
              <g key={index}>
                {viewMode === "bars" ? (
                  <motion.rect
                    x={leftPadding + index * barSpacing} // Add left padding
                    y={topPadding + maxBarHeight - value * scale} // Start from topPadding + maxBarHeight and go upward
                    width={barWidth}
                    rx={5} ry={5}
                    height={value * scale}
                    fill={getColor(index, current)}
                    transition={{ duration: 0.3, ease: 'linear' }}
                  />
                ) : (
                  <motion.rect
                    x={leftPadding + index * (boxSize + gap)} // Add left padding
                    y={topPadding + (maxBarHeight - boxSize) / 2} // Center the box vertically
                    width={boxSize}
                    height={boxSize}
                    rx={10} ry={10}
                    fill={getColor(index, current)}
                    transition={{ duration: 0.3, ease: 'linear' }}
                  />
                )}
                <text
                  x={leftPadding + index * (viewMode === "bars" ? barSpacing : (boxSize + gap)) + (viewMode === "bars" ? barWidth / 2 : boxSize / 2)} // Add left padding
                  y={viewMode === "bars" ? topPadding + maxBarHeight - value * scale - 10 : topPadding + (maxBarHeight - boxSize) / 2 + boxSize / 2 + 8} // Position text above bars or center in box
                  textAnchor="middle"
                  fill="yellow"
                  fontWeight='bold'
                  fontSize={25}
                >
                  {value}
                </text>
                <text
                  x={leftPadding + index * (viewMode === "bars" ? barSpacing : (boxSize + gap)) + (viewMode === "bars" ? barWidth / 2 : boxSize / 2)} // Add left padding
                  y={topPadding + maxBarHeight + 35} // Position indices below the bars/boxes
                  textAnchor="middle"
                  fill="white"
                  fontWeight='bold'
                  fontSize={20}
                >
                  {index}
                </text>
              </g>
            ))
          }
        </svg>
      </div>
    </div>
  )
}

export default RenderBars;