import roomBase from "../assets/images/room/theroom.png";
import ankersandgithub from "../assets/images/room/anker-sand.github_3dtext.png";
import desk from "../assets/images/room/desk.png";
import meinchair from "../assets/images/room/meinchair.png";
import projectwall from "../assets/images/room/projectwall.png";
import door from "../assets/images/room/door.png";
import mail from "../assets/images/room/mail.png";
import chair from "../assets/images/room/chair.png"; // NEW
import doormat from "../assets/images/room/doormat.png"; // NEW
import plant from "../assets/images/room/plant.png"; // NEW
import bookcase from "../assets/images/room/bookcase.png"; // NEW
import rug from "../assets/images/room/rug.png"; // NEW
import cattail from "../assets/videos/cattail.webm";
import InteractiveObject from "../components/Room/objects/InteractiveObject";
import "./Home.css";
import { motion } from "framer-motion"; // <-- added
import { useEffect, useRef, useState } from "react";
import meow from "../assets/audio/MEOW.wav";

function WallText({ text }) {
  const [typed, setTyped] = useState("");
  useEffect(() => {
    setTyped("");
    const chars = Array.from(text);
    const BASE_MS = 42;
    const NEWLINE_PAUSE_MS = 380;
    let i = 0;
    let to;
    const tick = () => {
      if (i >= chars.length) return;
      // append 2 chars per frame to reduce re-renders
      let chunk = "";
      for (let c = 0; c < 2 && i < chars.length; c++) {
        chunk += chars[i++] ?? "";
      }
      setTyped((prev) => prev + chunk);
      if (i >= chars.length) return;
      const next = chars[i];
      const delay = next === "\n" ? NEWLINE_PAUSE_MS : BASE_MS;
      to = setTimeout(tick, delay);
    };
    to = setTimeout(tick, 180);
    return () => to && clearTimeout(to);
  }, [text]);
  return (
    <motion.pre
      className="cube-right-text"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut", delay: 0.2 }}
      aria-label="Welcome text on cube wall"
    >
      {typed}
      <span className="caret" aria-hidden="true">
        |
      </span>
    </motion.pre>
  );
}

export default function Home({ onNavigate }) {
  // Right wall text content (kept constant); rendering moved to memoized child to avoid whole-page rerenders
  const wallText = `Welcome to my digital room, where i make my projects.\n\nMake yourself at home...`;
  // Click handler to play meow when audio is provided later
  const playMeow = () => {
    const el = document.getElementById("meow-audio");
    if (el && typeof el.play === "function") {
      // Attempt to play; ignore promise rejections (autoplay policies)
      const p = el.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    }
  };

  return (
    <div className="home-container">
      <motion.div
        className="room-wrapper"
        initial={{ y: 160, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          transition: { duration: 0.6, ease: "easeOut", delay: 0.15 },
        }}
      >
        <img
          src={roomBase}
          className="room-base"
          alt="Room base"
          decoding="async"
        />
        <img src={desk} className="desk" alt="Desk" decoding="async" />

        {/* Right wall intro text (typewriter each mount) */}
        <WallText text={wallText} />

        {/* Existing interactive objects */}
        <InteractiveObject
          image={meinchair}
          className="meinchair"
          tooltipText="About Me"
          onClick={() => onNavigate("about")}
        />

        <InteractiveObject
          image={projectwall}
          className="projectwall"
          tooltipText="Projects"
          onClick={() => onNavigate("projects")}
        />

        {/* NEW static decorative items */}
        <img
          src={chair}
          className="chair"
          alt="Chair"
          loading="lazy"
          decoding="async"
        />

        {/* Cat tail video: transparent background, looped, placed above chair */}
        <CatTail />
        {/* Hotspot for clicking meow without clipping the video */}
        <button
          className="cat-tail-hotspot interactive-object"
          aria-label="Pet the cat"
          onClick={playMeow}
          style={{
            "--cat-hot-left": "29.2%",
            "--cat-hot-bottom": "61.2%",
            "--cat-hot-width": "6.4%",
            "--cat-hot-height": "5.6%",
          }}
        />
        <img
          src={doormat}
          className="doormat"
          alt="Doormat"
          loading="lazy"
          decoding="async"
        />
        <img
          src={plant}
          className="plant"
          alt="Plant"
          loading="lazy"
          decoding="async"
        />
        <img
          src={bookcase}
          className="bookcase"
          alt="Bookcase"
          loading="lazy"
          decoding="async"
        />
        <img
          src={rug}
          className="rug"
          alt="Rug"
          loading="lazy"
          decoding="async"
        />

        {/* 3D text PNG (domain) */}
        <img
          src={ankersandgithub}
          alt="anker-sand.github.io"
          className="ankersandgithub"
          draggable="false"
          decoding="async"
        />

        {/* Mail now interactive -> Contact page */}
        <InteractiveObject
          image={mail}
          className="mail"
          tooltipText="Contact"
          onClick={() => onNavigate("contact")}
        />

        <img src={door} className="door" alt="Door" decoding="async" />
      </motion.div>
      {/* Hidden audio element (user will add source later) */}
      <audio id="meow-audio" src={meow} preload="auto" />
    </div>
  );
}

function CatTail() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onVis = () => {
      if (document.hidden) el.pause();
      else el.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVis);
    onVis();
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);
  return (
    <video
      ref={ref}
      src={cattail}
      className="cat-tail interactive-object"
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      aria-label="Cat wagging tail"
    />
  );
}
