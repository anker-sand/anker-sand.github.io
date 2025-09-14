import roomBase from "../assets/images/room/theroom.png";
import desk from "../assets/images/room/desk.png";
import meinchair from "../assets/images/room/meinchair.png";
import projectwall from "../assets/images/room/projectwall.png";
import door from "../assets/images/room/door.png";
import mail from "../assets/images/room/mail.png";
import chair from "../assets/images/room/chair.png"; // NEW
import doormat from "../assets/images/room/doormat.png"; // NEW
import plant from "../assets/images/room/plant.png"; // NEW
import bookcase from "../assets/images/room/bookcase.png"; // NEW
import rug from "../assets/images/room/rug.png"; // NEW
import InteractiveObject from "../components/Room/objects/InteractiveObject";
import "./Home.css";
import { motion } from "framer-motion"; // <-- added

export default function Home({ onNavigate }) {
  return (
    <div className="home-container">
      <motion.div
        className="room-wrapper"
        initial={{ y: 160, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          transition: { duration: 0.6, ease: "easeOut", delay: 0.15 },
        }}
      >
        <img src={roomBase} className="room-base" />
        <img src={desk} className="desk" />

        {/* Existing interactive objects */}
        <InteractiveObject
          image={meinchair}
          className="meinchair"
          tooltipText="About Me"
          onClick={() => onNavigate("about")}
        />

        <InteractiveObject
          image={projectwall}
          className="projectwall"
          tooltipText="Projects"
          onClick={() => onNavigate("projects")}
        />

        {/* NEW static decorative items */}
        <img src={chair} className="chair" />
        <img src={doormat} className="doormat" />
        <img src={plant} className="plant" />
        <img src={bookcase} className="bookcase" />
        <img src={rug} className="rug" />

        {/* Mail now interactive -> Contact page */}
        <InteractiveObject
          image={mail}
          className="mail"
          tooltipText="Contact"
          onClick={() => onNavigate("contact")}
        />

        <img src={door} className="door" />
      </motion.div>
    </div>
  );
}
