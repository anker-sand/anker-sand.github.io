import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./Projects.css";
import cubePng from "../assets/images/projects/projectcube.png"; // ✅ still bundled PNG

export default function Projects() {
  const [projectsData, setProjectsData] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [imgIndex, setImgIndex] = useState(0);

  // Fetch projects.json from public/
  useEffect(() => {
    fetch("/projects.json")
      .then((res) => res.json())
      .then((data) => {
        setProjectsData(data);
        setActiveId(data[0]?.id); // default to first project
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
  const prev = () => setImgIndex((i) => (i - 1 + total) % total);
  const next = () => setImgIndex((i) => (i + 1) % total);

  return (
    <div className="projects-page">
      {/* LEFT: list */}
      <motion.aside
        className="proj-list"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.15 } }}
      >
        <h1 className="proj-title">projects</h1>
        <ul>
          {projectsData.map((p) => (
            <li key={p.id}>
              <button
                className={p.id === activeId ? "proj-item active" : "proj-item"}
                onClick={() => setActiveId(p.id)}
              >
                {p.title}
              </button>
            </li>
          ))}
        </ul>
      </motion.aside>

      {/* RIGHT: showcase + cube */}
      <div className="proj-right">
        {/* Showcase */}
        <motion.div
          className="showcase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.25 } }}
        >
          <div className="showcase-frame">
            <img
              src={activeProject.images[imgIndex]} // ✅ served from /public/assets/projects/
              alt={`${activeProject.title} screenshot ${imgIndex + 1}`}
              className="showcase-image"
              draggable={false}
            />
            <button className="arrow left" onClick={prev} aria-label="Previous">
              ‹
            </button>
            <button className="arrow right" onClick={next} aria-label="Next">
              ›
            </button>
          </div>

          {/* Thumbnails */}
          <div className="thumbs">
            {activeProject.images.map((src, i) => (
              <button
                key={src}
                className={i === imgIndex ? "thumb active" : "thumb"}
                onClick={() => setImgIndex(i)}
                aria-label={`Go to image ${i + 1}`}
              >
                <img src={src} alt="" />
              </button>
            ))}
          </div>
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
