import React from "react";
import ReactDOM from "react-dom/client";
import "./css/index.css";
import Handler from "./Handler";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    {/* <BrowserRouter>
      <Routes>
        <Route path="student" element={<StudentCabinet />} />
        <Route path="tutor" element={<TutorCabinet />} />
        <Route path="full" element={<FullTutorCard />} />
        <Route path="" element={<SignInForm />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter> */}
    <Handler />
  </React.StrictMode>
);
