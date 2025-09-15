import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./About.css";
import AngelTVWebm from "../assets/videos/AngelTV.webm";

import scene1 from "../assets/images/about/scene1.png";
import scene2 from "../assets/images/about/scene2.png";
import scene3 from "../assets/images/about/scene3.png";
import scene4 from "../assets/images/about/scene4.png";

/*
  SCENES:
  tv.left / tv.top = viewport-relative anchor
  You can tweak these after enlarging the TV.
*/
const SCENES = [
  {
    id: 1,
    tv: { left: "54vw", top: "14vh" },
    layout: "hero-left",
    screenSrc: scene1,
    content: (
      <>
        <h1 className="hero-title">
          Hello!
          <br />
          im a web
          <br />
          Developer
        </h1>
        <button className="hero-cta" data-next>
          About me <span className="hero-cta-arrow">▼</span>
        </button>
      </>
    ),
  },
  {
    id: 2,
    tv: { left: "55vw", top: "12vh" },
    layout: "column-left",
    screenSrc: scene2,
    content: (
      <div className="text-block">
        <p>
          I’m a frontend web developer based in Denmark, passionate about
          design, code, and turning ideas into interactive experiences.
        </p>
        <p>
          Creativity for me is about building worlds—digital spaces people can
          explore. I believe websites should feel alive, spark curiosity, and
          invite interaction.
        </p>
        <p>
          I work mainly with <strong>React, HTML, CSS, and JavaScript</strong>,
          always eager to learn new tools and approaches.
        </p>
      </div>
    ),
  },
  {
    id: 3,
    tv: { left: "50vw", top: "16vh" },
    layout: "center-under",
    screenSrc: scene3,
    content: (
      <div className="text-block center">
        <p>
          Outside of coding, I’ve spent countless hours producing music and
          playing instruments. Building small musical worlds taught me how
          details add up—and how harmony matters in design too.
        </p>
        <p>
          That mindset guides my development: intentional, iterative, focused on
          how every element contributes to the whole experience.
        </p>
      </div>
    ),
  },
  {
    id: 4,
    tv: { left: "56vw", top: "11vh" },
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

export default function About() {
  const [index, setIndex] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const [debugScreen, setDebugScreen] = useState(false);
  const scene = SCENES[index];

  const next = useCallback(
    () => setIndex((i) => (i < SCENES.length - 1 ? i + 1 : i)),
    []
  );
  const prev = useCallback(() => setIndex((i) => (i > 0 ? i - 1 : i)), []);

  // Preload screens
  useEffect(() => {
    SCENES.forEach((s) => {
      const img = new Image();
      img.src = s.screenSrc;
    });
  }, []);

  // Keyboard navigation + debug toggle (D)
  useEffect(() => {
    const onKey = (e) => {
      if (["ArrowDown", "PageDown", " "].includes(e.key)) {
        if (index < SCENES.length - 1) {
          e.preventDefault();
          next();
        }
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        if (index > 0) {
          e.preventDefault();
          prev();
        }
      } else if (e.key.toLowerCase() === "d") {
        setDebugScreen((d) => !d);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, next, prev]);

  const handleClick = (e) => {
    if (e.target.closest("[data-next]")) next();
  };

  return (
    <div
      className={`about-page${debugScreen ? " debug-screen" : ""}`}
      onClick={handleClick}
    >
      <motion.div
        className="tv-wrapper"
        initial={{ opacity: 0, y: 90 }}
        animate={{
          opacity: 1,
          y: 0,
          left: scene.tv.left,
          top: scene.tv.top,
        }}
        transition={{
          opacity: { duration: 0.45, ease: "easeOut" },
          left: { duration: 0.55, ease: [0.4, 0.18, 0.2, 1] },
          top: { duration: 0.55, ease: [0.4, 0.18, 0.2, 1] },
        }}
        style={{ left: scene.tv.left, top: scene.tv.top }}
        aria-hidden="true"
      >
        {/* Screen window (behind frame if transparency present) */}
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
              transition={{ duration: 0.5, ease: "easeOut" }}
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
            onError={() => setVideoError(true)}
          >
            <source src={AngelTVWebm} type="video/webm" />
          </video>
        ) : (
          <div className="tv-frame-fallback" />
        )}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`text-${scene.id}`}
          className={`scene-text ${scene.layout}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -25 }}
          transition={{ duration: 0.55, ease: [0.4, 0.18, 0.2, 1] }}
        >
          {scene.content}
        </motion.div>
      </AnimatePresence>

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
          disabled={index === SCENES.length - 1}
        >
          ▼
        </button>
      </div>
    </div>
  );
}
