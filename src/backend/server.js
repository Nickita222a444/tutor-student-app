const express = require("express");
const redis = require("redis");
const db = require("./db.js");

const PORT = process.env.PORT || 3010;
const app = express();

let client;
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

app.post("/register", async (req, res) => {
  if (
    !req.body.emailValue ||
    !req.body.nicknameValue ||
    !req.body.passwordValue
  ) {
    res.json({ data: "Нельзя оставлять поля пустыми!" });
    return;
  }
  if (await db.nicknameExists(req.body.nicknameValue)) {
    res.json({ data: "Пользователь с таким ником уже существует!" });
    return;
  }
  if (await db.emailExists(req.body.emailValue)) {
    res.json({ data: "Пользователь с такой почтой уже существует!" });
    return;
  }
  await db.addUser(
    req.body.nicknameValue,
    req.body.emailValue,
    req.body.passwordValue,
    req.body.role
  );
  res.json({ data: "Регистрация прошла успешно!" });
});

app.post("/sign-in", async (req, res) => {
  if (!(await db.checkUser(req.body.nicknameV, req.body.passwordV))) {
    res.json({ data: "Неверный логин или пароль!" });
    return;
  }
  res.json({
    data: "Добро пожаловать!",
    role: await db.isStudent(req.body.nicknameV),
    nickname: req.body.nicknameV,
  });

  await client.set("nickname", req.body.nicknameV);
  const role = await db.isStudent(req.body.nicknameV);

  if (role) await client.set("isStudent", "student");
  else await client.set("isStudent", "tutor");

  const d = await client.get("nickname");
  await client.set("isAuthorized", "yes");
});

app.post("/getUsername", async (req, res) => {
  const d = await client.get("nickname");
  const role = await client.get("isStudent");
  const isAuthorized = await client.get("isAuthorized");
  res.json({ nickname: d, isStudent: role, isAuthorized });
});

app.get("/l", async (req, res) => {
  console.log("ok");
  await client.set("isAuthorized", "no");
  const d = await client.get("isAuthorized");
  console.log(d);
  res.json({ data: "D" });
});

app.post("/get", async (req, res) => {
  const nick = await client.get("nickname");
  const likes = await db.studentsFavoritedTutor(nick);
  const resume = await db.showResume(nick);
  const isResumeExists = await db.isResumeExists(nick);
  let likesCount;
  if (likes === undefined) likesCount = 0;
  else likesCount = likes.length;
  res.json({
    likesCount,
    resume,
    isResumeExists,
  });
});

app.post("/saveResume", async (req, res) => {
  const nick = await client.get("nickname");
  if (!req.body.isResumeExists) return;
  if (!(await db.isResumeExists(nick))) {
    await db.fillResume(
      nick,
      req.body.name,
      new Date(
        `${new Date(req.body.birthDate).getFullYear()}-${new Date(
          req.body.birthDate
        ).getMonth()}-${new Date(req.body.birthDate).getDate()}`
      ),
      req.body.education,
      req.body.about,
      req.body.phoneNumber,
      req.body.email,
      req.body.specs.map((item) => {
        return item.value;
      })
    );
  } else {
    const oldResume = await db.showResume(nick);

    await db.updateResume(
      nick,
      req.body.name !== null ? req.body.name : oldResume.full_name,
      req.body.birthDate !== null
        ? new Date(
            `${new Date(req.body.birthDate).getFullYear()}-${new Date(
              req.body.birthDate
            ).getMonth()}-${new Date(req.body.birthDate).getDate()}`
          )
        : oldResume.birth_date,
      req.body.education !== null ? req.body.education : oldResume.education,
      req.body.about !== null ? req.body.about : oldResume.about,
      req.body.phoneNumber !== null
        ? req.body.phoneNumber
        : oldResume.phone_number,
      req.body.email !== null ? req.body.email : oldResume.work_email,
      req.body.specs.length !== 0
        ? req.body.specs.map((item) => {
            return item.value;
          })
        : oldResume.qualification
    );
  }

  res.json({ data: "Данные успешно сохранены!" });
});

app.post("/findInitialData", async (req, res) => {
  res.json({
    cards: await db.searchTutor(),
    subjects: await db.showSubjects(),
  });
});

app.post("/findTutors", async (req, res) => {
  res.json({
    data: await db.searchTutor(
      req.body.specs.map((item) => {
        return item.value;
      }),
      req.body.minAge,
      req.body.maxAge
    ),
  });
});

app.listen(PORT, async () => {
  console.log(`Server listening on ${PORT}`);

  client = redis.createClient();
  client.on("error", (error) => console.log("Что-то пошло не так", error));
  await client.connect();
  await client.set("isAuthorized", "no");
});
