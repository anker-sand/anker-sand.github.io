import { useState } from "react";
import "./InteractiveObject.css";

export default function InteractiveObject({
  image,
  className,
  tooltipText,
  onClick,
}) {
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0 });

  const handleMouseEnter = (e) => {
    setTooltip({ visible: true, x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    setTooltip((prev) => ({ ...prev, x: e.clientX, y: e.clientY }));
  };

  const handleMouseLeave = () => {
    setTooltip({ visible: false, x: 0, y: 0 });
  };

  return (
    <>
      <img
        src={image}
        className={`interactive-object ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
      />

      {tooltip.visible && (
        <div
          className="tooltip"
          style={{
            position: "fixed",
            top: tooltip.y + 20, // closer vertically
            left: tooltip.x + 20, // closer horizontally
          }}
        >
          {tooltipText}
        </div>
      )}
    </>
  );
}
