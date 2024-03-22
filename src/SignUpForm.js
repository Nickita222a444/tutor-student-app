import "./css/SignInForm.css";
import { useState } from "react";
import SignInForm from "./SignInForm";

export default function SignUpForm() {
  const [click, setClick] = useState(false);
  const [value, setValue] = useState("student");
  function clicked() {
    setClick(true);
  }

  function changeValue(event) {
    setValue(event.target.value);
  }

  return (
    <div className="form">
      {click === false ? (
        <form id="sign-form">
          <p id="greeting">Let's register</p>
          <div id="role">
            <input
              type="radio"
              name="role"
              id="student-role"
              value="student"
              checked={value == "student" ? true : false}
              onChange={changeValue}
            />
            <label for="student-role">Студент</label>
            <input
              type="radio"
              name="role"
              id="tutor-role"
              value="tutor"
              checked={value == "tutor" ? true : false}
              onChange={changeValue}
            />
            <label for="tutor-role">Репетитор</label>
            <div id="role-layer"></div>
          </div>

          <label for="username" className="form-label">
            Email
          </label>
          <input type="email" id="email" className="form-input"></input>
          <label for="username" className="form-label">
            Имя пользователя
          </label>
          <input type="text" id="username" className="form-input"></input>
          <label for="password" className="form-label">
            Пароль
          </label>
          <input type="password" id="password" className="form-input"></input>
          <button type="submit" className="sign-button" onClick={clicked}>
            Регистрация
          </button>
        </form>
      ) : (
        <SignInForm />
      )}
    </div>
  );
}
