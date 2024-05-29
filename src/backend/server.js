const express = require("express");
const db = require("./db.js");

const PORT = process.env.PORT || 3010;
const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200); 
  }

  next();
});

app.use(express.json());

app.get("/subjects", async (req, res) => {
  res.send(await db.showSubjects());
});

app.post('/register', async (req, res) => {
if(await db.nicknameExists(req.body.nicknameValue)) {
    res.json({data: "Пользователь с таким ником уже существует!"});
    return;
  }
  if(await db.emailExists(req.body.emailValue)) {
    res.json({data: "Пользователь с такой почтой уже существует!"});
    return;
  }
  await db.addUser(req.body.nicknameValue, req.body.emailValue, req.body.passwordValue, req.body.role);
  res.json({data: "Регистрация прошла успешно!"});
});

app.listen(PORT, async () => {
  console.log(`Server listening on ${PORT}`);
});
