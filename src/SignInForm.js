import { useState } from "react";
import "./SignInForm.css";
import SignUpForm from "./SignUpForm";

export default function SignInForm() {
  const [click, setClick] = useState(false);
  function clicked() {
    setClick(true);
  }

  return (
    <div className="form">
      {click === false ? (
        <form id="sign-form">
          <label for="username" className="form-label">
            Username
          </label>
          <input type="text" id="username" className="form-input"></input>

          <label for="password" className="form-label">
            Password
          </label>
          <input type="password" id="password" className="form-input"></input>
          <button type="submit" className="sign-button">
            Sign in
          </button>

          <div className="dotted-line"></div>
          <p id="sign-up-offer">Don't have an account?</p>

          <button className="sign-button" onClick={clicked}>
            Sign Up
          </button>
        </form>
      ) : (
        <SignUpForm />
      )}
    </div>
  );
}
