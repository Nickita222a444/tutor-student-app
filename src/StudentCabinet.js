import "./css/StudentCabinet.css";
import Select from "react-select";

export default function StudentCabinet() {
  return (
    <div className="student-screen">
      <p>Поиск</p>
      <div id="search">
        <p>Специализация</p>
        <Select
          isMulti
          className="specialization-list"
          classNamePrefix="react-select"
          placeholder=""
          options={[
            { label: "Алхимия" },
            { label: "Хиромантия" },
            { label: "Армянский язык" },
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
        Сохранить
      </button>
    </div>
  );
}
