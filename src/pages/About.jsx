import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./About.css";
import AngelTVWebm from "../assets/videos/AngelTV.webm";

import scene1 from "../assets/images/about/scene1.png";
import scene2 from "../assets/images/about/scene2.png";
import scene3 from "../assets/images/about/scene3.png";
import scene4 from "../assets/images/about/scene4.png";

/*
  Add / tweak scale per scene with tv.scale
  tv: { left, top, scale }
*/
const SCENES = [
  {
    id: 1,
    tv: { left: "54vw", top: "17vh", scale: 1.8 },
    layout: "hero-left",
    screenSrc: scene1,
    content: (
      <>
        <h1 className="hero-title">
          Hello,
          <br />
          i'm a web
          <br />
          developer
        </h1>
        <button className="hero-cta" data-next>
          About me <span className="hero-cta-arrow">▼</span>
        </button>
      </>
    ),
  },
  {
    id: 2,
    tv: { left: "55vw", top: "25vh", scale: 1.55 },
    layout: "column-left",
    screenSrc: scene2,
    content: (
      <div className="text-block">
        <p>
          I’m a frontend web developer based in Denmark,
          <br />
          passionate about design, code, <br />
          and turning ideas into interactive experiences.
        </p>
        <p>
          For me, creativity is about building worlds <br />
          — digital spaces that people can step into and explore. <br />
          Websites should feel alive, spark curiosity, and invite interaction.
        </p>
        <p>
          I work mainly with <strong>React, HTML, CSS, and JavaScript</strong>,
          <br />
          but i'm always to learn new tools and approaches.
        </p>
      </div>
    ),
  },
  {
    id: 3,
    tv: { left: "33vw", top: "10vh", scale: 1.5 },
    layout: "center-under",
    screenSrc: scene3,
    content: (
      <div className="text-block center">
        <p>
          Outside of coding, I’ve spent countless hours producing music and
          playing instruments. Creating my own little musical worlds taught me
          attention to detail and how fine-tuned elements shape the experience
        </p>
        <p>
          in the end it’s how everything comes together that truly matters. - I
          carry that same mindset into web development
        </p>
      </div>
    ),
  },
  {
    id: 4,
    tv: { left: "56vw", top: "11vh", scale: 1.1 },
    layout: "talk-left",
    screenSrc: scene4,
    content: (
      <div className="text-block">
        <h2 className="talk-heading">Lets Talk!</h2>
        <ul className="talk-list">
          <li>I’m currently looking for an internship</li>
          <li>Grow as a developer & collaborate</li>
          <li>Contribute to real projects</li>
          <li>Bring curiosity & creative energy</li>
          <li>Always open to a quick chat</li>
        </ul>
        <p className="talk-closing">Feel free to contact me about anything.</p>
      </div>
    ),
  },
];

const SCENE_COUNT = SCENES.length;
const SCROLL_LOCK_MS = 650; // debounce between scroll scene changes
const WHEEL_DELTA_THRESHOLD = 30;

export default function About() {
  const [index, setIndex] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const scene = SCENES[index];
  const lastScrollTime = useRef(0);

  const next = useCallback(
    () => setIndex((i) => (i < SCENE_COUNT - 1 ? i + 1 : i)),
    []
  );
  const prev = useCallback(() => setIndex((i) => (i > 0 ? i - 1 : i)), []);

  // Preload images once
  useEffect(() => {
    SCENES.forEach((s) => {
      const img = new Image();
      img.src = s.screenSrc;
    });
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (["ArrowDown", "PageDown", " "].includes(e.key)) {
        if (index < SCENE_COUNT - 1) {
          e.preventDefault();
          next();
        }
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        if (index > 0) {
          e.preventDefault();
          prev();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, next, prev]);

  // Scroll (wheel) navigation
  useEffect(() => {
    const onWheel = (e) => {
      const now = Date.now();
      if (now - lastScrollTime.current < SCROLL_LOCK_MS) return;
      if (Math.abs(e.deltaY) < WHEEL_DELTA_THRESHOLD) return;
      if (e.deltaY > 0) {
        if (index < SCENE_COUNT - 1) {
          next();
          lastScrollTime.current = now;
        }
      } else {
        if (index > 0) {
          prev();
          lastScrollTime.current = now;
        }
      }
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [index, next, prev]);

  // Click CTA
  const handleRootClick = (e) => {
    if (e.target.closest("[data-next]")) next();
  };

  return (
    <div className="about-page" onClick={handleRootClick}>
      {/* TV wrapper with per-scene scale */}
      <motion.div
        className="tv-wrapper"
        initial={{ opacity: 0, y: 90, scale: scene.tv.scale || 1 }}
        animate={{
          opacity: 1,
          y: 0,
          left: scene.tv.left,
          top: scene.tv.top,
          scale: scene.tv.scale || 1,
        }}
        transition={{
          opacity: { duration: 0.45, ease: "easeOut" },
          left: { duration: 0.55, ease: [0.4, 0.18, 0.2, 1] },
          top: { duration: 0.55, ease: [0.4, 0.18, 0.2, 1] },
          scale: { duration: 0.55, ease: [0.4, 0.18, 0.2, 1] },
        }}
        aria-hidden="true"
        style={{ left: scene.tv.left, top: scene.tv.top }}
      >
        <div className="tv-screen">
          <AnimatePresence mode="wait">
            <motion.img
              key={scene.id}
              src={scene.screenSrc}
              alt=""
              className="tv-screen-img"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              draggable={false}
            />
          </AnimatePresence>
        </div>
        {!videoError ? (
          <video
            className="tv-frame"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            onError={() => setVideoError(true)}
          >
            <source src={AngelTVWebm} type="video/webm" />
          </video>
        ) : (
          <div className="tv-frame-fallback" />
        )}
      </motion.div>

      {/* Scene text */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`text-${scene.id}`}
          className={`scene-text ${scene.layout}`}
          initial={{
            opacity: 0,
            y: 30,
            ...(scene.layout === "center-under" ? { x: "-50%" } : {}),
          }}
          animate={{
            opacity: 1,
            y: 0,
            ...(scene.layout === "center-under" ? { x: "-50%" } : {}),
          }}
          exit={{
            opacity: 0,
            y: -24,
            ...(scene.layout === "center-under" ? { x: "-50%" } : {}),
          }}
          transition={{ duration: 0.5, ease: [0.4, 0.18, 0.2, 1] }}
          style={scene.layout === "center-under" ? { left: "50%" } : undefined}
        >
          {scene.content}
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons (still available) */}
      <div className="about-nav about-nav-top">
        <button
          aria-label="Previous section"
          onClick={prev}
          disabled={index === 0}
        >
          ▲
        </button>
      </div>
      <div className="about-nav about-nav-bottom">
        <button
          aria-label="Next section"
          onClick={next}
          disabled={index === SCENE_COUNT - 1}
        >
          ▼
        </button>
      </div>
    </div>
  );
}
