import { useState, useEffect, useRef } from "react";
import "./css/SignInForm.css";
import SignUpForm from "./SignUpForm";
import StudentCabinet from "./StudentCabinet";
import TutorCabinet from "./TutorCabinet";

let first = true;

export default function SignInForm() {
  const [click, setClick] = useState(false);
  const [nicknameV, setNicknameV] = useState("");
  const [passwordV, setPasswordV] = useState("");
  const [signInButState, changeSignInButState] = useState(false);
  const [isStudent, setIsStudent] = useState(null);

  const SIGNED = "Добро пожаловать!";

  function clicked() {
    first = true;
    setClick(true);
  }

  const firstRend = useRef(true);

  useEffect(() => {
    if (firstRend.current) firstRend.current = false;
    else {
      fetch("http://localhost:3010/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({ nicknameV, passwordV }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (first === false) {
            alert(res.data);
          }
          first = false;
          if (res.data === SIGNED) {
            setIsStudent(res.role);
            setNicknameV(res.nickname);
          }
        });
    }
  }, [signInButState]);

  return (
    <div className="form">
      {isStudent !== null && isStudent == true ? (
        <StudentCabinet username={nicknameV} />
      ) : isStudent !== null && isStudent == false ? (
        <TutorCabinet username={nicknameV} />
      ) : click == false ? (
        <form
          id="sign-form"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <label for="usernameVal" className="form-label">
            Имя пользователя
          </label>
          <input
            type="text"
            id="usernameVal"
            className="form-input"
            onChange={(e) => setNicknameV(e.target.value)}
          ></input>

          <label for="passwordVal" className="form-label">
            Пароль
          </label>
          <input
            type="password"
            id="passwordVal"
            className="form-input"
            onChange={(e) => setPasswordV(e.target.value)}
          ></input>
          <button
            type="submit"
            className="sign-button"
            onClick={() => {
              changeSignInButState((prevState) => !prevState);
            }}
          >
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
