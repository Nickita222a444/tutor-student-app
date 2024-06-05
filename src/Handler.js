import { useEffect, useState } from "react";
import TutorCabinet from "./TutorCabinet";
import StudentCabinet from "./StudentCabinet";
import SignInForm from "./SignInForm";

// let isStudent;
// let nickname;
// let isAuthorized;

export default function Handler() {
  //const [s, ss] = useState(null);
  const [username, setUsername] = useState("");
  const [isStudent, setIsStudent] = useState("");
  const [isAuthorized, setIsAuthorized] = useState("no");
  const [refresh, setRefresh] = useState("");
  useEffect(() => {
    fetch("http://localhost:3010/getUsername", { method: "POST" })
      .then((res) => res.json())
      .then((res) => {
        setUsername(res.nickname);
        setIsAuthorized(res.isAuthorized);
        setIsStudent(res.isStudent);
        console.log(username);
      });
  }, []);
  return (
    <div>
      {/* {console.log(username)} */}
      {isAuthorized === "no" ? (
        <SignInForm />
      ) : isStudent === "student" ? (
        <StudentCabinet username={username} />
      ) : (
        <TutorCabinet username={username} />
      )}
    </div>
  );
}
