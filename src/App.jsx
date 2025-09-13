import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/projects";
import cloudsVideo from "./assets/videos/sunclouds.mp4"; // 👈 import your video
import "./main.css";

export default function App() {
  const [activePage, setActivePage] = useState("home");

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
      {/* 🌥️ Global backdrop video */}
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
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="page-wrapper"
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
