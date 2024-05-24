import TutorCard from "./TutorCard";
import "./css/StudentCabinet.css";
import Select from "react-select";
import user_icon from "./img/user_icon.svg";
import door_icon from "./img/door_icon.svg";
import { useState, useEffect } from "react";

export default function StudentCabinet() {
  const [value, setValue] = useState("student");

  const [searchItems, setSearchItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3010/subjects")
      .then((res) => res.json())
      .then((result) => {
        setSearchItems(result);
      });
  }, []);

  return (
    <div className="student-screen">
      <div>
        <div id="search-mode">
          <input
            type="radio"
            name="role"
            id="all-mode"
            value="all"
            checked={value === "all" ? true : false}
            onChange={(event) => {
              setValue(event.target.value);
            }}
          />
          <label for="all-mode">Поиск</label>
          <input
            type="radio"
            name="role"
            id="fav-mode"
            value="fav"
            checked={value === "fav" ? true : false}
            onChange={(event) => {
              setValue(event.target.value);
            }}
          />
          <label for="fav-mode">Избранное</label>
          <div id="search-role-layer"></div>
        </div>
        <div id="user-panel">
          <p id="username">Jacob</p>
          <img src={user_icon} id="user-icon" />
          <button className="button" id="exit-button">
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
          options={Array.prototype.slice.call(searchItems, 0).map((item) => {
            return { label: item.subject_name, value: item.subject_id };
          })}
        ></Select>
      </div>

      <div id="age-select">
        <p>Возраст</p>
        <p>от</p>
        <input type="number"></input>
        <p>до</p>
        <input type="number"></input>
      </div>

      <button type="submit" className="button search-button">
        Найти
      </button>
      <div id="search-result">
        <TutorCard
          name="Николас Фламель"
          birth_date="01.01.1330"
          specialization={["алхимия", "торговля"]}
          about="создатель философского камня, плейбой, меценат. Веду курсы по алхимии и предпринимательству. Опыт преподавания 200 лет"
        />
        <TutorCard
          name="Волан-де-Морт"
          birth_date="31.12.1926"
          specialization={["некромантия", "чёрная магия"]}
          about={
            "самый авторитетный чёрный волшебник всех времён и народов. Учу воскрешать единорогов"
          }
        />
      </div>
    </div>
  );
}
