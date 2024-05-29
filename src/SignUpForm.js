import "./css/SignInForm.css";
import { useEffect, useState, useRef } from "react";
import SignInForm from "./SignInForm";

let first = true;

export default function SignUpForm() {
  const [click, setClick] = useState(false);
  const [value, setValue] = useState("student");
  const [emailValue, setEmailValue] = useState("");
  const [nicknameValue, setNicknameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [butState, changeButState] = useState(false);

  function clicked() {
    first = true;
    setClick(true);
  }

  const firstRender = useRef(true);

  useEffect(() => {
    if(firstRender.current) firstRender.current = false;
    else {
    fetch("http://localhost:3010/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({emailValue, nicknameValue, passwordValue, role: value}), // no first
    })
      .then((res) => res.json())
      .then((res) => 
        {if(first === false) alert(res.data);
        first = false;
      })
    }
  }, [butState]);

  return (
    <div className="form">
      {click === false ? (
        <form id="sign-form" onSubmit={(e) => {
          e.preventDefault();
        }}>
          <p id="greeting">Let's register</p>
          <div id="role">
            <input
              type="radio"
              name="role"
              id="student-role"
              value="student"
              checked={value === "student" ? true : false}
              onChange={(event) => {
                setValue(event.target.value);
              }}
            />
            <label for="student-role">Студент</label>
            <input
              type="radio"
              name="role"
              id="tutor-role"
              value="tutor"
              checked={value === "tutor" ? true : false}
              onChange={(event) => {
                setValue(event.target.value);
              }}
            />
            <label for="tutor-role">Репетитор</label>
            <div id="role-layer"></div>
          </div>

          <label for="username" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="form-input"
            name="email"
            onChange={(e) => setEmailValue(e.target.value)}
          ></input>
          <label for="username" className="form-label">
            Имя пользователя
          </label>
          <input
            type="text"
            id="username"
            className="form-input"
            name="username"
            onChange={(e) => setNicknameValue(e.target.value)}
          ></input>
          <label for="password" className="form-label">
            Пароль
          </label>
          <input
            type="password"
            id="password"
            className="form-input"
            name="password"
            onChange={(e) => setPasswordValue(e.target.value)}
          ></input>
          <button
            type="submit"
            className="sign-button"
            onClick={() => {
                changeButState((prevState) => !prevState);
            }}
          >
            Регистрация
          </button>

          <div className="dotted-line"></div>
          <p id="sign-in-offer">Нет аккаунта?</p>

          <button className="sign-button" onClick={clicked}>
            Войти
          </button>
        </form>
      ) : (
        <SignInForm />
      )}
    </div>
  );
}
