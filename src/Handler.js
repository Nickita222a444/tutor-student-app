import { useEffect, useState } from "react";
import TutorCabinet from "./TutorCabinet";
import StudentCabinet from "./StudentCabinet";
import SignInForm from "./SignInForm";

export default function Handler() {
  const [username, setUsername] = useState("");
  const [isStudent, setIsStudent] = useState("");
  const [isAuthorized, setIsAuthorized] = useState("no");
  useEffect(() => {
    fetch("http://localhost:3010/getUsername", { method: "POST" })
      .then((res) => res.json())
      .then((res) => {
        setUsername(res.nickname);
        setIsStudent(res.isStudent);
        console.log(username);
        setIsAuthorized(res.isAuthorized);
      });
  }, []);
  return (
    <div>
      {isStudent === "" ? null : isAuthorized === "no" ? (
        <SignInForm />
      ) : isStudent === "student" ? (
        <StudentCabinet username={username} />
      ) : (
        <TutorCabinet username={username} />
      )}
    </div>
  );
}
