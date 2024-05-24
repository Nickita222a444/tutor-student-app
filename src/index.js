import React from "react";
import ReactDOM from "react-dom/client";
import "./css/index.css";
import StudentCabinet from "./StudentCabinet";
import TutorCabinet from "./TutorCabinet";
import ErrorPage from "./ErrorPage";
import SignInForm from "./SignInForm";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import FullTutorCard from "./FullTutorCard";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="student" element={<StudentCabinet />} />
        <Route path="tutor" element={<TutorCabinet />} />
        <Route path="full" element={<FullTutorCard />} />
        <Route path="" element={<SignInForm />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
