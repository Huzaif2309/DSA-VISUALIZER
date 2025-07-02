import { motion, AnimatePresence } from "motion/react"

function Stack({ stack }) {
    return (
        <div className='flex flex-col items-center p-2 h-full rounded-xl w-full'>
            <div className="bg-clip-text text-transparent p-1 rounded-xl bg-gradient-to-r text-2xl from-purple-400 via-green-500 to-white font-bold mb-4">
                The length of Stack : {stack.length}
            </div>
            <div className='flex flex-col-reverse gap-3 w-full max-w-[500px] h-full max-h-[48vh] overflow-auto p-2 shadow-md shadow-pink-800 rounded-lg'>
                <AnimatePresence mode="popLayout">
                    {stack.length === 0 ? (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-gray-400 text-center py-8"
                        >Stack is empty </motion.p>
                    ) : (
                        stack.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                                animate={{
                                    opacity: 1, y: 0, scale: 1, transition: {
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 25,
                                    }
                                }}
                                exit={{
                                    y: -50,
                                    opacity: 0.8,
                                    transition: {
                                        duration: 0.5,
                                        ease: "easeInOut"
                                    },
                                    background: "red"
                                }}
                                whileHover={{
                                    scale: 1.02,
                                    transition: { duration: 0.2 }
                                }}
                                className="bg-gradient-to-r from-blue-600 to-blue-400 text-3xl text-white font-bold p-4 rounded-lg text-center shadow-lg shadow-blue-500/20 backdrop-blur-sm"
                            >
                                {item}
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default Stack