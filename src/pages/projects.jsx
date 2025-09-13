import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./Projects.css";
import cubePng from "../assets/images/projects/projectcube.png";

export default function Projects() {
  const [projectsData, setProjectsData] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [imgIndex, setImgIndex] = useState(0);
  const [prevImgIndex, setPrevImgIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    fetch("/projects.json")
      .then((res) => res.json())
      .then((data) => {
        setProjectsData(data);
        setActiveId(data[0]?.id);
      })
      .catch((err) => console.error("Failed to load projects.json", err));
  }, []);

  const activeProject = projectsData.find((p) => p.id === activeId);

  // Reset image index when project changes
  useEffect(() => setImgIndex(0), [activeId]);

  if (!activeProject) {
    return <div className="projects-page">Loading projects...</div>;
  }

  const total = activeProject.images.length;

  const prev = () => {
    setPrevImgIndex(imgIndex);
    setIsFading(true);
    setTimeout(() => {
      setImgIndex((i) => (i - 1 + total) % total);
      setIsFading(false);
    }, 500);
  };

  const next = () => {
    setPrevImgIndex(imgIndex);
    setIsFading(true);
    setTimeout(() => {
      setImgIndex((i) => (i + 1) % total);
      setIsFading(false);
    }, 500);
  };

  return (
    <div className="projects-page">
      {/* LEFT: title and list */}
      <aside>
        <h1 className="proj-title">projects</h1>
        <motion.div
          className="proj-list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.15 } }}
        >
          <ul>
            {projectsData.map((p) => (
              <li key={p.id}>
                <button
                  className={
                    p.id === activeId ? "proj-item active" : "proj-item"
                  }
                  onClick={() => setActiveId(p.id)}
                >
                  {p.title}
                </button>
              </li>
            ))}
          </ul>
        </motion.div>
      </aside>

      {/* RIGHT: showcase + cube */}
      <div className="proj-right">
        {/* Showcase with arrows outside the frame */}
        <motion.div
          className="showcase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.25 } }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <button
            className="arrow outside left"
            onClick={prev}
            aria-label="Previous"
            style={{ marginRight: "24px" }}
          >
            ‹
          </button>
          <div className="showcase-frame">
            {/* Previous image fades out, new image fades in */}
            <img
              src={activeProject.images[prevImgIndex]}
              alt=""
              className={`showcase-image${isFading ? "" : " hide"}`}
              draggable={false}
              aria-hidden="true"
            />
            <img
              src={activeProject.images[imgIndex]}
              alt={`${activeProject.title} screenshot`}
              className={`showcase-image${isFading ? " hide" : ""}`}
              draggable={false}
            />
          </div>
          <button
            className="arrow outside right"
            onClick={next}
            aria-label="Next"
            style={{ marginLeft: "24px" }}
          >
            ›
          </button>
        </motion.div>

        {/* Cube with overlay text */}
        <motion.section
          className="cube-wrap"
          initial={{ y: 120, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            transition: { duration: 0.6, ease: "easeOut", delay: 0.3 },
          }}
        >
          <div className="cube">
            <img src={cubePng} alt="Cube" className="cube-image" />
            <div className="cube-face-warp">
              <h2 className="cube-h2">{activeProject.title}</h2>
              {activeProject.subtitle && (
                <p className="cube-sub">{activeProject.subtitle}</p>
              )}
              <p className="cube-desc">{activeProject.description}</p>
              {activeProject.credits && (
                <p className="cube-credits">{activeProject.credits}</p>
              )}
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
