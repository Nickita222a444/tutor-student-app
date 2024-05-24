import ErrorCat from "./img/error-cat.svg";
import "./css/ErrorPage.css";

export default function ErrorPage() {
  return (
    <div class="error-screen">
      <div className="error-container">
        <img src={ErrorCat} className="error-img" />

        <p className="error-message">Запрашиваемой страницы не существует</p>
      </div>
    </div>
  );
}
