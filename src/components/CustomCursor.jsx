import { useEffect, useRef, useState } from "react";
import "./CustomCursor.css";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const activeRef = useRef(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const coarse =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches;

    if (prefersReduced || coarse) {
      document.body.classList.add("native-cursor");
      return;
    }
    document.body.classList.remove("native-cursor");
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const RING_LAG = 0.14; // trail strength (smaller = closer / faster)
    const INTERACTIVE_SELECTOR =
      'a, button, [role="button"], .interactive-object, .proj-item, .proj-learn-btn, .proj-open-btn, .proj-open-btn:not(.disabled), .mail, .nav-icon'; // <-- appended .nav-icon

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let raf;

    const loop = () => {
      // Dot snaps instantly each frame (prevents low‑Hz mousemove jitter)
      if (dotRef.current) {
        dotRef.current.style.setProperty("--tx", x + "px");
        dotRef.current.style.setProperty("--ty", y + "px");
      }
      // Ring interpolates
      rx += (x - rx) * RING_LAG;
      ry += (y - ry) * RING_LAG;
      if (ringRef.current) {
        ringRef.current.style.setProperty("--tx", rx + "px");
        ringRef.current.style.setProperty("--ty", ry + "px");
      }
      raf = requestAnimationFrame(loop);
    };

    const setInteractive = (isActive) => {
      if (activeRef.current === isActive) return;
      activeRef.current = isActive;
      if (!dotRef.current || !ringRef.current) return;
      dotRef.current.classList.toggle("is-active", isActive);
      ringRef.current.classList.toggle("is-active", isActive);
    };

    const move = (e) => {
      x = e.clientX;
      y = e.clientY;
      const interactive = e.target.closest(INTERACTIVE_SELECTOR);
      setInteractive(!!interactive);
    };

    const down = () => {
      if (ringRef.current)
        ringRef.current.style.setProperty("--ring-scale", "0.7");
    };
    const up = () => {
      if (ringRef.current)
        ringRef.current.style.setProperty("--ring-scale", "1");
    };
    const hide = () => {
      if (dotRef.current) dotRef.current.style.opacity = "0";
      if (ringRef.current) ringRef.current.style.opacity = "0";
    };
    const show = () => {
      if (dotRef.current) dotRef.current.style.opacity = "1";
      if (ringRef.current) ringRef.current.style.opacity = "1";
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    window.addEventListener("mouseleave", hide);
    window.addEventListener("mouseenter", show);

    // Initialize
    if (dotRef.current) {
      dotRef.current.style.setProperty("--tx", x + "px");
      dotRef.current.style.setProperty("--ty", y + "px");
    }
    if (ringRef.current) {
      ringRef.current.style.setProperty("--tx", x + "px");
      ringRef.current.style.setProperty("--ty", y + "px");
    }

    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("mouseleave", hide);
      window.removeEventListener("mouseenter", show);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
