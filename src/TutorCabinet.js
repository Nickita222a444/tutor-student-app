import "./css/TutorCabinet.css";
import door from "./img/door_icon.svg";
import user_icon from "./img/user_icon.svg";
import { useState, useEffect, useRef } from "react";
import Select from "react-select";
import Comment from "./Comment";

function getQuantity(n) {
  const old_n = n;
  n %= 100;
  if ((n >= 5 && n <= 20) || n === 0) {
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

export default function TutorCabinet({ username }) {
  const [likesCount, setLikesCount] = useState(1);
  const [resume, setResume] = useState([]);
  const [isResumeExists, setIsResumeExists] = useState(false);
  const [isNoResBut, setIsNoResBut] = useState(false);
  const [saveBut, setSaveBut] = useState(false);

  const [name, setName] = useState(null);
  const [birthDate, setBirthDate] = useState(null);
  const [education, setEducation] = useState(null);
  const [about, setAbout] = useState(null);
  const [email, setEmail] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [specs, setSpecs] = useState([]);

  const firstRend = useRef(true);
  useEffect(() => {
    if (firstRend.current) firstRend.current = false;
    else {
      fetch("http://localhost:3010/get", { method: "post" })
        .then((res) => res.json())
        .then((res) => {
          setLikesCount(res.likesCount);
          setResume(res.resume);
          setIsResumeExists(res.isResumeExists);
        });
    }
  }, []);

  useEffect(() => {
    fetch("http://localhost:3010/saveResume", {
      method: "post",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        name,
        birthDate,
        education,
        specs,
        about,
        email,
        phoneNumber,
        isResumeExists,
      }),
    })
      .then((res) => res.json())
      .then((res) => alert(res.data));
  }, [saveBut]);

  return (
    <div className="tutor-screen">
      <div id="user-panel">
        <p id="username">{username}</p>
        <img src={user_icon} id="user-icon" />
        <button className="button" id="exit-button">
          Выйти
          <img src={door} />
        </button>
      </div>
      {isResumeExists ? (
        <form
          id="tutor-form"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <label htmlFor="name" className="form-label">
            ФИО
          </label>
          <input
            type="text"
            id="name"
            className="form-input"
            onChange={(e) => setName(e.target.value)}
            defaultValue={resume.full_name}
          ></input>
          <label htmlFor="birth_date" className="form-label">
            Дата рождения
          </label>
          <input
            type="date"
            id="birth-date"
            className="form-input"
            onChange={(e) => setBirthDate(e.target.value)}
            defaultValue={resume.birth_date}
          ></input>
          <label htmlFor="education" className="form-label">
            Образование
          </label>
          <input
            type="text"
            id="education"
            className="form-input"
            onChange={(e) => setEducation(e.target.value)}
            defaultValue={resume.education}
          ></input>

          <label htmlFor="specialization-list" className="form-label">
            Специализация
          </label>
          <Select
            isMulti
            placeholder=""
            className="specialization-list"
            classNamePrefix="react-select"
            options={[
              { label: "Алхимия", value: 1 },
              { label: "Хиромантия", value: 2 },
              { label: "Армянский язык", value: 3 },
            ]}
            onChange={(e) => setSpecs(e)}
            defaultValue={resume.qualification}
          />
          <label htmlFor="about" className="form-label">
            О себе
          </label>
          <input
            type="text"
            id="about"
            className="form-input"
            onChange={(e) => setAbout(e.target.value)}
            defaultValue={resume.about}
          ></input>
          <label htmlFor="contacts" className="form-label">
            Контакты
          </label>
          <input
            type="email"
            className="contacts form-input"
            placeholder="Электронная почта"
            onChange={(e) => setEmail(e.target.value)}
            defaultValue={resume.work_email}
          ></input>
          <input
            type="tel"
            className="contacts form-input"
            placeholder="Телефон"
            onChange={(e) => setPhoneNumber(e.target.value)}
            defaultValue={resume.phone_number}
          ></input>

          <button
            type="submit"
            className="button save-button"
            onClick={() => {
              setIsResumeExists(true);
              setSaveBut((prevState) => !prevState);
            }}
          >
            Сохранить
          </button>
        </form>
      ) : !isResumeExists && isNoResBut ? (
        <form
          id="tutor-form"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <label htmlFor="name" className="form-label">
            ФИО
          </label>
          <input
            type="text"
            id="name"
            className="form-input"
            onChange={(e) => setName(e.target.value)}
          ></input>
          <label htmlFor="birth_date" className="form-label">
            Дата рождения
          </label>
          <input
            type="date"
            id="birth-date"
            className="form-input"
            onChange={(e) => setBirthDate(e.target.value)}
          ></input>
          <label htmlFor="education" className="form-label">
            Образование
          </label>
          <input
            type="text"
            id="education"
            className="form-input"
            onChange={(e) => setEducation(e.target.value)}
          ></input>

          <label htmlFor="specialization-list" className="form-label">
            Специализация
          </label>
          <Select
            isMulti
            placeholder=""
            className="specialization-list"
            classNamePrefix="react-select"
            options={[
              { label: "Алхимия", value: 1 },
              { label: "Хиромантия", value: 2 },
              { label: "Армянский язык", value: 3 },
            ]}
            onChange={(e) => setSpecs(e)}
          />
          <label htmlFor="about" className="form-label">
            О себе
          </label>
          <input
            type="text"
            id="about"
            className="form-input"
            onChange={(e) => setAbout(e.target.value)}
          ></input>
          <label htmlFor="contacts" className="form-label">
            Контакты
          </label>
          <input
            type="email"
            className="contacts form-input"
            placeholder="Электронная почта"
            onChange={(e) => setEmail(e.target.value)}
          ></input>
          <input
            type="tel"
            className="contacts form-input"
            placeholder="Телефон"
            onChange={(e) => setPhoneNumber(e.target.value)}
          ></input>

          <button
            type="submit"
            className="button save-button"
            onClick={() => {
              setIsResumeExists(true);
              setSaveBut((prevState) => !prevState);
            }}
          >
            Сохранить
          </button>
        </form>
      ) : (
        <div className="fineDiv">
          <p className="no_resume">У вас ещё нет резюме</p>
          <button
            className="button"
            id="no_resume_but"
            onClick={() => setIsNoResBut((prev) => !prev)}
          >
            Создать резюме
          </button>
        </div>
      )}
      <div id="right-col">
        <p>
          Вас добавили в избранное:
          <br />
          {getQuantity(likesCount)}
        </p>
        <p>
          Комментарии (
          {resume.feedback !== undefined ? resume.feedback.length : 0}):
        </p>
        {resume.feedback !== undefined
          ? Array.prototype.slice.call(resume.feedback, 0).map((item) => {
              return (
                <Comment
                  nickname={item.author_name}
                  date={item.date}
                  text={item.text}
                />
              );
            })
          : null}
      </div>
    </div>
  );
}
