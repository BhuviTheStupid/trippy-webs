import { useEffect, useState } from "react";

const useAdBlockDetect = () => {
  const [adBlockDetected, setAdBlockDetected] = useState(false);

  useEffect(() => {
    const bait = document.createElement("div");
    bait.className = "ad-banner ad adsbox ad-placement ad-unit ad-zone";
    bait.style.position = "absolute";
    bait.style.left = "-999px";
    bait.style.height = "10px";
    bait.style.width = "10px";
    bait.style.opacity = "0";

    document.body.appendChild(bait);

    window.setTimeout(() => {
      if (
        !bait ||
        bait.offsetHeight === 0 ||
        bait.offsetParent === null ||
        window.getComputedStyle(bait).display === "none"
      ) {
        setAdBlockDetected(true);
      }
      bait.remove();
    }, 100);

    return () => bait.remove();
  }, []);

  return adBlockDetected;
};

export default useAdBlockDetect;
