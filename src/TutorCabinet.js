import "./css/TutorCabinet.css";
import door from "./img/door_icon.svg";
import user_icon from "./img/user_icon.svg";
import { useState } from "react";
import Select from "react-select";
import Comment from "./Comment";

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

export default function TutorCabinet() {
  const [isClearable, setIsClearable] = useState(true);
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
      <form id="tutor-form">
        <label htmlFor="name" className="form-label">
          ФИО
        </label>
        <input type="text" id="name" className="form-input"></input>
        <label htmlFor="birth_date" className="form-label">
          Дата рождения
        </label>
        <input type="date" id="birth-date" className="form-input"></input>
        <label htmlFor="education" className="form-label">
          Образование
        </label>
        <input type="text" id="education" className="form-input"></input>

        <label htmlFor="specialization-list" className="form-label">
          Специализация
        </label>
        <Select
          isMulti
          placeholder=""
          className="specialization-list"
          classNamePrefix="react-select"
          options={[
            { label: "Алхимия" },
            { label: "Хиромантия" },
            { label: "Армянский язык" },
          ]}
        />
        <label htmlFor="about" className="form-label">
          О себе
        </label>
        <input type="text" id="about" className="form-input"></input>
        <label htmlFor="contacts" className="form-label">
          Контакты
        </label>
        <input
          type="email"
          className="contacts form-input"
          placeholder="Электронная почта"
        ></input>
        <input
          type="tel"
          className="contacts form-input"
          placeholder="Телефон"
        ></input>

        <button type="submit" className="button">
          Сохранить
        </button>
      </form>
      <div id="right-col">
        <p>
          Вас добавили в избранное:
          <br />
          {getQuantity(2)}
        </p>
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
      </div>
    </div>
  );
}
