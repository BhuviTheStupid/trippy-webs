import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden"; // Disable scroll
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="w-screen h-screen bg-black text-white flex items-center justify-center lg:mr-64 relative overflow-hidden">
      {/* Glowing Background Circle */}
      <div className="absolute z-0 w-[400px] h-[400px] lg:mr-64 md:w-[500px] md:h-[500px] rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 blur-3xl opacity-20 animate-spin-slow" />

      {/* Central Animated Name and Tagline */}
      <motion.div
        className="absolute z-10 text-center px-4 lg:mr-64"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2 }}
      >
        <div className="lg:mr-64 text-4xl sm:text-5xl md:text-6xl font-extrabold text-gradient bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent animate-pulse">
          The TrippyWeb
        </div>
        <div className="text-base lg:mr-64 sm:text-xl md:text-2xl mt-4 text-gray-300 italic">
          Dive into the Digital Psychedelia ✨
        </div>
      </motion.div>

      {/* Left Side Buttons */}
      <div className="absolute left-4 sm:left-8 top-1/2 transform -translate-y-1/2 flex flex-col justify-evenly min-h-[250px] md:min-h-[300px] gap-4 z-20">
        {[
          { label: "Music", color: "from-green-400 to-blue-500", path: "/music" },
          { label: "Event", color: "from-yellow-400 to-red-500", path: "/meet-greet" },
          { label: "Fun", color: "from-indigo-400 to-pink-500", path: "/fun" },
        ].map((item, i) => (
          <motion.button
            key={item.label}
            onClick={() => navigate(item.path)}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.3, type: "spring" }}
            className={`w-36 md:w-48 py-3 md:py-4 text-base md:text-lg rounded-full bg-gradient-to-r ${item.color} text-black font-bold shadow-xl hover:scale-105 transition-transform`}
          >
            {item.label}
          </motion.button>
        ))}
      </div>

      {/* Right Side Buttons */}
      <div className="absolute right-4 sm:right-8 top-1/2 transform -translate-y-1/2 flex flex-col justify-evenly min-h-[250px] md:min-h-[300px] gap-4 z-20">
        {[
          { label: "Videos", color: "from-pink-400 to-red-500", path: "/videos" },
          { label: "Blogs", color: "from-blue-400 to-purple-500", path: "/blogs" },
          { label: "Art", color: "from-green-300 to-indigo-500", path: "/art" },
        ].map((item, i) => (
          <motion.button
            key={item.label}
            onClick={() => navigate(item.path)}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.3, type: "spring" }}
            className={`w-36 md:w-48 py-3 md:py-4 text-base md:text-lg rounded-full bg-gradient-to-r ${item.color} text-black font-bold shadow-xl hover:scale-105 transition-transform`}
          >
            {item.label}
          </motion.button>
        ))}
      </div>

      {/* Circuit Lines */}
      <svg className="absolute color-orange inset-0 w-full h-full z-0 pointer-events-none">
        <defs>
          <linearGradient id="circuit" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ffcc" />
            <stop offset="100%" stopColor="#ff00cc" />
          </linearGradient>
        </defs>
        <circle
          cx="50%"
          cy="50%"
          r="160"
          stroke="url(#circuit)"
          strokeWidth="2"
          fill="none"
          className="animate-pulse"
        />
        <line
          x1="15%"
          y1="50%"
          x2="50%"
          y2="50%"
          stroke="url(#circuit)"
          strokeWidth="1.5"
          strokeDasharray="4"
        />
        <line
          x1="85%"
          y1="50%"
          x2="50%"
          y2="50%"
          stroke="url(#circuit)"
          strokeWidth="1.5"
          strokeDasharray="4"
        />
      </svg>
    </div>
  );
};

export default Home;
