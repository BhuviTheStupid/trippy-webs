import { useEffect, useState } from "react";
import { supabase } from "../../supabase";

const Air = () => {
  const [songs, setSongs] = useState([]);
  const [playing, setPlaying] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      const { data, error } = await supabase
        .from("songs")
        .select("*")
        .eq("theme", "air");

      if (error) console.error("Supabase error:", error);
      else setSongs(data);
    };

    fetchSongs();
  }, []);

  useEffect(() => {
    songs.forEach((_, index) => {
      const audio = document.getElementById(`audio-${index}`);
      if (audio) {
        audio.onplay = () => {
          setPlaying(index);
          setIsPaused(false);
          setShowPlayer(true);
        };
        audio.onpause = () => setIsPaused(true);
        audio.onended = () => setIsPaused(true);
      }
    });
  }, [songs]);

  const handlePlay = (index) => {
    const audio = document.getElementById(`audio-${index}`);
    if (!audio) return;

    if (playing === index && !audio.paused) {
      audio.pause();
    } else {
      if (playing !== null && playing !== index) {
        const prev = document.getElementById(`audio-${playing}`);
        if (prev) {
          prev.pause();
          prev.currentTime = 0;
        }
      }
      setPlaying(index);
      setIsPaused(false);
      setShowPlayer(true);
      audio.play();
    }
  };

  const handleToggleBottomPlay = () => {
    if (playing === null) return;
    const audio = document.getElementById(`audio-${playing}`);
    if (!audio) return;

    if (audio.paused) audio.play();
    else audio.pause();
  };

  const handleClosePlayer = () => {
    if (playing !== null) {
      const current = document.getElementById(`audio-${playing}`);
      current?.pause();
      current.currentTime = 0;
    }
    setShowPlayer(false);
    setPlaying(null);
    setIsPaused(true);
  };

  const handleNext = () => {
    if (songs.length <= 1) return;

    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * songs.length);
    } while (nextIndex === playing);

    const nextAudio = document.getElementById(`audio-${nextIndex}`);
    if (!nextAudio) return;

    if (playing !== null) {
      const current = document.getElementById(`audio-${playing}`);
      current?.pause();
      current.currentTime = 0;
    }

    setPlaying(nextIndex);
    setIsPaused(false);
    setShowPlayer(true);
    nextAudio.play();
  };

  return (
    <div className="min-h-screen bg-[#0c1117] px-6 py-10 text-white pb-28 relative">
      <h1 className="text-4xl font-bold text-center mb-12 text-cyan-300 drop-shadow-glow">
        ☁️ Air Drift: Floaty Tones
      </h1>

      {songs.length === 0 ? (
        <p className="text-center text-cyan-200 text-lg">
          No songs found for this theme.
        </p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {songs.map((song, index) => (
            <div
              key={song.id}
              className="bg-[#1b232d] hover:bg-[#1f2c3a] rounded-xl p-4 shadow-md hover:shadow-cyan-400/30 transition-all duration-300 group"
            >
              <img
                src={song.thumbnail_url || "/images/default-thumb.jpg"}
                alt={song.name}
                className="rounded-md h-48 w-full object-cover mb-3 border border-cyan-400/10"
                onError={(e) => (e.target.src = "/images/default-thumb.jpg")}
              />
              <audio id={`audio-${index}`} src={song.file_url}></audio>

              <div className="flex justify-between items-center mt-2">
                <div>
                  <h2 className="text-lg font-semibold text-cyan-200 truncate">
                    {song.name || "Untitled Track"}
                  </h2>
                  <p className="text-sm text-cyan-100 opacity-80 italic">by Drift Pilot</p>
                </div>
                <button
                  onClick={() => handlePlay(index)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300 shadow-md border-2 ${
                    playing === index && !isPaused
                      ? "bg-indigo-600 hover:bg-indigo-500 border-indigo-300 text-white"
                      : "bg-cyan-600 hover:bg-cyan-500 border-cyan-300 text-white"
                  } hover:scale-110 ml-3`}
                >
                  {playing === index && !isPaused ? "⏸" : "▶️"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sticky Bottom Player */}
      {showPlayer && playing !== null && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#1a1f25] border-t border-gray-800 px-4 py-3 flex items-center justify-between z-50 shadow-lg">
          <div className="flex items-center gap-4 overflow-hidden">
            <img
              src={songs[playing]?.thumbnail_url || "/images/default-thumb.jpg"}
              alt="now playing"
              className="w-14 h-14 object-cover rounded-md"
            />
            <div>
              <h3 className="text-white font-semibold truncate max-w-[200px]">
                {songs[playing]?.name || "No song playing"}
              </h3>
              <p className="text-sm text-gray-400">Air Vibe • Drift Pilot</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleNext}
              className="bg-indigo-500 hover:bg-indigo-400 text-white text-lg px-4 py-2 rounded-full shadow transition"
              title="Next random"
            >
              ⏭
            </button>
            <button
              onClick={handleToggleBottomPlay}
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-lg px-4 py-2 rounded-full shadow transition-all"
            >
              {isPaused ? "▶️ Play" : "⏸ Pause"}
            </button>
            <button
              onClick={handleClosePlayer}
              className="text-white hover:text-red-400 text-2xl px-3"
              title="Close Player"
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Air;
