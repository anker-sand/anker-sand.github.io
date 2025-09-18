import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./About.css";
import AngelTVWebm from "../assets/videos/AngelTV.webm";

import scene1 from "../assets/images/about/bib2.jpg";
import scene2 from "../assets/images/about/bib1.jpg";
import scene3 from "../assets/images/about/studiosesh.jpg";
import scene4 from "../assets/images/about/scene4.png";

/*
  Add / tweak scale per scene with tv.scale
  tv: { left, top, scale }
*/
const SCENES = [
  {
    id: 1,
    tv: { left: "31.5vw", top: "43vh", scale: 0.8 },
    layout: "hero-center",
    screenSrc: scene1,
    content: (
      <>
        <h1 className="hero-title">
          <br />
          I'm a web developer
        </h1>
        <button className="hero-cta" data-next>
          About me <span className="hero-cta-arrow">▼</span>
        </button>
      </>
    ),
  },
  {
    id: 2,
    tv: { left: "55vw", top: "20vh", scale: 1.75 },
    layout: "column-left",
    screenSrc: scene2,
    content: (
      <div className="text-block about-dev">
        <h2 className="section-heading">Who am i?</h2>
        <p>
          My name is Anker, a 25-year-old frontend developer from Denmark with a
          passion for design, code, visual identity and interactive experiences.
          <br />
          <br /> I enjoy pushing boundaries and exploring new ways to bring
          ideas to life. <br />
          <br /> At the same time, I strive to keep my work intuitive and
          purposeful—always putting users and project goals at the center of the
          process.
        </p>
        <p className="callout">
          For me, web design should spark curiosity and invite interaction.
        </p>
        <ul className="tech-tags">
          <li>React</li>
          <li>JavaScript (ESNext)</li>
          <li>HTML / CSS</li>
          <li>Figma</li>
          <li>Adobe Creative Suite</li>
          <li>Procreate</li>
          <li>Ableton Live</li>
        </ul>
      </div>
    ),
  },
  {
    id: 3,
    tv: { left: "31.5vw", top: "0vh", scale: 1.3 },
    layout: "center-under",
    screenSrc: scene3,
    content: (
      <div className="text-block center">
        <p>
          Outside of coding, I’ve spent countless hours producing music and
          playing instruments. Both for myself, and in collaboration with
          others. <br /> <br />
          The process of creating music, is all about experimenting, refining,
          and building on ideas.
        </p>
        <p>
          That same creative approach guides the way I tackle challenges in web
          development.
        </p>

        <p> </p>
      </div>
    ),
  },
  {
    id: 4,
    tv: { left: "52vw", top: "19vh", scale: 1.8 },
    layout: "talk-left",
    screenSrc: scene4,
    content: (
      <div className="text-block">
        <h2 className="talk-heading">Lets Talk!</h2>
        <ul className="talk-list">
          <h3>
            {" "}
            I’m currently looking for an internship <br />
            where I can grow as a developer, contribute to real projects, <br />
            and collaborate with others. <br />
            <br />
            I’m excited to learn whatever i can from experienced teams <br />
          </h3>
        </ul>
        <p className="talk-closing">
          If you have any inquiry, feel free to contact me! <br /> my inbox is
          always open{" "}
        </p>
      </div>
    ),
  },
];

const SCENE_COUNT = SCENES.length;
const SCROLL_LOCK_MS = 650; // debounce between scroll scene changes
const WHEEL_DELTA_THRESHOLD = 30;

export default function About({ onNavigate }) {
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
        {/* Floating inner wrapper so CSS animation does not clash with Framer Motion */}
        <div className="tv-float">
          <div className="tv-screen">
            {scene.id === 4 ? (
              <motion.button
                key="tv-contact"
                className="tv-contact-cta"
                onClick={() =>
                  typeof onNavigate === "function"
                    ? onNavigate("contact")
                    : (window.location.href = "/contact")
                }
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <span className="tv-contact-title">Contact me!</span>
                <span className="tv-contact-sub">(click here)</span>
              </motion.button>
            ) : (
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
            )}
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
        </div>
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

      {/* Left-side scroll indicator: visible for all scenes except last */}
      {index !== SCENE_COUNT - 1 && (
        <div className="scroll-indicator-left" aria-hidden="true">
          <div className="scroll-line">
            <span className="scroll-dot" />
          </div>
          <span className="scroll-label">Scroll</span>
        </div>
      )}
    </div>
  );
}
