import TutorCard from "./TutorCard";
import "./css/StudentCabinet.css";
import Select from "react-select";
import user_icon from "./img/user_icon.svg";
import door_icon from "./img/door_icon.svg";
import { useState, useEffect, useRef } from "react";

let firstTime = true;

export default function StudentCabinet({ username }) {
  const [value, setValue] = useState("student");

  const [searchItems, setSearchItems] = useState([]);
  const [tutorItems, setTutorItems] = useState([]);
  const [logOutBut, setLogOutBut] = useState(false);
  const [searchBut, setSearchBut] = useState(false);

  const [minAge, setMinAge] = useState();
  const [maxAge, setMaxAge] = useState();
  const [specs, setSpecs] = useState();

  let firstRend = useRef(true);

  // useEffect(() => {
  //   if (firstRend.current) {
  //     firstRend.current = false;
  //     console.log("точно true");
  //   } else {
  //     console.log("точно false");
  //     fetch("http://localhost:3010/l", {
  //       method: "POST",
  //     })
  //       .then((res) => res.json())
  //       .then((res) => {
  //         console.log(res.data);
  //       });
  //   }
  // }, [logOutBut]);

  useEffect(() => {
    if (firstRend.current) firstRend.current = false;
    else {
      fetch("http://localhost:3010/findInitialData", { method: "post" })
        .then((res) => res.json())
        .then((res) => {
          setTutorItems(res.cards);
          setSearchItems(res.subjects);
        });
      firstRend.current = true;
    }
  }, []);

  useEffect(() => {
    {
      if (firstRend.current) firstRend.current = false;
      else {
        if (!firstTime)
          fetch("http://localhost:3010/findTutors", {
            method: "post",
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({ minAge: +minAge, maxAge: +maxAge, specs }),
          })
            .then((res) => res.json())
            .then((res) => {
              setTutorItems(res.data);
            });
        else firstTime = false;
      }
    }
  }, [searchBut]);

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
          <p id="username">{username}</p>
          <img src={user_icon} id="user-icon" />
          <button
            className="button"
            id="exit-button"
            onClick={() => {
              setLogOutBut((prevState) => !prevState);
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
          options={Array.prototype.slice.call(searchItems, 0).map((item) => {
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
          setSearchBut((prevState) => !prevState);
        }}
      >
        Найти
      </button>
      <div id="search-result">
        {Array.prototype.slice.call(tutorItems, 0).map((item) => {
          return (
            <TutorCard
              name={item.full_name}
              birth_date={item.birth_date}
              specialization={item.qualification}
              about={item.about}
            />
          );
        })}
      </div>
    </div>
  );
}
