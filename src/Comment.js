import "./css/Comment.css";
import user_icon from "./img/user_icon.svg";

export default function Comment({ nickname, date, text }) {
  return (
    <div className="comment">
      <img src={user_icon} className="comment-logo" />
      <div className="comment-info">
        <p>{nickname}</p>
        <p>{date}</p>
      </div>
      <p className="comment-text">{text}</p>
    </div>
  );
}
