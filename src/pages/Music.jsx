// import { useNavigate } from "react-router-dom";

// const themes = [
//   {
//     name: "Slow Waves",
//     slug: "slow",
//     color: "from-purple-500 to-pink-500",
//     emoji: "🌊",
//     desc: "Relax with ambient vibes and neural drift.",
//   },
//   {
//     name: "Hyper Pulse",
//     slug: "fast",
//     color: "from-red-500 to-yellow-500",
//     emoji: "⚡",
//     desc: "Feel the surge of speed and energy.",
//   },
//   {
//     name: "Air Drift",
//     slug: "air",
//     color: "from-cyan-400 to-indigo-500",
//     emoji: "☁️",
//     desc: "Float weightlessly through sound and sky.",
//   },
//   {
//     name: "Earth Core",
//     slug: "earth",
//     color: "from-green-600 to-amber-600",
//     emoji: "🌌",
//     desc: "Dive deep into earthy, grounded tones.",
//   },
// ];

// const Music = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="relative min-h-screen overflow-hidden">
//       {/* Content */}
//       <div className="relative z-10 min-h-screen px-4 py-10 text-center">
//         <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-400 text-shadow-lg mb-10">
//           🎶 Choose Your Trippy Soundscape
//         </h1>
//         <p className="text-white">Hypnotic loops and audios are on the way...</p>

//         {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
//           {themes.map((theme) => (
//             <div
//               key={theme.slug}
//               onClick={() => navigate(`/music/${theme.slug}`)}
//               className={`cursor-pointer bg-gradient-to-br ${theme.color} text-white p-6 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] transform hover:scale-105 transition-all duration-300`}
//             >
//               <h2 className="text-3xl font-bold mb-2">
//                 {theme.emoji} {theme.name}
//               </h2>
//               <p className="text-md opacity-80">{theme.desc}</p>
//             </div>
//           ))}
//         </div> */}
//       </div>
//     </div>
//   );
// };

// export default Music;





import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabase";

const ITEMS_PER_PAGE = 30;

const Music = () => {
  const [tracks, setTracks] = useState([]);
  const [filteredTracks, setFilteredTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");
  const [themes, setThemes] = useState([]);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [page, setPage] = useState(1);
  const audioRef = useRef(null);
  const animationRef = useRef(null);

  // Fetch songs and set themes
  useEffect(() => {
    const fetchTracks = async () => {
      const { data, error } = await supabase.from("songs").select("*");
      if (!error && data) {
        const validTracks = data.filter(track => track.thumbnail_url && track.file_url);
        setTracks(validTracks);
        setFilteredTracks(validTracks);

        // Extract unique themes
        const themeList = [...new Set(validTracks.map(t => t.theme).filter(Boolean))];
        setThemes(themeList);
      }
    };
    fetchTracks();
  }, []);

  // Filter tracks by search and theme
  useEffect(() => {
    let result = tracks;
    if (selectedTheme) {
      result = result.filter(track => track.theme === selectedTheme);
    }
    if (searchTerm) {
      result = result.filter(
        track =>
          track.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          track.theme?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredTracks(result);
    setPage(1);
  }, [searchTerm, selectedTheme, tracks]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.pause() : audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const percent = e.nativeEvent.offsetX / e.currentTarget.clientWidth;
    audioRef.current.currentTime = percent * audioRef.current.duration;
  };

  const handleEnd = () => {
    if (repeat) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      return;
    }

    if (shuffle) {
      const nextIndex = Math.floor(Math.random() * filteredTracks.length);
      setCurrentTrack(filteredTracks[nextIndex]);
      setTimeout(() => audioRef.current?.play(), 100);
      return;
    }

    const currentIndex = filteredTracks.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % filteredTracks.length;
    setCurrentTrack(filteredTracks[nextIndex]);
    setTimeout(() => audioRef.current?.play(), 100);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };
    audio.addEventListener("timeupdate", updateProgress);
    return () => audio.removeEventListener("timeupdate", updateProgress);
  }, [currentTrack]);

  useEffect(() => {
    if (!isPlaying) return;
    const pulse = () => {
      const hue = Math.floor((progress * 3.6 + 200) % 360);
      const bar = document.getElementById("progress-bar");
      if (bar) bar.style.backgroundColor = `hsl(${hue}, 100%, 60%)`;
      animationRef.current = requestAnimationFrame(pulse);
    };
    animationRef.current = requestAnimationFrame(pulse);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isPlaying, progress]);

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedTracks = filteredTracks.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredTracks.length / ITEMS_PER_PAGE);

  return (
    <div className="text-white p-4 pb-24">
      <h1 className="text-3xl font-bold mb-4">🎧 Trippy Beats Collection</h1>

      {/* Search + Theme Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-6">
        <input
          className="w-full md:w-1/2 p-2 bg-gray-800 rounded outline-none text-white mb-2 md:mb-0"
          placeholder="Search by name or theme..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="w-full md:w-1/3 p-2 bg-gray-800 text-white rounded"
          value={selectedTheme}
          onChange={(e) => setSelectedTheme(e.target.value)}
        >
          <option value="">🎨 All Themes</option>
          {themes.map((theme) => (
            <option key={theme} value={theme}>
              {theme}
            </option>
          ))}
        </select>
      </div>

      {/* Tracks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {paginatedTracks.map((track) => (
          <div
            key={track.id}
            className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition cursor-pointer"
            onClick={() => {
              setCurrentTrack(track);
              setIsPlaying(true);
              setTimeout(() => audioRef.current?.play(), 100);
            }}
          >
            <img src={track.thumbnail_url} alt="Thumbnail" className="w-full h-24 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-bold truncate">{track.name}</h2>
              <p className="text-sm text-gray-400">{track.theme}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center items-center gap-4 text-lg">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className={`px-4 py-2 rounded ${page === 1 ? "bg-gray-700" : "bg-purple-600 hover:bg-purple-500"}`}
        >
          ⬅️ Prev
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className={`px-4 py-2 rounded ${page === totalPages ? "bg-gray-700" : "bg-purple-600 hover:bg-purple-500"}`}
        >
          Next ➡️
        </button>
      </div>

      {/* Bottom Music Bar */}
      {currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-90 border-t border-gray-700 px-6 py-4 flex items-center justify-between z-50">
          <div className="flex items-center gap-4">
            <img
              src={currentTrack.thumbnail_url}
              alt="Thumb"
              className="w-14 h-14 rounded object-cover"
            />
            <div>
              <h3 className="font-semibold">{currentTrack.name}</h3>
              <p className="text-sm text-gray-400">{currentTrack.theme}</p>
            </div>
          </div>

          <div className="flex-1 mx-4">
            <div
              className="w-full h-2 bg-gray-700 rounded cursor-pointer"
              onClick={handleSeek}
            >
              <div
                id="progress-bar"
                className="h-full bg-purple-500 rounded transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <button
              className="text-white text-xl px-3 py-2 hover:scale-110"
              onClick={() => setRepeat(!repeat)}
              title="Repeat"
            >
              🔁
              <span className={`text-sm ${repeat ? "text-green-400" : "text-gray-400"}`}>
                {repeat ? " On" : " Off"}
              </span>
            </button>

            <button
              className="text-white text-xl px-3 py-2 hover:scale-110"
              onClick={() => setShuffle(!shuffle)}
              title="Shuffle"
            >
              🔀
              <span className={`text-sm ${shuffle ? "text-green-400" : "text-gray-400"}`}>
                {shuffle ? " On" : " Off"}
              </span>
            </button>

            <button
              className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded"
              onClick={togglePlay}
            >
              {isPlaying ? "⏸ Pause" : "▶️ Play"}
            </button>
          </div>

          <audio
            ref={audioRef}
            src={currentTrack.file_url}
            autoPlay
            onEnded={handleEnd}
          />
        </div>
      )}
    </div>
  );
};

export default Music;

