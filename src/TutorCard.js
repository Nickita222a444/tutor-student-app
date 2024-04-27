import "./css/TutorCard.css";
import user_icon from "./img/user_icon.svg";

export default function TutorCard({ name, birth_date, specialization, about }) {
  return (
    <div class="tutor-card">
      <img src={user_icon} id="user-icon" />
      <div id="tutor-info">
        <a href="">{name}</a>
        <p>
          Дата рождения: {birth_date}. Специализация:{" "}
          {specialization.map((item) => {
            if (item === specialization[specialization.length - 1])
              return `${item}`;
            return `${item}, `;
          })}
          .<br /> О себе: {about}
        </p>
      </div>
    </div>
  );
}
