import { useState } from "react";
import "./css/SignInForm.css";
import SignUpForm from "./SignUpForm";

export default function SignInForm() {
  const [click, setClick] = useState(false);
  function clicked() {
    setClick(true);
  }

  return (
    <div className="form">
      {click === false ? (
        <form id="sign-form" method="POST" action="g">
          <label for="username" className="form-label">
            Имя пользователя
          </label>
          <input type="text" id="username" className="form-input"></input>

          <label for="password" className="form-label">
            Пароль
          </label>
          <input type="password" id="password" className="form-input"></input>
          <button type="submit" className="sign-button">
            Войти
          </button>

          <div className="dotted-line"></div>
          <p id="sign-up-offer">Нет аккаунта?</p>

          <button className="sign-button" onClick={clicked}>
            Регистрация
          </button>
        </form>
      ) : (
        <SignUpForm />
      )}
    </div>
  );
}
