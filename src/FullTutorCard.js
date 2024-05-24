import user_icon from "./img/user_icon.svg";
import door from "./img/door_icon.svg";
import heart from "./img/favorite_icon.svg";
import pencil_icon from "./img/pencil_icon.svg";
import Comment from "./Comment";
import "./css/TutorCabinet.css";

function getQuantity(n) {
  const old_n = n;
  n %= 100;
  if (n >= 5 && n <= 20) {
    return `${old_n} студентов`;
  }
  n %= 10;
  if (n === 1) {
    return `${old_n} студент`;
  }
  if (n >= 2 && n <= 4) {
    return `${old_n} студента`;
  }
}

export default function FullTutorCard() {
  return (
    <div className="tutor-screen">
      <div id="user-panel">
        <p id="username">Jacob</p>
        <img src={user_icon} id="user-icon" />
        <button className="button" id="exit-button">
          Выйти
          <img src={door} />
        </button>
      </div>
      <div id="tutor-resume">
        <label htmlFor="name" className="form-label">
          ФИО
        </label>
        <p id="name" className="resume-input">
          Волан-де-Морт
        </p>
        <label htmlFor="birth_date" className="form-label">
          Дата рождения
        </label>
        <p id="birth-date" className="resume-input">
          31.12.1926
        </p>
        <label htmlFor="education" className="form-label">
          Образование
        </label>
        <p id="education" className="resume-input">
          Хогвартс
        </p>

        <label htmlFor="specialization-list" className="form-label">
          Специализация
        </label>
        <p id="specialization" className="resume-input">
          некромантия, чёрная магия
        </p>
        <label htmlFor="about" className="form-label">
          О себе
        </label>
        <p id="about" className="resume-input">
          Самый авторитетный чёрный волшебник всех времён и народов. Учу
          воскрешать единорогов
        </p>
        <label htmlFor="contacts" className="form-label">
          Контакты
        </label>
        <p className="contacts resume-input">fear@hogwarts.com</p>
        <p className="contacts resume-input">88005553535</p>
      </div>
      <div id="right-col">
        <p>
          Этого преподавателя добавили в избранное:
          <br />
          {getQuantity(2)}
        </p>
        <button type="submit" className="button favorite-button">
          <img src={heart} />
          <p>В избранное</p>
        </button>
        <p>Комментарии (2):</p>
        <Comment
          nickname="Ludvick"
          date="24.04.24"
          text="Здорово, всё супер!"
        />
        <Comment
          nickname="Richard"
          date="23.04.24"
          text="Отвратительно. Весь урок обсуждали жёсткую воду"
        />
        <p id="review-greeting">Оставить отзыв:</p>
        <textarea class="review-input"></textarea>
        <button type="submit" className="button favorite-button">
          <img src={pencil_icon} />
          <p>Сохранить</p>
        </button>
      </div>
    </div>
  );
}
