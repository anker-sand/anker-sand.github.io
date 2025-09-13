import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home } from "lucide-react";
import "./Navbar.css";

export default function Navbar({ onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="navbar"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* House Icon */}
      <Home size={60} className="nav-icon" onClick={() => onNavigate("home")} />

      {/* Hover menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="nav-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button onClick={() => onNavigate("home")}>Home</button>
            <button onClick={() => onNavigate("about")}>About Me</button>
            <button onClick={() => onNavigate("projects")}>Projects</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
