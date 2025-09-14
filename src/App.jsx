import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import cloudsVideo from "./assets/videos/sunclouds.mp4";
import "./main.css";

/*
  Path-based state (no hash). For GitHub Pages you must have a 404.html
  that serves index.html so direct reloads of /about or /projects work.
*/

function normalizePath(p) {
  if (!p) return "/";
  if (p.length > 1 && p.endsWith("/")) return p.slice(0, -1);
  return p;
}

function getPageFromPath() {
  const p = normalizePath(window.location.pathname).toLowerCase();
  if (p === "/about") return "about";
  if (p === "/projects") return "projects";
  return "home"; // default for "/" or unknown
}

const pageToPath = {
  home: "/",
  about: "/about",
  projects: "/projects",
};

export default function App() {
  const [activePage, setActivePage] = useState(() => getPageFromPath());

  // Prevent browser from restoring old scroll position
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  }, []);

  // Sync state -> URL path (replaceState to avoid history spam)
  useEffect(() => {
    const desired = pageToPath[activePage] || "/";
    if (normalizePath(window.location.pathname) !== desired) {
      history.replaceState(null, "", desired);
    }
    window.scrollTo(0, 0);
  }, [activePage]);

  // Listen to back/forward
  useEffect(() => {
    const onPop = () => {
      const page = getPageFromPath();
      setActivePage(page);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case "home":
        return <Home onNavigate={setActivePage} />;
      case "about":
        return <About />;
      case "projects":
        return <Projects />;
      default:
        return <Home onNavigate={setActivePage} />;
    }
  };

  return (
    <div className="app-container">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="background-video"
        src={cloudsVideo}
      />
      <Navbar onNavigate={setActivePage} />
      <AnimatePresence mode="wait">
        <motion.div
          key={activePage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="page-wrapper"
          style={{ willChange: "opacity" }}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
