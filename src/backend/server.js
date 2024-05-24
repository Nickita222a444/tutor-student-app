const express = require("express");
const db = require("./db.js");

const PORT = process.env.PORT || 3010;
const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/subjects", async (req, res) => {
  res.send(await db.showSubjects());
});

app.listen(PORT, async () => {
  console.log(`Server listening on ${PORT}`);
});
