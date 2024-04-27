import TutorCard from "./TutorCard";
import "./css/StudentCabinet.css";
import Select from "react-select";
import user_icon from "./img/user_icon.svg";
import door_icon from "./img/door_icon.svg";

export default function StudentCabinet() {
  return (
    <div className="student-screen">
      <div>
        <p id="search-p">Поиск</p>
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
          options={[
            { label: "Алхимия", value: "alchemy" },
            { label: "Хиромантия", value: "palmistry" },
            { label: "Армянский язык", value: "armenian-language" },
          ]}
        ></Select>
      </div>

      <div id="age-select">
        <p>Возраст</p>
        <p>от</p>
        <input type="number"></input>
        <p>до</p>
        <input type="number"></input>
      </div>

      <button type="submit" className="button save-button">
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
          about="самый авторитетный чёрный волшебник всех времён и народов. Учу воскрешать единорогов."
        />
        <TutorCard
          name="Волан-де-Морт"
          birth_date="31.12.1926"
          specialization={["некромантия", "чёрная магия"]}
          about="самый авторитетный чёрный волшебник всех времён и народов. Учу воскрешать единорогов."
        />
        <TutorCard
          name="Волан-де-Морт"
          birth_date="31.12.1926"
          specialization={["некромантия", "чёрная магия"]}
          about="самый авторитетный чёрный волшебник всех времён и народов. Учу воскрешать единорогов."
        />
        <TutorCard
          name="Волан-де-Морт"
          birth_date="31.12.1926"
          specialization={["некромантия", "чёрная магия"]}
          about="самый авторитетный чёрный волшебник всех времён и народов. Учу воскрешать единорогов."
        />
        <TutorCard
          name="Волан-де-Морт"
          birth_date="31.12.1926"
          specialization={["некромантия", "чёрная магия"]}
          about="самый авторитетный чёрный волшебник всех времён и народов. Учу воскрешать единорогов."
        />
        <TutorCard
          name="Волан-де-Морт"
          birth_date="31.12.1926"
          specialization={["некромантия", "чёрная магия"]}
          about="самый авторитетный чёрный волшебник всех времён и народов. Учу воскрешать единорогов."
        />
        <TutorCard
          name="Волан-де-Морт"
          birth_date="31.12.1926"
          specialization={["некромантия", "чёрная магия"]}
          about="самый авторитетный чёрный волшебник всех времён и народов. Учу воскрешать единорогов."
        />
        <TutorCard
          name="Волан-де-Морт"
          birth_date="31.12.1926"
          specialization={["некромантия", "чёрная магия"]}
          about="самый авторитетный чёрный волшебник всех времён и народов. Учу воскрешать единорогов."
        />
      </div>
    </div>
  );
}
