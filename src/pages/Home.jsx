import roomBase from "../assets/images/room_img/Room_base.png";
import "./Home.css";
//import Cat from "../components/Room/objects/Cat";

export default function Home() {
  return (
    <div className="home-container">
      <img src={roomBase} alt="Room base" className="room-base" />
    </div>
  );
}
