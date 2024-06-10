import TutorCard from "./TutorCard";
import SignInForm from "./SignInForm";
import "./css/StudentCabinet.css";
import Select from "react-select";
import user_icon from "./img/user_icon.svg";
import door_icon from "./img/door_icon.svg";
import { useState, useEffect, useRef } from "react";

let searchRenderCounter = 0;
let studLogOutCheck = false;
let searchClicked = false;

export default function StudentCabinet({ username }) {
  const [searchItems, setSearchItems] = useState([]);
  const [tutorItems, setTutorItems] = useState([]);
  const [logOutBut, setLogOutBut] = useState(false);
  const [searchBut, setSearchBut] = useState(false);
  const [searchMode, setSearchMode] = useState("all");

  const [minAge, setMinAge] = useState();
  const [maxAge, setMaxAge] = useState();
  const [specs, setSpecs] = useState([]);

  let firstRend = useRef(true);

  useEffect(() => {
    if (firstRend.current === true) firstRend.current = false;
    else {
      fetch("http://localhost:3010/findInitialData", {
        method: "post",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({ searchMode }),
      })
        .then((res) => res.json())
        .then((res) => {
          setTutorItems(res.cards);
          setSearchItems(res.subjects);
        });
    }
  }, [searchMode]);

  useEffect(() => {
    {
      if (searchRenderCounter >= 2) {
        if (searchClicked)
          fetch("http://localhost:3010/findTutors", {
            method: "post",
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
              minAge: +minAge,
              maxAge: +maxAge,
              specs,
              searchMode,
            }),
          })
            .then((res) => res.json())
            .then((res) => {
              if (
                res.data === "Пожалуйста, заполните специализацию" ||
                res.data === "Некорректный возраст"
              )
                alert(res.data);
              else {
                setTutorItems(res.data);
                searchClicked = false;
              }
            });
      } else ++searchRenderCounter;
    }
  }, [searchBut]);

  useEffect(() => {
    if (studLogOutCheck) {
      fetch("http://localhost:3010/log-out", { method: "POST" })
        .then((res) => res.json())
        .then((res) => console.log(res.ok));
      alert("До свидания!");
      studLogOutCheck = false;
    }
  }, [logOutBut]);

  return (
    <div>
      {!logOutBut ? (
        <div className="student-screen">
          <div>
            <div id="search-mode">
              <input
                type="radio"
                name="role"
                id="all-mode"
                value="all"
                checked={searchMode === "all" ? true : false}
                onChange={(event) => setSearchMode(event.target.value)}
              />
              <label for="all-mode">Поиск</label>
              <input
                type="radio"
                name="role"
                id="fav-mode"
                value="fav"
                checked={searchMode === "fav" ? true : false}
                onChange={(event) => setSearchMode(event.target.value)}
              />
              <label for="fav-mode">Избранное</label>
              <div id="search-role-layer"></div>
            </div>
            <div id="user-panel">
              <p id="username">{username}</p>
              <img src={user_icon} id="user-icon" />
              <button
                className="button"
                id="exit-button"
                onClick={() => {
                  setLogOutBut((prevState) => !prevState);
                  studLogOutCheck = true;
                }}
              >
                Выйти
                <img src={door_icon} />
              </button>
            </div>
          </div>

          <div id="search">
            <p>Специализация</p>
            <Select
              isMulti
              className="specialization-list"
              classNamePrefix="react-select"
              placeholder=""
              options={Array.prototype.slice
                .call(searchItems, 0)
                .map((item) => {
                  return { label: item.subject_name, value: item.subject_id };
                })}
              onChange={(e) => {
                setSpecs(e);
              }}
            ></Select>
          </div>

          <div id="age-select">
            <p>Возраст</p>
            <p>от</p>
            <input
              type="number"
              onChange={(e) => setMinAge(e.target.value)}
            ></input>
            <p>до</p>
            <input
              type="number"
              onChange={(e) => setMaxAge(e.target.value)}
            ></input>
          </div>

          <button
            type="submit"
            className="button search-button"
            onClick={() => {
              searchClicked = true;
              setSearchBut((prevState) => !prevState);
            }}
          >
            Найти
          </button>
          <div id="search-result">
            {Array.prototype.slice.call(tutorItems, 0).map((item) => {
              return (
                <TutorCard
                  nick={item.nickname}
                  name={item.full_name}
                  birth_date={item.birth_date}
                  specialization={item.qualification}
                  about={item.about}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <SignInForm />
      )}
    </div>
  );
}
