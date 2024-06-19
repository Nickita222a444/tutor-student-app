import "./css/TutorCard.css";
import user_icon from "./img/user_icon.svg";
import FullTutorCard from "./FullTutorCard";
import { useState } from "react";

export default function TutorCard({
  nick,
  name,
  birth_date,
  specialization,
  about,
  func,
}) {
  const [clicked, setClicked] = useState(false);
  return clicked == false ? (
    <div class="tutor-card">
      <img src={user_icon} id="user-icon" />
      <div id="tutor-info">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            setClicked((prevState) => !prevState);
          }}
        >
          {name}
        </a>
        <p>
          Дата рождения:{" "}
          {`${birth_date.substr(0, 10).split("-")[2]}-${
            birth_date.substr(0, 10).split("-")[1]
          }-${birth_date.substr(0, 10).split("-")[0]}`}
          . Специализация:{" "}
          {specialization.map((item) => {
            if (item === specialization[specialization.length - 1])
              return `${item}`;
            return `${item}, `;
          })}
          .<br /> О себе: {about}
        </p>
      </div>
    </div>
  ) : (
    <FullTutorCard nickname={nick} func={func} />
  );
}
