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

function WallText({
  text,
  start = false,
  baseMs = 85,
  newlinePauseMs = 650,
  chunkSize = 1,
  startDelayMs = 120,
}) {
  const [typed, setTyped] = useState("");
  useEffect(() => {
    if (!start) return; // wait until we're told to start
    setTyped("");
    const chars = Array.from(text);
    let i = 0;
    let to;
    const tick = () => {
      if (i >= chars.length) return;
      // append N chars per tick (defaults to 1 for slower effect)
      let chunk = "";
      for (let c = 0; c < chunkSize && i < chars.length; c++) {
        chunk += chars[i++] ?? "";
      }
      setTyped((prev) => prev + chunk);
      if (i >= chars.length) return;
      const next = chars[i];
      const delay = next === "\n" ? newlinePauseMs : baseMs;
      to = setTimeout(tick, delay);
    };
    to = setTimeout(tick, Math.max(0, startDelayMs));
    return () => to && clearTimeout(to);
  }, [text, start, baseMs, newlinePauseMs, chunkSize, startDelayMs]);
  return (
    <motion.pre
      className="cube-right-text"
      initial={{ opacity: 0 }}
      animate={{ opacity: start ? 1 : 0 }}
      transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
      aria-label="Welcome text on cube wall"
    >
      {typed}
      <span className="caret" aria-hidden="true">
        |
      </span>
    </motion.pre>
  );
}

// Persist readiness across mounts to avoid re-waiting after first load
let HOME_READY_CACHE = false;

export default function Home({ onNavigate }) {
  // Right wall text content (kept constant); rendering moved to memoized child to avoid whole-page rerenders
  const wallText = `Welcome to my digital room, where i make my projects.\n\nMake yourself at home...`;
  const [ready, setReady] = useState(HOME_READY_CACHE);
  const [textStart, setTextStart] = useState(false);
  const [tailVisible, setTailVisible] = useState(false);
  useEffect(() => {
    if (HOME_READY_CACHE) return; // already ready from a previous visit
    let cancelled = false;
    const sources = [
      roomBase,
      desk,
      meinchair,
      projectwall,
      door,
      mail,
      chair,
      doormat,
      plant,
      bookcase,
      rug,
      ankersandgithub,
    ];

    const preloadImage = (src) =>
      new Promise((resolve) => {
        let done = false;
        const finish = () => {
          if (done) return;
          done = true;
          resolve(src);
        };
        const img = new Image();
        img.onload = finish;
        img.onerror = finish;
        img.src = src;
        if (img.decode) img.decode().then(finish).catch(finish);
      });

    Promise.allSettled(sources.map(preloadImage)).then(() => {
      if (cancelled) return;
      HOME_READY_CACHE = true;
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);
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
      {ready && (
        <motion.div
          className="room-wrapper"
          initial={{ y: 160, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.9,
              ease: [0.22, 0.72, 0.18, 1.02],
              delay: 0.1,
            },
          }}
          onAnimationComplete={() => {
            // start typewriter a bit after the cube settles
            setTimeout(() => setTextStart(true), 450);
            // mount cat-tail slightly later and fade it in to reduce decode during motion
            setTimeout(() => setTailVisible(true), 450);
          }}
        >
          <img
            src={roomBase}
            className="room-base"
            alt="Room base"
            decoding="async"
          />
          <img src={desk} className="desk" alt="Desk" decoding="async" />

          {/* Right wall intro text (typewriter starts after cube entrance) */}
          <WallText
            text={wallText}
            start={textStart}
            baseMs={85}
            newlinePauseMs={700}
            chunkSize={1}
            startDelayMs={80}
          />

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

          {/* Cat tail video: mount after entrance and fade in */}
          {tailVisible && <CatTail fadeIn />}
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
      )}
      {/* Hidden audio element (user will add source later) */}
      {ready && <audio id="meow-audio" src={meow} preload="auto" />}
    </div>
  );
}

function CatTail({ fadeIn = false }) {
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
  if (fadeIn) {
    return (
      <motion.video
        ref={ref}
        src={cattail}
        className="cat-tail interactive-object"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-label="Cat wagging tail"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    );
  }
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
