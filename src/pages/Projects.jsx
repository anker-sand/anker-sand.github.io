import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import cubePng from "../assets/images/projects/projectcube.png";
import "./Projects.css";

export default function Projects() {
  const [projectsData, setProjectsData] = useState([]);
  const [activeId, setActiveId] = useState(null);

  // Showcase state (simplified cross‑fade)
  const [imgIndex, setImgIndex] = useState(0);
  const showcaseTimerRef = useRef(null);

  // Sequence control
  const firstMountRef = useRef(true);
  const [cubeDone, setCubeDone] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showInlineShowcase, setShowInlineShowcase] = useState(false);
  const inlineShowcaseDelayRef = useRef(null);

  // Fetch project data
  useEffect(() => {
    fetch("/projects.json")
      .then((r) => r.json())
      .then((data) => {
        setProjectsData(data || []);
        if (data?.length) setActiveId(data[0].id);
      })
      .catch((e) => console.error("projects.json load failed", e));

    return () => {
      clearTimeout(inlineShowcaseDelayRef.current);
      clearInterval(showcaseTimerRef.current);
    };
  }, []);

  const activeProject = projectsData.find((p) => p.id === activeId);

  // Reset showcase index when project changes
  useEffect(() => {
    setImgIndex(0);
  }, [activeId]);

  // Sequence: cube -> text -> showcase
  useEffect(() => {
    if (!activeProject) return;
    if (cubeDone && firstMountRef.current) {
      setShowText(true);
      inlineShowcaseDelayRef.current = setTimeout(
        () => setShowInlineShowcase(true),
        450
      );
      firstMountRef.current = false;
    } else if (!firstMountRef.current) {
      setShowText(true);
      setShowInlineShowcase(true);
    }
  }, [cubeDone, activeProject]);

  // Auto‑advance showcase (cross‑fade)
  useEffect(() => {
    if (!activeProject || !showInlineShowcase) {
      clearInterval(showcaseTimerRef.current);
      return;
    }
    const imgs = activeProject.images || [];
    if (imgs.length <= 1) return;

    showcaseTimerRef.current = setInterval(() => {
      setImgIndex((i) => (i + 1) % imgs.length);
    }, 5000);

    return () => clearInterval(showcaseTimerRef.current);
  }, [activeProject, showInlineShowcase]);

  // Preload next image to avoid flash
  useEffect(() => {
    if (!activeProject) return;
    const imgs = activeProject.images || [];
    if (imgs.length < 2) return;
    const next = imgs[(imgIndex + 1) % imgs.length];
    const pre = new Image();
    pre.src = next;
  }, [activeProject, imgIndex]);

  if (!activeProject) {
    return <div className="projects-page" />;
  }

  const total = activeProject.images?.length || 0;

  const handleManualAdvance = () => {
    if (total <= 1) return;
    setImgIndex((i) => (i + 1) % total);
  };

  /* ---------- Variants ---------- */
  const titleAndListVariants = {
    initial: { opacity: 0, y: 14 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.42, ease: [0.33, 0.11, 0.22, 1] },
    },
  };

  const listItemVariants = {
    initial: { opacity: 0, y: 14 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.38, ease: "easeOut" },
    },
  };

  const cubeRiseVariants = {
    initial: { opacity: 0, y: 1080 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: [0.22, 0.72, 0.18, 1.02],
        delay: 0.05,
      },
    },
  };

  const textContainerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        opacity: { duration: 0.2 },
        staggerChildren: 0.035,
        delayChildren: 0.05,
      },
    },
    exit: { opacity: 0, transition: { duration: 0.16 } },
  };

  const wordVariants = {
    initial: { y: "110%", opacity: 0 },
    animate: {
      y: "0%",
      opacity: 1,
      transition: { duration: 0.42, ease: [0.4, 0.2, 0.2, 1] },
    },
    exit: {
      y: "-55%",
      opacity: 0,
      transition: { duration: 0.25, ease: "easeIn" },
    },
  };

  const descVariants = {
    initial: { opacity: 0, y: 8 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: "easeOut", delay: 0.1 },
    },
    exit: { opacity: 0, y: -6, transition: { duration: 0.25 } },
  };

  const inlineShowcaseVariants = {
    initial: { opacity: 0, y: 12 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.33, 0.11, 0.22, 1] },
    },
  };

  // Cross-fade variants for images
  const showcaseImageVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: 0.55, ease: [0.4, 0.2, 0.2, 1] },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.45, ease: "easeOut" },
    },
  };

  const splitWords = (str = "") =>
    str.trim().length ? str.trim().split(/\s+/) : [];

  const renderAnimatedWords = (words, prefix) =>
    words.flatMap((w, i, arr) => [
      <span className="word-wrapper" key={`${prefix}-${i}`}>
        <motion.span variants={wordVariants}>{w}</motion.span>
      </span>,
      i < arr.length - 1 ? " " : null,
    ]);

  return (
    <div className="projects-page">
      <aside>
        <motion.h1
          className="proj-title"
          variants={titleAndListVariants}
          initial={firstMountRef.current ? "initial" : false}
          animate="animate"
        >
          Projects
        </motion.h1>

        <motion.div
          className="proj-list"
          variants={titleAndListVariants}
          initial={firstMountRef.current ? "initial" : false}
          animate="animate"
        >
          <motion.ul
            style={{
              listStyle: "none",
              margin: 5,
              padding: 0,
              display: "grid",
              gap: 0,
            }}
          >
            {projectsData.map((p) => {
              const isActive = p.id === activeId;
              return (
                <motion.li
                  key={p.id}
                  variants={listItemVariants}
                  initial={firstMountRef.current ? "initial" : false}
                  animate="animate"
                  className={isActive ? "proj-li active" : "proj-li"}
                >
                  <button
                    className={isActive ? "proj-item active" : "proj-item"}
                    onClick={() => setActiveId(p.id)}
                    type="button"
                  >
                    {p.title}
                  </button>
                  {isActive && (
                    <div className="proj-expand">
                      <div className="proj-expand-actions">
                        <button
                          type="button"
                          className="proj-learn-btn"
                          onClick={() =>
                            document
                              .querySelector(".cube-wrap")
                              ?.scrollIntoView({ behavior: "smooth" })
                          }
                        >
                          learn more
                        </button>
                        <a
                          className={
                            p.url ? "proj-open-btn" : "proj-open-btn disabled"
                          }
                          href={p.url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            if (!p.url) e.preventDefault();
                          }}
                        >
                          open in browser
                        </a>
                      </div>
                    </div>
                  )}
                </motion.li>
              );
            })}
          </motion.ul>
        </motion.div>
      </aside>

      <div className="proj-right">
        <motion.section
          className="cube-wrap"
          variants={cubeRiseVariants}
          initial={firstMountRef.current ? "initial" : false}
          animate="animate"
          onAnimationComplete={() => {
            if (!cubeDone) setCubeDone(true);
          }}
        >
          <div className="cube">
            <img src={cubePng} alt="Decorative cube" className="cube-image" />
            <div className="cube-face-warp">
              <AnimatePresence mode="wait">
                {showText && (
                  <motion.div
                    key={activeProject.id}
                    className="cube-text-anim"
                    variants={textContainerVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <h2 className="cube-h2 animated-title depth-layer depth-title">
                      {renderAnimatedWords(
                        splitWords(activeProject.title),
                        "t"
                      )}
                    </h2>

                    {activeProject.subtitle && (
                      <p className="cube-sub depth-layer depth-sub">
                        {renderAnimatedWords(
                          splitWords(activeProject.subtitle),
                          "s"
                        )}
                      </p>
                    )}

                    {activeProject.description && (
                      <div className="depth-layer depth-desc">
                        <motion.p
                          className="cube-desc"
                          variants={descVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                        >
                          {activeProject.description}
                        </motion.p>
                      </div>
                    )}

                    {activeProject.credits && (
                      <div className="depth-layer depth-credits">
                        <motion.p
                          className="cube-credits"
                          variants={descVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                        >
                          {activeProject.credits}
                        </motion.p>
                      </div>
                    )}

                    <AnimatePresence mode="wait">
                      {showInlineShowcase && total > 0 && (
                        <div className="depth-layer depth-showcase">
                          <motion.div
                            className="cube-showcase"
                            variants={inlineShowcaseVariants}
                            initial="initial"
                            animate="animate"
                            exit={{ opacity: 0 }}
                            onClick={handleManualAdvance}
                            title={
                              total > 1
                                ? "Click to view next image"
                                : "Showcase"
                            }
                          >
                            <div className="cube-showcase-stage">
                              <AnimatePresence mode="wait">
                                <motion.img
                                  key={imgIndex}
                                  src={activeProject.images[imgIndex]}
                                  className="cube-showcase-image"
                                  alt={`${activeProject.title} showcase ${
                                    imgIndex + 1
                                  }`}
                                  variants={showcaseImageVariants}
                                  initial="initial"
                                  animate="animate"
                                  exit="exit"
                                  draggable={false}
                                />
                              </AnimatePresence>
                            </div>

                            {total > 1 && (
                              <div className="cube-showcase-indicators">
                                {activeProject.images.map((_, i) => (
                                  <span
                                    key={i}
                                    className={
                                      i === imgIndex
                                        ? "cube-showcase-dot active"
                                        : "cube-showcase-dot"
                                    }
                                  />
                                ))}
                              </div>
                            )}
                          </motion.div>
                        </div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
