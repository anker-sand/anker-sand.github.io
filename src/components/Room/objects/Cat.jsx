//import catImg from "../../../assets/images/cat/animated_cat.gif";
//import useSound from "use-sound";
//import meowSound from "../../../assets/audio/meow.mp3";

export default function Cat() {
  const [playMeow] = useSound(meowSound);

  return (
    <img
      src={catImg}
      alt="Cat"
      className="cat"
      style={{
        position: "absolute",
        bottom: "20%", // 20% from bottom of container
        left: "40%", // 40% from left of container
        width: "15%", // relative to container width
        cursor: "pointer",
      }}
    />
  );
}
