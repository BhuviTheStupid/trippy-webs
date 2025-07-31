// import { useEffect, useRef } from "react";

// const TripVisualizer = () => {
//   const videoRef = useRef(null);
//   const animationRef = useRef(null);
//   const audioCtxRef = useRef(null);
//   const analyserRef = useRef(null);
//   const dataArrayRef = useRef(null);
//   const containerRef = useRef(null);

//   useEffect(() => {
//     const video = videoRef.current;

//     const init = async () => {
//       try {
//         video.volume = 1;
//         await video.play();
//         setupAudioReactiveVibration();
//       } catch (err) {
//         console.error("Autoplay error:", err);
//       }
//     };

//     init();

//     return () => cleanup();
//   }, []);

//   const setupAudioReactiveVibration = () => {
//     const video = videoRef.current;
//     const container = containerRef.current;
//     const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
//     const source = audioCtx.createMediaElementSource(video);
//     const analyser = audioCtx.createAnalyser();
//     analyser.fftSize = 256;

//     const dataArray = new Uint8Array(analyser.frequencyBinCount);

//     source.connect(analyser);
//     analyser.connect(audioCtx.destination);

//     audioCtxRef.current = audioCtx;
//     analyserRef.current = analyser;
//     dataArrayRef.current = dataArray;

//     const animate = () => {
//       analyser.getByteFrequencyData(dataArray);
//       const bass = dataArray.slice(0, 10).reduce((a, b) => a + b, 0) / 10;

//       // Vibration effect using bass value
//       const shake = (bass / 255) * 5; // max 5px shift
//       const x = (Math.random() - 0.5) * shake;
//       const y = (Math.random() - 0.5) * shake;

//       container.style.transform = `translate(${x}px, ${y}px)`;

//       animationRef.current = requestAnimationFrame(animate);
//     };

//     animationRef.current = requestAnimationFrame(animate);
//   };

//   const cleanup = () => {
//     cancelAnimationFrame(animationRef.current);
//     if (audioCtxRef.current) {
//       audioCtxRef.current.close();
//       audioCtxRef.current = null;
//     }
//   };

//   return (
//     <div
//       ref={containerRef}
//       className="w-screen h-screen bg-black overflow-hidden fixed top-0 left-0"
//       style={{ margin: 0, padding: 0 }}
//     >
//       <video
//         ref={videoRef}
//         src="/videos/31_07_25.mp4"
//         autoPlay
//         loop
//         muted={false}
//         playsInline
//         controls={false}
//         preload="auto"
//         disablePictureInPicture
//         className="w-full h-full object-cover"
//         style={{
//           pointerEvents: "none",
//           userSelect: "none",
//         }}
//       />
//     </div>
//   );
// };

// export default TripVisualizer;

// import { useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";

// const TripVisualizer = () => {
//   const videoRef = useRef(null);
//   const containerRef = useRef(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const video = videoRef.current;

//     const goFullscreenAndPlay = async () => {
//       try {
//         await containerRef.current.requestFullscreen();
//         video.volume = 1;
//         await video.play();
//       } catch (err) {
//         console.error("Error during fullscreen/play:", err);
//       }
//     };

//     goFullscreenAndPlay();

//     const handleFullscreenExit = () => {
//       if (!document.fullscreenElement) {
//         navigate("/");
//       }
//     };

//     document.addEventListener("fullscreenchange", handleFullscreenExit);
//     return () => {
//       document.removeEventListener("fullscreenchange", handleFullscreenExit);
//     };
//   }, [navigate]);

//   return (
//     <div
//       ref={containerRef}
//       className="w-screen h-screen fixed top-0 left-0 bg-black overflow-hidden"
//     >
//       <video
//         ref={videoRef}
//         src="/videos/31_07_25.mp4" // <-- Change to your video path
//         autoPlay
//         loop
//         muted={false}
//         controls={false}
//         playsInline
//         disablePictureInPicture
//         className="w-full h-full object-cover"
//         style={{
//           pointerEvents: "none",
//           userSelect: "none",
//         }}
//       />
//     </div>
//   );
// };

// export default TripVisualizer;

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const TripVisualizer = () => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const [needsRotation, setNeedsRotation] = useState(false);

  useEffect(() => {
    const video = videoRef.current;

    const goFullscreenAndPlay = async () => {
      try {
        // Request fullscreen
        await containerRef.current.requestFullscreen();

        // Try locking to landscape on mobile devices
        if (window.screen.orientation && /Mobi|Android/i.test(navigator.userAgent)) {
          try {
            await window.screen.orientation.lock("landscape");
          } catch (err) {
            console.warn("Orientation lock not supported:", err);
            setNeedsRotation(true); // show rotate message
          }
        }

        video.volume = 1;
        await video.play();
      } catch (err) {
        console.error("Error during fullscreen/play:", err);
      }
    };

    goFullscreenAndPlay();

    const handleFullscreenExit = () => {
      if (!document.fullscreenElement) {
        navigate("/");
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenExit);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenExit);
    };
  }, [navigate]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-screen h-screen bg-black z-[9999] overflow-hidden"
    >
      {/* Optional overlay if device needs rotation */}
      {needsRotation && (
        <div className="absolute inset-0 z-[100000] flex items-center justify-center bg-black bg-opacity-80">
          <div className="text-center px-6">
            <h2 className="text-white text-2xl font-bold mb-2">🔄 Please rotate your device</h2>
            <p className="text-gray-300 text-sm">
              This experience is best viewed in landscape mode.
            </p>
          </div>
        </div>
      )}

      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="relative center text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-400 text-shadow-lg mb-10">
          New Trip will be available soon...
        </h1>
      </div>

      {/* <video
        ref={videoRef}
        src="/videos/trip1.mp4"
        autoPlay
        loop
        muted={false}
        controls={false}
        playsInline
        disablePictureInPicture
        className="absolute inset-0 w-full h-full object-cover z-[99999]"
        style={{
          pointerEvents: "none",
          userSelect: "none",
        }}
      /> */}
    </div>
  );
};

export default TripVisualizer;

