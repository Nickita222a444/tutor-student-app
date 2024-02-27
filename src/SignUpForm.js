import "./SignInForm.css";
import { useState } from "react";
import SignInForm from "./SignInForm";

export default function SignUpForm() {
  const [click, setClick] = useState(false);
  function clicked() {
    setClick(true);
  }
  return (
    <div className="form">
      {click === false ? (
        <form id="sign-form">
          <p id="greeting">Let's register</p>

          <label for="username" className="form-label">
            Email
          </label>
          <input type="email" id="email" className="form-input"></input>
          <label for="username" className="form-label">
            Username
          </label>
          <input type="text" id="username" className="form-input"></input>

          <label for="password" className="form-label">
            Password
          </label>
          <input type="password" id="password" className="form-input"></input>
          <button type="submit" className="sign-button" onClick={clicked}>
            Sign Up
          </button>
        </form>
      ) : (
        <SignInForm />
      )}
    </div>
  );
}
