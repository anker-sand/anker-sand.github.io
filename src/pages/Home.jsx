import roomBase from "../assets/images/room/theroom.png";
import desk from "../assets/images/room/desk.png";
import meinchair from "../assets/images/room/meinchair.png";
import projectwall from "../assets/images/room/projectwall.png";
import door from "../assets/images/room/door.png";
import mail from "../assets/images/room/mail.png";
import InteractiveObject from "../components/Room/objects/InteractiveObject";
import "./Home.css";

export default function Home({ onNavigate }) {
  return (
    <div className="home-container">
      <div className="room-wrapper">
        <img src={roomBase} className="room-base" />
        <img src={desk} className="desk" />

        <InteractiveObject
          image={meinchair}
          className="meinchair"
          tooltipText="About Me"
          onClick={() => onNavigate("about")}
        />

        <img src={projectwall} className="projectwall" />
        <img src={door} className="door" />
        <img src={mail} className="mail" />
      </div>
    </div>
  );
}
