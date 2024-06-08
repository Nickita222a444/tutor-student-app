import user_icon from "./img/user_icon.svg";
import door from "./img/door_icon.svg";
import heart from "./img/favorite_icon.svg";
import empty_heart from "./img/favorite_icon_empty.svg";
import pencil_icon from "./img/pencil_icon.svg";
import Comment from "./Comment";
import "./css/TutorCabinet.css";
import { useEffect, useRef, useState, useReducer } from "react";

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

let favRenderCounter = 0;

export default function FullTutorCard({ nickname }) {
  const [name, setName] = useState();
  const [birth_date, setBirthDate] = useState();
  const [education, setEducation] = useState();
  const [specs, setSpecs] = useState();
  const [about, setAbout] = useState();
  const [phone, setPhone] = useState();
  const [email, setEmail] = useState();
  const [likesCount, setLikesCount] = useState();
  const [commentsCount, setCommentsCount] = useState();
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState(null);
  const [commentBut, setCommentBut] = useState(false);

  let firstRend = useRef(true);

  const [favorited, setFavorited] = useState(false);
  useEffect(() => {
    if (firstRend.current === true) firstRend.current = false;
    else {
      fetch("http://localhost:3010/getFullTutorCard", {
        method: "post",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({ name: nickname }),
      })
        .then((res) => res.json())
        .then((res) => {
          setName(res.resume.full_name);
          setBirthDate(
            `${res.resume.birth_date.substr(0, 10).split("-")[2]}-${
              res.resume.birth_date.substr(0, 10).split("-")[1]
            }-${res.resume.birth_date.substr(0, 10).split("-")[0]}`
          );
          setEducation(res.resume.education);
          setAbout(res.resume.about);
          setSpecs(res.resume.qualification);
          setPhone(res.resume.phone_number);
          setEmail(res.resume.work_email);
          setLikesCount(res.likesCount);

          if (res.resume.feedback === undefined) setCommentsCount(0);
          else setCommentsCount(res.resume.feedback.length);
          setComments(res.resume.feedback);
          setFavorited(res.clicked);
        });
    }
  }, []);

  useEffect(() => {
    if (favRenderCounter >= 2) {
      console.log(favorited);
      fetch("http://localhost:3010/changeFav", {
        method: "post",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({ clicked: favorited, tutor_nick: nickname }),
      });
    } else ++favRenderCounter;
  }, [favorited]);

  useEffect(() => {
    if (favRenderCounter >= 2) {
      if (commentText !== null)
        fetch("http://localhost:3010/sendComment", {
          method: "post",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({
            text: commentText,
            date: new Date(),
            tutor: nickname,
          }),
        });
    } else ++favRenderCounter;
  }, [commentBut]);

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
          {name}
        </p>
        <label htmlFor="birth_date" className="form-label">
          Дата рождения
        </label>
        <p id="birth-date" className="resume-input">
          {birth_date}
        </p>
        <label htmlFor="education" className="form-label">
          Образование
        </label>
        <p id="education" className="resume-input">
          {education}
        </p>

        <label htmlFor="specialization-list" className="form-label">
          Специализация
        </label>
        <p id="specialization" className="resume-input">
          {specs}
        </p>
        <label htmlFor="about" className="form-label">
          О себе
        </label>
        <p id="about" className="resume-input">
          {about}
        </p>
        <label htmlFor="contacts" className="form-label">
          Контакты
        </label>
        <p className="contacts resume-input">{email}</p>
        <p className="contacts resume-input">{phone}</p>
      </div>
      <div id="right-col">
        <p>
          Этого преподавателя добавили в избранное:
          <br />
          {getQuantity(likesCount)}
        </p>
        <button
          type="submit"
          className="button"
          id="favorite-button"
          onClick={() => setFavorited((prevState) => !prevState)}
        >
          <img src={favorited ? heart : empty_heart} />
          <p>{favorited ? "Удалить из избранного" : "В избранное"} </p>
        </button>
        <p>Комментарии ({commentsCount}):</p>
        {comments !== undefined
          ? Array.prototype.slice.call(comments, 0).map((item) => {
              return (
                <Comment
                  nickname={item.author_name}
                  text={item.text}
                  date={`${item.date.substr(0, 10).split("-")[2]}-${
                    item.date.substr(0, 10).split("-")[1]
                  }-${item.date.substr(0, 10).split("-")[0]}`}
                />
              );
            })
          : null}
        <p id="review-greeting">Оставить отзыв:</p>
        <textarea
          class="review-input"
          onChange={(e) => setCommentText(e.target.value)}
        ></textarea>
        <button
          type="submit"
          className="button"
          id="favorite-button"
          onClick={() => {
            setCommentBut((prevState) => !prevState);
            alert("Ваш отзыв сохранён");
          }}
        >
          <img src={pencil_icon} />
          <p>Сохранить</p>
        </button>
      </div>
    </div>
  );
}
