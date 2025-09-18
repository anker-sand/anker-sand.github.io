import { useEffect, useState, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import cubePng from "../assets/images/projects/projectcube.png";
import "./Projects.css";

export default function Projects() {
  const [projectsData, setProjectsData] = useState([]);
  const [activeId, setActiveId] = useState(null);

  const [imgIndex, setImgIndex] = useState(0);
  const showcaseTimerRef = useRef(null);
  const showcasePausedRef = useRef(false);

  const firstMountRef = useRef(true);
  const [cubeDone, setCubeDone] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showInlineShowcase, setShowInlineShowcase] = useState(false);
  const inlineShowcaseDelayRef = useRef(null);

  // Modal state
  const [resolutionModal, setResolutionModal] = useState({
    open: false,
    url: "",
  });

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

  useEffect(() => {
    setImgIndex(0);
  }, [activeId]);

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

  // Helpers to manage autoplay interval
  const clearShowcaseInterval = useCallback(() => {
    if (showcaseTimerRef.current) {
      clearInterval(showcaseTimerRef.current);
      showcaseTimerRef.current = null;
    }
  }, []);

  const startShowcaseInterval = useCallback(() => {
    if (
      showcasePausedRef.current ||
      !activeProject ||
      !showInlineShowcase ||
      showcaseTimerRef.current
    )
      return;
    const imgs = activeProject.images || [];
    if (imgs.length <= 1) return;
    showcaseTimerRef.current = setInterval(() => {
      setImgIndex((i) => (i + 1) % imgs.length);
    }, 5000);
  }, [activeProject, showInlineShowcase]);

  // Autoplay effect
  useEffect(() => {
    clearShowcaseInterval();
    startShowcaseInterval();
    return clearShowcaseInterval;
  }, [
    activeProject,
    showInlineShowcase,
    startShowcaseInterval,
    clearShowcaseInterval,
  ]);

  // Preload next image
  useEffect(() => {
    if (!activeProject) return;
    const imgs = activeProject.images || [];
    if (imgs.length < 2) return;
    const next = imgs[(imgIndex + 1) % imgs.length];
    const pre = new Image();
    pre.src = next;
  }, [activeProject, imgIndex]);

  // ESC to close modal
  useEffect(() => {
    if (!resolutionModal.open) return;
    const onKey = (e) =>
      e.key === "Escape" && setResolutionModal({ open: false, url: "" });
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [resolutionModal.open]);

  if (!activeProject) return <div className="projects-page" />;

  const total = activeProject.images?.length || 0;

  const handleManualAdvance = () => {
    if (total <= 1) return;
    setImgIndex((i) => (i + 1) % total);
    // restart interval timing after manual click if not paused
    clearShowcaseInterval();
    startShowcaseInterval();
  };

  // Hover pause/resume
  const handleShowcaseEnter = () => {
    showcasePausedRef.current = true;
    clearShowcaseInterval();
  };
  const handleShowcaseLeave = () => {
    showcasePausedRef.current = false;
    startShowcaseInterval();
  };

  // Modal handlers
  const openResolutionModal = (url) => setResolutionModal({ open: true, url });
  const closeResolutionModal = () =>
    setResolutionModal({ open: false, url: "" });
  const confirmResolutionModal = () => {
    if (resolutionModal.url) {
      window.open(resolutionModal.url, "_blank", "noopener,noreferrer");
    }
    closeResolutionModal();
  };

  /* Variants */
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
      transition: { duration: 1, ease: [0.22, 0.72, 0.18, 1.02], delay: 0.05 },
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
  const showcaseImageVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: 0.55, ease: [0.4, 0.2, 0.2, 1] },
    },
    exit: { opacity: 0, transition: { duration: 0.45, ease: "easeOut" } },
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
                            if (!p.url) {
                              e.preventDefault();
                              return;
                            }
                            // Intercept only Cille Cyklus
                            if (p.id === "cille-cyklus") {
                              e.preventDefault();
                              openResolutionModal(p.url);
                            }
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

                    {/* Showcase moved directly under subtitle */}
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
                            onMouseEnter={handleShowcaseEnter}
                            onMouseLeave={handleShowcaseLeave}
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.section>
      </div>

      {/* Resolution Modal */}
      <AnimatePresence>
        {resolutionModal.open && (
          <motion.div
            className="resolution-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="resolution-modal"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 12, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.4, 0.18, 0.2, 1] }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="resolution-modal-title"
            >
              <button
                className="resolution-modal-close"
                onClick={closeResolutionModal}
                aria-label="Close"
              >
                ×
              </button>
              <h3 id="resolution-modal-title">Notice</h3>
              <p className="resolution-modal-msg">
                This page is functional for the device iPad Pro 12.9", it is
                recommended to only be viewed on this device, <br />
                or at least one of the following resolutions: <br />
                - 2048 x 2732 <br /> - 1024 x 1366.
                <br />
                <br />
                Continue anyway?
              </p>
              <div className="resolution-modal-actions">
                <button
                  className="res-btn primary"
                  onClick={confirmResolutionModal}
                >
                  Continue
                </button>
                <button className="res-btn" onClick={closeResolutionModal}>
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
