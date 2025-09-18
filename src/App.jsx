import { useState, useEffect, lazy, Suspense } from "react";
// (Page transition animations removed previously)
import Navbar from "./components/Navbar/Navbar";
// Code-split pages for faster initial load
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Projects = lazy(() => import("./pages/Projects"));
const Contact = lazy(() => import("./pages/Contact"));
import cloudsVideo from "./assets/videos/sunclouds.mp4";
import cloudsPoster from "./assets/images/room/theroom.png";
import "./main.css";
import CustomCursor from "./components/CustomCursor"; // ADD

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
  if (p === "/contact") return "contact"; // <-- ADD
  return "home";
}

const pageToPath = {
  home: "/",
  about: "/about",
  projects: "/projects",
  contact: "/contact", // <-- ADD
};

export default function App() {
  const [activePage, setActivePage] = useState(() => getPageFromPath());

  // Keep manual to avoid browser restoring scroll in ways that look like jumps
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  }, []);

  // Update path without scrolling (removed automatic scroll-to-top)
  useEffect(() => {
    const desired = pageToPath[activePage] || "/";
    if (normalizePath(window.location.pathname) !== desired) {
      history.replaceState(null, "", desired);
    }
  }, [activePage]);

  // Handle back/forward
  useEffect(() => {
    const onPop = () => setActivePage(getPageFromPath());
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
      case "contact": // <-- ADD
        return <Contact />;
      default:
        return <Home onNavigate={setActivePage} />;
    }
  };

  return (
    <div className="app-container">
      <CustomCursor /> {/* ADD */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster={cloudsPoster}
        className="background-video"
        src={cloudsVideo}
        ref={(el) => {
          // pause when tab hidden to save CPU/GPU
          if (!el) return;
          const onVis = () => {
            if (document.hidden) el.pause();
            else el.play().catch(() => {});
          };
          document.addEventListener("visibilitychange", onVis);
          // invoke once
          onVis();
        }}
      />
      <Navbar onNavigate={setActivePage} />
      <div className="page-wrapper" style={{ minHeight: "100vh" }}>
        <Suspense fallback={null}>{renderPage()}</Suspense>
      </div>
    </div>
  );
}
