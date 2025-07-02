import { motion } from "motion/react";
import Controller from "./Controller";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { PanelLeft } from "lucide-react";
import RenderBars from './RenderBars';
import handleAlgorithm from "./handleAlgorithm";
import Pseudocode from "./Pseudocode";
import Pseudocodecopy from "./AlgoContent";
import Stack from './DataStructures/Stack'
import  Array from './DataStructures/Array'
import  LinkedList from './DataStructures/LinkedList' 
import Queue from './DataStructures/Queue';

function Visualizer({ algorithm, setAlgorithm }) {
    const [showSidebar, setShowSidebar] = useState(false)
    const [arr, setArr] = useState([76, 89, 35, 57, 79, 97, 75, 53, 31, 47, 70, 52]);
    const [input, setInput] = useState("");
    const [speed, setSpeed] = useState(200); 
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [steps, setSteps] = useState([]);
    const [raceMode, setRaceMode] = useState(false);
    const [raceSteps, setRaceSteps] = useState({});
    const [raceCurrentSteps, setRaceCurrentSteps] = useState({});
    const [winner,setWinner] = useState(null);
    const [searchTarget,setSearchTarget] = useState(null);
    const [algorithmType,setAlgorithmType] = useState("sorting");
    const [stack, setStack] = useState([]); 
    const [list, setList] = useState([]); 
    const [queue, setQueue] = useState([]); 

    useEffect(() => {
        if (algorithm.length > 0) {

               if(algorithm.includes("Binary Search")){
                const isSorted = arr.every((val,i,array)=>i===0 || array[i-1]<=val);
                 if(!isSorted){
                const shouldSort = window.confirm(`The array must be sorted for Binary Search. Do you want to sort it now?`);
                if(shouldSort){
                   const sortedArr = [...arr].sort((a,b)=>a-b);
                    setArr(sortedArr);
                } else{
                    alert("Please use a sorted array for Binary Search.");
                    return;
                }
            }

        }
            
            if (raceMode) {
                handleAlgorithm.initializeRaceMode(arr, algorithm, setRaceSteps, setRaceCurrentSteps, setIsPlaying,searchTarget);
            } else {
                handleAlgorithm.initializeSteps(arr, algorithm[0], setSteps, setCurrentStep, setIsPlaying,searchTarget);
            }
        };
    }, [arr, algorithm, raceMode,searchTarget]);

    useEffect(() => {
        if (!isPlaying) return;
        const interval = setInterval(() => {
            if (raceMode) {
                setRaceCurrentSteps((prev) => {
                    const newSteps = { ...prev };
                    let allDone = true;
                    let fastestAlgo = null;
                    let minSteps = Infinity;
                    algorithm.forEach((algo) => {
                        const maxSteps = (raceSteps[algo]?.length || 0) - 1;
                        if (maxSteps >= 0 && newSteps[algo] < maxSteps) {
                            newSteps[algo] += 1;
                            allDone = false;
                        }
                        if(newSteps[algo]>=maxSteps&&maxSteps<minSteps){
                            minSteps = maxSteps;
                            fastestAlgo = algo;
                        }
                    });
                    if (allDone){
                        setIsPlaying(false);
                        setWinner(fastestAlgo);
                    }
                    return newSteps;
                });
            } else {
                if (currentStep < steps.length - 1) {
                    setCurrentStep((prev) => prev + 1);
                } else {
                    setIsPlaying(false);
                }
            }
        }, [speed]);

        return () => clearInterval(interval);
    }, [isPlaying, currentStep, steps, raceMode, raceSteps, algorithm, speed]);

    useEffect(() => {
        if (
            algorithmType === "dp" &&
            algorithm[0] === "Knapsack" &&
            steps.length > 0
        ) {
            setCurrentStep(steps.length - 1);
        }
        // eslint-disable-next-line
    }, [steps, algorithmType, algorithm]);

    return (
        <div className="relative md:max-w-[95vw] container m-auto pb-16 md:pb-0">
            <div className="block md:hidden w-full bg-gray-950 border-b-2 border-pink-500 z-20">
                <Sidebar
                    algorithm={algorithm}
                    algorithmType={algorithmType}
                    setAlgorithmType={setAlgorithmType}
                    setAlgorithm={setAlgorithm}
                    raceMode={raceMode}
                    setRaceMode={setRaceMode}
                />
            </div>

            {/* Main content area with sidebar and visualization */}
            <div className="flex flex-col-reverse md:flex-row h-[80vh] md:h-[70vh] md:mt-1 md:mb-3 lg:mt-4 gap-2">
                <motion.div
                    initial={true}
                    animate={{
                        width: showSidebar ? "0px" : "28.5%",
                        opacity: showSidebar ? 0 : 1
                    }}
                    className="md:block hidden text-[12px] min-h-[70vh] rounded-2xl [&::-webkit-scrollbar]:hidden border-l-2 border-r-2 border-pink-500 home bg-gray-950 overflow-auto p-3"
                >
                    <Sidebar
                        algorithm={algorithm}
                        algorithmType={algorithmType}
                        setAlgorithmType={setAlgorithmType}
                        setAlgorithm={setAlgorithm}
                        raceMode={raceMode}
                        setRaceMode={setRaceMode}
                    />
                </motion.div>

                {/* Main visualization area */}
                <div className={`flex-1 overflow-auto [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-track]:bg-gradient-to-r [&::-webkit-scrollbar-track]:from-purple-900 [&::-webkit-scrollbar-track]:to-pink-900 [&::-webkit-scrollbar-thumb]:bg-gradient-to-r [&::-webkit-scrollbar-thumb]:from-pink-500 [&::-webkit-scrollbar-thumb]:to-purple-500 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:from-pink-400 [&::-webkit-scrollbar-thumb]:hover:to-purple-400`}>
                    <div className={`w-full shadow-[0px_0px_10px_inset] md:shadow-[0px_0px_20px_inset] shadow-pink-700 ${raceMode ? 'min-h-[80vh]' : 'h-[80vh] md:h-[70vh]'} border-t-2 border-b-2 border-pink-900 rounded-2xl p-3 md:p-4 flex flex-col`}>
                        <div className="flex flex-col p-2 gap-2">
                            {/* Top row with button and algorithm selection */}
                            <div className="flex items-center justify-between">
                                {/* Hide select algorithms button on mobile */}
                                <button className="hidden md:inline-flex cursor-pointer font-semibold text-center inline-flex text-[12px] text-white" onClick={() => setShowSidebar(!showSidebar)}>
                                    <PanelLeft className="p-1 size-8 rounded-md bg-gray-200 text-black" /><span className="pt-1 pl-1 text-sm">&nbsp;Select algorithms</span>
                                </button>
                                <h2 className="text-[10px] lg:text-[15px] font-bold text-blue-500 shadow rounded-md p-1 shadow-[#a63deac8]">
                                    Selected Algorithm : {algorithm.length > 0 ? <strong className="text-[#a3ff12]"> {algorithm.join(", ")}</strong> : <strong className="text-red-600">None</strong>}
                                </h2>
                            </div>
                            
                            {/* Legends row */}
                            {algorithm.length > 0 && (
                                <ul className="text-white flex justify-center gap-2 text-[8px] sm:text-[10px] lg:gap-6 md:text-[10px]">
                                    {algorithmType === "searching" ? (
                                        <>
                                            <li>🔴 Current</li>
                                            <li>🟠 Mid</li>
                                            <li>🟣 Range</li>
                                            <li>🟢 Found</li>
                                        </>
                                    ) : (
                                        <>
                                            <li>🔴 Compared</li>
                                            <li>🟠 Swapped</li>
                                            <li>🟢 Sorted</li>
                                        </>
                                    )}
                                </ul>
                            )}
                        </div>
                        <div>
                            {algorithmType === "stack" && <Stack stack={stack} setStack={setStack} />}
                            {algorithmType === "queue" && <Queue queue={queue} setQueue={setQueue} />}
                            {algorithmType === "linkedlist" && <LinkedList list={list} setList={setList} />}
                            {algorithmType === "array" && <Array list={list} setList={setList} />}
                            {(algorithmType === "sorting" || algorithmType === "searching") && (
                                raceMode ? (
                                <div className={`flex lg:mt-5 lg:flex-row ${algorithm.length == 2 ? "flex-col" : "flex-col"} text-white gap-1 m-1 md:gap-2`}>
                                    {algorithm.map((algo) => (
                                      <div key={algo} className="border p-2 rounded-2xl border-gray-300 flex-1">
                                        <h3 className={`text-sm md:text-md lg:text-xl md:text-center`}>
                                            {algo}
                                        </h3>
                                        <RenderBars arr={arr} steps={raceSteps[algo] || []} currentStep={raceCurrentSteps[algo] || 0} raceMode={raceMode} algorithm={algorithm} searchTarget={searchTarget} algorithmType={algorithmType} />
                                      </div>
                                    ))}
                                </div>
                            ) : (
                                <RenderBars arr={arr} steps={steps} currentStep={currentStep} raceMode={raceMode} algorithm={algorithm} searchTarget={searchTarget} algorithmType={algorithmType}/>
                            )
                                )}
                                {algorithmType === "dp" && algorithm[0] === "Knapsack" && (

                                  <div className="overflow-auto p-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gradient-to-r [&::-webkit-scrollbar-track]:from-gray-800 [&::-webkit-scrollbar-track]:to-gray-700 [&::-webkit-scrollbar-thumb]:bg-gradient-to-r [&::-webkit-scrollbar-thumb]:from-yellow-500 [&::-webkit-scrollbar-thumb]:to-orange-500 [&::-webkit-scrollbar-thumb]:rounded-full">
                                    <div className="mb-2 text-white font-mono text-sm">
                                      <strong>Knapsack using Dynamic Programming&nbsp;</strong>
                                    </div>
                                    {steps.length > 0 && steps[currentStep] && steps[currentStep].dp && (
                                      <table className="border-collapse border border-pink-500 m-auto">
                                        <tbody>
                                          {steps[currentStep].dp.map((row, i) => (
                                            <tr key={i}>
                                              {row.map((cell, j) => (
                                                <td
                                                  key={j}
                                                  className={`border border-pink-500 px-2 py-1 text-center text-white
                                                    ${steps[currentStep].i === i && steps[currentStep].w === j ? "bg-yellow-300 text-black font-bold" : ""}
                                                  `}
                                                >
                                                  {cell}
                                                </td>
                                              ))}
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    )}
                                    {steps[currentStep]?.selectedItems && (
                                      <div className="mt-2 text-green-400 font-bold">
                                        Selected Items: {steps[currentStep].selectedItems.join(", ")}
                                      </div>
                                    )}
                                  </div>
                                )}
                        </div>
                    </div>
                </div>
                
                {/* Pseudocode panel - only visible on large screens and not in race mode */}
                <div className={`lg:block hidden ${raceMode?"md:hidden":""} md:max-w-40 lg:max-w-60 min-h-[70vh] rounded-2xl border-2 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-green-500 [&::-webkit-scrollbar-thumb]:rounded-full`}>
                        {!raceMode && algorithm.length > 0 && (
                        <div className="p-2">
                            <Pseudocodecopy algorithm={algorithm[0]} />
                        </div>
                    )}
                </div>
            </div>

            {/* Controller section - positioned below visualization only */}
            <div className="flex flex-row gap-2 mt-2">
                {/* Empty space for sidebar */}
                <div className="md:block hidden w-[28.5%]"></div>
                
                {/* Controller aligned with visualization area */}
                <div className="flex-1 border-r-2 rounded-2xl shadow-[0px_0px_10px_inset] md:shadow-[0px_0px_20px_inset] shadow-pink-700">
                    <Controller
                        input={input}
                        setInput={setInput}
                        speed={speed}
                        setSpeed={setSpeed}
                        isPlaying={isPlaying}
                        setIsPlaying={setIsPlaying}
                        currentStep={currentStep}
                        setCurrentStep={setCurrentStep}
                        steps={steps}
                        algorithm={algorithm}
                        handleInput={() => {
                            if (algorithmType === "sorting" || algorithmType === "searching") {
                                handleAlgorithm.handleInput(input, setArr, algorithm, setSteps, setCurrentStep, setIsPlaying);
                            } else if (algorithmType === "stack") {
                                setStack(input.split(" ").map(Number).reverse());
                            } else if (algorithmType === "queue") {
                                setQueue(input.split(" ").map(Number));
                            } else if (algorithmType === "linkedlist") {
                                setList(input.split(" ").map(Number));
                            }
                        }}
                        raceMode={raceMode}
                        raceCurrentSteps={raceCurrentSteps}
                        setRaceCurrentSteps={setRaceCurrentSteps}
                        raceSteps={raceSteps}
                        winner={winner}
                        searchTarget={searchTarget}
                        setSearchTarget={setSearchTarget}
                        algorithmType={algorithmType}
                        stack={stack}
                        setStack={setStack}
                        list={list}
                        setList={setList}
                        arr={arr}
                        setArr={setArr}
                        setSteps={setSteps}
                    />
                    
                    {/* Pseudocode for Controller - shown below controller */}
                    {!raceMode && algorithm.length > 0 && (
                        <div className="mt-2">
                            <Pseudocode algorithm={algorithm[0]} />
                        </div>
                    )}
                </div>
                
                {/* Empty space for pseudocode panel on large screens */}
                <div className={`lg:block hidden ${raceMode?"md:hidden":""} w-[25%]`}></div>
            </div>
        </div>
    );
}

export default Visualizer