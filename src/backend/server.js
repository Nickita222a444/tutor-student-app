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

  await client.set("isAuthorized", "yes");
});

app.post("/getUsername", async (req, res) => {
  const d = await client.get("nickname");
  const role = await client.get("isStudent");
  const isAuthorized = await client.get("isAuthorized");
  res.json({ nickname: d, isStudent: role, isAuthorized });
});

app.post("/get", async (req, res) => {
  const nick = await client.get("nickname");
  const likes = await db.studentsFavoritedTutor(nick);
  const resume = await db.showResume(nick);
  const isResumeExists = await db.isResumeExists(nick);
  let likesCount;
  if (likes === undefined) likesCount = 0;
  else likesCount = likes.length;

  for (let i in await resume["qualification"])
    resume["qualification"][i] = {
      label: await db.getSubjectName(resume["qualification"][i]),
      value: resume["qualification"][i],
    };

  res.json({
    likesCount,
    resume,
    isResumeExists,
    subjects: await db.showSubjects(),
  });
});

app.post("/getFullTutorCard", async (req, res) => {
  const nick = req.body.name;
  const likes = await db.studentsFavoritedTutor(nick);
  const resume = await db.showResume(nick);
  const isResumeExists = await db.isResumeExists(nick);
  const stud_nick = await client.get("nickname");
  let tutors;
  if ((await db.tutorsFavoritedByStudent(stud_nick)) !== undefined)
    tutors = Object.values(await db.tutorsFavoritedByStudent(stud_nick));
  else tutors = [];

  let clicked = false;
  for (let i in tutors) {
    if (tutors[i]["nickname"] === nick) {
      clicked = true;
      break;
    }
  }

  let likesCount;
  if (likes === undefined) likesCount = 0;
  else likesCount = likes.length;

  for (let i = 0; i < resume["qualification"].length; ++i)
    if (
      i == resume["qualification"].length - 1 ||
      resume["qualification"].length === 1
    )
      resume["qualification"][i] = await db.getSubjectName(
        resume["qualification"][i]
      );
    else
      resume["qualification"][i] = `${await db.getSubjectName(
        resume["qualification"][i]
      )}, `;

  res.json({
    likesCount,
    resume,
    isResumeExists,
    clicked,
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
        `${new Date(req.body.birthDate).getFullYear()}-${
          new Date(req.body.birthDate).getMonth() + 1
        }-${new Date(req.body.birthDate).getDate() + 1}`
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
            `${new Date(req.body.birthDate).getFullYear()}-${
              new Date(req.body.birthDate).getMonth() + 1
            }-${new Date(req.body.birthDate).getDate() + 1}`
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
  let cards;
  if (req.body.searchMode === "all") {
    cards = await db.searchTutor(null, null, null, "all", null);
  } else {
    cards = await db.tutorsFavoritedByStudent(await client.get("nickname"));
  }
  let subjects = await db.showSubjects();

  for (let tutor in cards) {
    for (let i in cards[tutor]["qualification"])
      cards[tutor]["qualification"][i] = await db.getSubjectName(
        cards[tutor]["qualification"][i]
      );
  }
  res.json({ cards, subjects });
});

app.post("/findTutors", async (req, res) => {
  if (req.body.minAge > req.body.maxAge || req.body.minAge < 0) {
    res.json({ data: "Некорректный возраст" });
    return;
  }
  if (req.body.specs.length === 0) {
    res.json({ data: "Пожалуйста, заполните специализацию" });
    return;
  }

  let data;
  if (req.body.searchMode === "all")
    data = await db.searchTutor(
      req.body.specs.map((item) => {
        return item.value;
      }),
      req.body.minAge,
      req.body.maxAge
    );
  else
    data = await db.searchTutor(
      req.body.specs.map((item) => {
        return item.value;
      }),
      req.body.minAge,
      req.body.maxAge,
      req.body.searchMode,
      await client.get("nickname")
    );
  for (let tutor in data) {
    for (let i in data[tutor]["qualification"])
      data[tutor]["qualification"][i] = await db.getSubjectName(
        data[tutor]["qualification"][i]
      );
  }
  res.json({ data });
});

app.post("/changeFav", async (req, res) => {
  const stud_nick = await client.get("nickname");
  const tutor_nick = req.body.tutor_nick;

  let tutors;
  if ((await db.tutorsFavoritedByStudent(stud_nick)) !== undefined)
    tutors = Object.values(await db.tutorsFavoritedByStudent(stud_nick));
  else tutors = [];

  let isInFav = false;
  for (let i in tutors) {
    if (tutors[i]["nickname"] === tutor_nick) {
      isInFav = true;
      break;
    }
  }

  if (req.body.clicked)
    if (isInFav) return;
    else await db.addToFavorite(stud_nick, tutor_nick);
  else await db.deleteFavorite(stud_nick, tutor_nick);
});

app.post("/sendComment", async (req, res) => {
  const nick = await client.get("nickname");
  if (req.body.text !== null)
    if (!(await db.isFeedbackExists(nick, req.body.tutor)))
      await db.addFeedback(nick, req.body.tutor, req.body.date, req.body.text);
    else await db.updateFeedback(nick, req.body.tutor, req.body.text);
});

app.post("/log-out", async (req, res) => {
  await client.del("nickname", (err, response) => {
    if (err) throw err;
    console.log(response);
  });
  await client.set("isAuthorized", "no");
});

app.listen(PORT, async () => {
  console.log(`Server listening on ${PORT}`);

  client = redis.createClient();
  client.on("error", (error) => console.log("Что-то пошло не так", error));
  await client.connect();
  await client.set("isAuthorized", "no");
});
