import React, { useEffect, useRef, useState } from "react";

// Floating animation helpers
const randomFloat = () => (Math.random() * 2 + 2).toFixed(2);
const randomDelay = () => (Math.random() * 3).toFixed(2);
const randomDirection = () => {
  const dirs = ["float-x", "float-y", "float-xy", "float-rotate"];
  return dirs[Math.floor(Math.random() * dirs.length)];
};

const FloatingCard = ({ children }) => {
  const duration = randomFloat();
  const delay = randomDelay();
  const direction = randomDirection();

  return (
    <div
      className={`bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-4 w-full max-w-xs shadow-[0_0_20px_rgba(255,255,255,0.2),0_0_40px_rgba(255,0,255,0.3),0_0_60px_rgba(0,255,255,0.2)] animate-${direction}`}
      style={{ animationDuration: `${duration}s`, animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
};

const Home = () => {
  const texts = ["Sync your mind", "Neural Waves", "Dream Streams"];
  const images = ["/images/img1.jpg", "/images/img2.jpg", "/images/img3.jpg"];
  const videos = ["/videos/loop1.mp4", "/videos/loop2.mp4"];

  const media = [
    ...images.map((src) => ({ type: "image", content: src })),
    ...videos.map((src) => ({ type: "video", content: src })),
  ];

  const shuffledMedia = [...media].sort(() => Math.random() - 0.5).slice(0, 6);
  while (shuffledMedia.length < 6 && media.length > 0) {
    const extra = media[Math.floor(Math.random() * media.length)];
    shuffledMedia.push(extra);
  }

  const finalCards = [
    ...texts.map((t) => ({ type: "text", content: t })),
    ...shuffledMedia,
  ];

  const renderCard = (card, index) => {
    switch (card.type) {
      case "text":
        return (
          <FloatingCard key={`text-${index}`}>
            <p className="text-xl font-bold text-purple-300">{card.content}</p>
          </FloatingCard>
        );
      default:
        return null;
    }
  };

  const cardRef = useRef(null);
  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowCards(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  // "Coming Soon" cursor-following icon logic
  const iconRef = useRef(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const footerHeight = 100;
      const safeY = Math.min(e.clientY, window.innerHeight - footerHeight);
      setCursor({ x: e.clientX, y: safeY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const icon = iconRef.current;
    if (!icon) return;

    let animationFrame;

    const follow = () => {
      icon.style.transform = `translate(${cursor.x}px, ${cursor.y}px)`;
      animationFrame = requestAnimationFrame(follow);
    };

    follow();
    return () => cancelAnimationFrame(animationFrame);
  }, [cursor]);

  return (
    <div className="relative w-full h-full text-center px-4 overflow-hidden lg:mr-64">
      {/* Hero Section */}
      <section className="flex flex-col justify-center items-center space-y-6 py-24 px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-400 text-shadow-lg text-center">
          🕸️ The Trippy Webs 🕸️
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-pink-200 max-w-xl mx-auto text-shadow-sm text-center">
          Dive deep into the surreal frequencies of music, minds, and mayhem. Built for seekers. Tuned for wanderers.
        </p>
      </section>
      {/* Coming Soon Bar */}
      {/* <div className="w-full overflow-hidden py-2">
        <div className="animate-bounce bg-gradient-to-r from-purple-800 via-pink-600 to-indigo-700 text-white text-lg font-bold shadow-lg rounded-full px-6 py-2 mx-auto w-max">
          🚀 Coming Soon...
        </div>
      </div> */}
      {/* Cards Section */}
      <section
        ref={cardRef}
        className={`transition-all duration-1000 ease-in-out ${
          showCards ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center mt-10 pb-20">
          {finalCards.map((card, index) => renderCard(card, index))}
        </div>
      </section>

      {/* Floating "Coming Soon" icon */}
      {/* <div
        ref={iconRef}
        className="fixed top-0 left-0 z-50 pointer-events-none transition-transform duration-150 ease-out"
      >
        <div className="animate-bounce bg-pink-600 text-white font-bold px-4 py-2 rounded-full shadow-lg text-sm sm:text-base select-none">
          🚧 Coming Soon!
        </div>
      </div> */}
    </div>
  );
};

export default Home;
