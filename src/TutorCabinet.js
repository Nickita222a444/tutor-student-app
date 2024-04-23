import "./css/TutorCabinet.css";
import door from "./img/door_icon.svg";
import user_icon from "./img/user_icon.svg";

export default function TutorCabinet() {
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
    </div>
  );
}
