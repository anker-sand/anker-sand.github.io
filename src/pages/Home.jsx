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
import { useEffect, useState } from "react";
import meow from "../assets/audio/MEOW.wav";

export default function Home({ onNavigate }) {
  // Right wall text content and typewriter state (with pauses)
  const wallText = `Welcome to my digital room, where i make my projects.\n\nMake yourself at home...`;
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    setTypedText("");
    const chars = Array.from(wallText);
    const BASE_MS = 45; // base speed (ms per char)
    const NEWLINE_PAUSE_MS = 500; // pause BEFORE a newline
    let i = 0;
    let to;

    const step = () => {
      // Guard before appending to avoid adding "undefined"
      if (i >= chars.length) return;
      const ch = chars[i] ?? "";
      setTypedText((prev) => prev + ch);
      i += 1;
      if (i >= chars.length) {
        // done; do not queue another timeout
        to = undefined;
        return;
      }
      const next = chars[i];
      const delay = next === "\n" ? NEWLINE_PAUSE_MS : BASE_MS;
      to = setTimeout(step, delay);
    };

    to = setTimeout(step, 220);
    return () => {
      if (to) clearTimeout(to);
    };
  }, [wallText]);
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
        <img src={roomBase} className="room-base" />
        <img src={desk} className="desk" />

        {/* Right wall intro text (typewriter each mount) */}
        <motion.pre
          className="cube-right-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.2 }}
          aria-label="Welcome text on cube wall"
        >
          {typedText}
          <span className="caret" aria-hidden="true">
            |
          </span>
        </motion.pre>

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
        <img src={chair} className="chair" />

        {/* Cat tail video: transparent background, looped, placed above chair */}
        <video
          src={cattail}
          className="cat-tail interactive-object"
          autoPlay
          loop
          muted
          playsInline
          aria-label="Cat wagging tail"
        />
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
        <img src={doormat} className="doormat" />
        <img src={plant} className="plant" />
        <img src={bookcase} className="bookcase" />
        <img src={rug} className="rug" />

        {/* 3D text PNG (domain) */}
        <img
          src={ankersandgithub}
          alt="anker-sand.github.io"
          className="ankersandgithub"
          draggable="false"
        />

        {/* Mail now interactive -> Contact page */}
        <InteractiveObject
          image={mail}
          className="mail"
          tooltipText="Contact"
          onClick={() => onNavigate("contact")}
        />

        <img src={door} className="door" />
      </motion.div>
      {/* Hidden audio element (user will add source later) */}
      <audio id="meow-audio" src={meow} preload="auto" />
    </div>
  );
}
