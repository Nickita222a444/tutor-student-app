const MongoClient = require("mongodb").MongoClient;
const bcrypt = require("bcrypt");

const mongoClient = new MongoClient("mongodb://admin:admin@127.0.0.1:27017");
mongoClient.connect();

class Database {
  static #instance = null;

  constructor() {
    if (!Database.#instance) {
      Database.#instance = this;
    } else return Database.#instance;
  }

  async addUser(nickname, email, password, role, token) {
    try {
      await mongoClient.connect();
      const db = mongoClient.db("tutor_db");
      const user = db.collection("users");

      const temp = {
        nickname,
        email,
        password: await bcrypt.hash(password, 10),
        role,
        status: false,
        token,
      };

      if (role === "student") temp["favorite"] = [];

      await user.insertOne(temp);
    } catch (err) {
      console.log(err);
    }
  }

  async isConfirmed(nickname) {
    try {
      const db = mongoClient.db("tutor_db");
      const user = db.collection("users");

      const data = await user.findOne({ nickname });

      return data["status"];
    } catch {
      console.log(err);
    }
  }

  async userExists(nickname) {
    try {
      await mongoClient.connect();
      const db = mongoClient.db("tutor_db");
      const user = db.collection("users");

      const extractData = await user.findOne({ nickname });

      if (extractData === null) {
        return false;
      }
      return true;
    } catch (err) {
      console.log(err);
    }
  }

  async emailExists(email) {
    try {
      await mongoClient.connect();
      const db = mongoClient.db("tutor_db");
      const user = db.collection("users");

      const extractData = await user.findOne({ email });

      if (extractData === null) {
        return false;
      }
      return true;
    } catch (err) {
      console.log(err);
    }
  }

  async nicknameExists(nickname) {
    try {
      await mongoClient.connect();
      const db = mongoClient.db("tutor_db");
      const user = db.collection("users");

      const extractData = await user.findOne({ nickname });

      if (extractData === null) {
        return false;
      }
      return true;
    } catch (err) {
      console.log(err);
    }
  }

  async checkUser(nickname, password) {
    try {
      await mongoClient.connect();
      const db = mongoClient.db("tutor_db");
      const user = db.collection("users");

      const extractedData = await user.findOne({ nickname });

      if (extractedData === null) {
        return false;
      }

      return await bcrypt.compare(password, extractedData["password"]);
    } catch (err) {
      console.log(err);
    }
  }

  async isStudent(nickname) {
    try {
      await mongoClient.connect();
      const db = mongoClient.db("tutor_db");
      const user = db.collection("users");

      // Существование запрашиваемого пользвателя не проверяем, поскольку на сервере
      // данная функция будет выполняться уже после функции checkUser()
      const checkingUser = await user.findOne({ nickname });
      if (checkingUser === null) return null;

      if (checkingUser["role"] === "student") return true;
      return false;
    } catch (err) {
      console.log(err);
    }
  }

  async isResumeExists(nickname) {
    try {
      await mongoClient.connect();
      const db = mongoClient.db("tutor_db");
      const resume = db.collection("resume");

      if ((await resume.findOne({ nickname })) === null) return false;
      return true;
    } catch (err) {
      console.log(err);
    }
  }

  async fillResume(
    nickname,
    full_name,
    birth_date,
    education,
    about,
    phone_number,
    work_email,
    qualification
  ) {
    try {
      await mongoClient.connect();
      const db = mongoClient.db("tutor_db");
      const resume = db.collection("resume");

      const maxResumeDoc = await resume
        .find()
        .sort({ resume_id: -1 })
        .limit(1)
        .toArray();

      let curResumeId;
      if (maxResumeDoc.length === 0) {
        curResumeId = 1;
      } else curResumeId = maxResumeDoc[0]["resume_id"] + 1;

      await resume.insertOne({
        resume_id: curResumeId,
        nickname,
        full_name,
        birth_date,
        education,
        about,
        phone_number,
        work_email,
        qualification,
      });
    } catch (err) {
      console.log(err);
    }
  }

  async updateResume(
    nickname,
    full_name,
    birth_date,
    education,
    about,
    phone_number,
    work_email,
    qualification
  ) {
    try {
      await mongoClient.connect();
      const db = mongoClient.db("tutor_db");
      const resume = db.collection("resume");

      await resume.updateOne(
        { nickname },
        {
          $set: {
            full_name,
            birth_date,
            education,
            about,
            phone_number,
            work_email,
            qualification,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  async showResume(nickname) {
    try {
      if ((await this.isResumeExists(nickname)) === false) return false;

      await mongoClient.connect();
      const db = mongoClient.db("tutor_db");
      const resume = db.collection("resume");

      return await resume.findOne({ nickname });
    } catch (err) {
      console.log(err);
    }
  }

  async addFeedback(nickname, tutor_nick, date, text) {
    try {
      await mongoClient.connect();
      const db = mongoClient.db("tutor_db");
      const resume = db.collection("resume");

      await resume.findOneAndUpdate(
        { nickname: tutor_nick },
        {
          $push: {
            feedback: {
              author_name: nickname,
              date,
              text,
            },
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  async updateFeedback(nickname, tutor_nick, text) {
    try {
      await mongoClient.connect();
      const db = mongoClient.db("tutor_db");
      const resume = db.collection("resume");

      await resume.findOneAndUpdate(
        { nickname: tutor_nick },
        { $set: { "feedback.$[elem].text": text } },
        { arrayFilters: [{ "elem.author_name": nickname }] }
      );
    } catch (err) {
      console.log(err);
    }
  }

  async isFeedbackExists(nickname, tutor_nick) {
    try {
      await mongoClient.connect();
      const db = mongoClient.db("tutor_db");
      const resume = db.collection("resume");

      if (
        (await resume.findOne({
          nickname: tutor_nick,
          feedback: { $elemMatch: { author_name: nickname } },
        })) === null
      )
        return false;
      return true;
    } catch (err) {
      console.log(err);
    }
  }

  async addToFavorite(nickname, tutor_nickname) {
    try {
      await mongoClient.connect();
      const db = mongoClient.db("tutor_db");
      const user = db.collection("users");

      await user.findOneAndUpdate(
        { nickname },
        { $push: { favorite: tutor_nickname } }
      );
    } catch (err) {
      console.log(err);
    }
  }

  async deleteFavorite(nickname, tutor_nickname) {
    try {
      await mongoClient.connect();
      const db = mongoClient.db("tutor_db");
      const user = db.collection("users");

      await user.findOneAndUpdate(
        { nickname },
        { $pull: { favorite: tutor_nickname } }
      );
    } catch (err) {
      console.log(err);
    }
  }

  async showSubjects() {
    try {
      await mongoClient.connect();
      const db = mongoClient.db("tutor_db");
      const subject = db.collection("subject");

      return await subject.find().toArray();
    } catch (err) {
      console.log(err);
    }
  }

  async searchTutor(
    specialization = null,
    minAge = null,
    maxAge = null,
    searchMode = "all",
    nickname = null
  ) {
    try {
      await mongoClient.connect();
      const db = mongoClient.db("tutor_db");
      let col;
      if (searchMode == "all") col = db.collection("resume");
      else col = await this.tutorsFavoritedByStudent(nickname);
      if (specialization === null && minAge === null && maxAge === null) {
        return await col.find().toArray();
      }
      if (minAge === null) minAge = 0;
      if (maxAge === null) maxAge = 99999;
      if (searchMode === "fav") {
        let tutors = [];
        for (let item in col) {
          if (
            specialization.every((elem) =>
              Object.values(col[item]["qualification"]).includes(elem)
            ) &&
            (new Date() - new Date(col[item]["birth_date"])) /
              (1000 * 60 * 60 * 24 * 365) >=
              minAge &&
            (new Date() - new Date(col[item]["birth_date"])) /
              (1000 * 60 * 60 * 24 * 365) <=
              maxAge
          )
            tutors.push(col[item]);
        }
        return tutors;
      }
      return await col
        .aggregate([
          {
            $project: {
              _id: 0,
              resume_id: 1,
              nickname: 1,
              full_name: 1,
              birth_date: "$birth_date",
              education: 1,
              about: 1,
              phone_number: 1,
              work_email: 1,
              qualification: 1,
              age: {
                $toInt: {
                  $divide: [
                    { $subtract: [new Date(), "$birth_date"] },
                    1000 * 60 * 60 * 24 * 365,
                  ],
                },
              },
            },
          },
          {
            $match: {
              qualification: { $all: specialization },
              age: { $gte: minAge, $lte: maxAge },
            },
          },
        ])
        .toArray();
    } catch (err) {
      console.log(err);
    }
  }

  // все студенты, оставившие отзыв на данного преподавателя
  async studentsFeedbackedTutor(resume_id) {
    try {
      await mongoClient.connect();
      const db = mongoClient.db("tutor_db");
      const resume = db.collection("resume");

      const f = await resume.findOne({ resume_id });

      return f["feedback"].reduce((students, item) => {
        students.push(item["author_name"]);
        return students;
      }, []);
    } catch (err) {
      console.log(err);
    }
  }

  // все преподаватели, на которых оставил отзыв студент
  async tutorsFeedbackedByStudent(student) {
    try {
      await mongoClient.connect();
      const db = mongoClient.db("tutor_db");
      const resume = db.collection("resume");

      const f = await resume
        .find({
          feedback: { $elemMatch: { author_name: student } },
        })
        .toArray();

      return f.reduce((tutors, item) => {
        tutors.push(item["full_name"]);
        return tutors;
      }, []);
    } catch (err) {
      console.log(err);
    }
  }

  // все студенты, которые добавили этого преподавателя в избранное
  async studentsFavoritedTutor(nickname) {
    try {
      await mongoClient.connect();
      const db = mongoClient.db("tutor_db");
      const user = db.collection("users");

      const f = await user.find({ role: "student" }).toArray();

      return f.reduce((students, item) => {
        if (item["favorite"].includes(nickname))
          students.push(item["nickname"]);
        return students;
      }, []);
    } catch (err) {
      console.log(err);
    }
  }

  async tutorsFavoritedByStudent(student) {
    try {
      await mongoClient.connect();
      const db = mongoClient.db("tutor_db");
      const resume = db.collection("resume");
      const users = db.collection("users");

      const stud = await users.findOne({ nickname: student });
      //console.log(`Мы: ${fav_tutors}`);
      let tutors = [];
      for (let i in stud["favorite"]) {
        tutors.push(await this.showResume(stud["favorite"][i]));
      }

      return tutors;
    } catch (err) {
      console.log(err);
    }
  }
  async getSubjectName(subject_id) {
    try {
      await mongoClient.connect();
      const db = mongoClient.db("tutor_db");
      const subject = db.collection("subject");

      const data = await subject.findOne({ subject_id });
      return data["subject_name"];
    } catch (err) {
      console.log(err);
    }
  }
  async compareToken(nickname, token) {
    try {
      const db = mongoClient.db("tutor_db");
      const user = db.collection("users");

      const data = await user.findOne({ nickname });

      if (data["token"] == token) return true;
      return false;
    } catch (err) {
      console.log(err);
    }
  }

  async setConfirmed(nickname) {
    try {
      const db = mongoClient.db("tutor_db");
      const user = db.collection("users");

      await user.updateOne({ nickname }, { $set: { status: true } });
    } catch (err) {
      console.log(err);
    }
  }
}

const db = new Database();
Object.freeze(db);
module.exports = db;
