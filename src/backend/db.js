const MongoClient = require("mongodb").MongoClient;
const bcrypt = require("bcrypt");

const mongoClient = new MongoClient("mongodb://admin:admin@127.0.0.1:27017");

class Database {
  static #instance = null;

  constructor() {
    if (!Database.#instance) {
      Database.#instance = this;
    } else return Database.#instance;
  }

  async addUser(nickname, email, password, role) {
    try {
      await mongoClient.connect();
      const db = mongoClient.db("tutor_db");
      const user = db.collection("users");

      const temp = {
        nickname,
        email,
        password: await bcrypt.hash(password, 10),
        role,
      };

      if (role === "student") temp["favorite"] = [];

      await user.insertOne(temp);
    } catch (err) {
      console.log(err);
    } finally {
      await mongoClient.close();
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
    } finally {
      await mongoClient.close();
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
    } finally {
      await mongoClient.close();
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
    } finally {
      await mongoClient.close();
    }
  }

  async checkUser(nickname, password) {
    try {
      await mongoClient.connect();
      const db = mongoClient.db("tutor_db");
      const user = db.collection("users");

      const extractedData = await user.findOne({ nickname });
      return await bcrypt.compare(password, extractedData["password"]);
    } catch (err) {
      console.log(err);
    } finally {
      await mongoClient.close();
    }
  }

  async isStudent(email) {
    try {
      await mongoClient.connect();
      const db = mongoClient.db("tutor_db");
      const user = db.collection("users");

      // Существование запрашиваемого пользвателя не проверяем, поскольку на сервере
      // данная функция будет выполняться уже после функции checkUser()
      const checkingUser = await user.findOne({ email });
      if (checkingUser["role"] === "student") return true;
      return false;
    } catch (err) {
      console.log(err);
    } finally {
      await mongoClient.close();
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
    } finally {
      await mongoClient.close();
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
    } finally {
      await mongoClient.close();
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

      await resume.findOneAndUpdate(
        { nickname },
        {
          full_name,
          birth_date,
          education,
          about,
          phone_number,
          work_email,
          qualification,
        }
      );
    } catch (err) {
      console.log(err);
    } finally {
      await mongoClient.close();
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
    } finally {
      await mongoClient.close();
    }
  }

  async addFeedback(nickname, resume_id, date, text) {
    try {
      await mongoClient.connect();
      const db = mongoClient.db("tutor_db");
      const resume = db.collection("resume");

      await resume.findOneAndUpdate(
        { resume_id },
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
    } finally {
      await mongoClient.close();
    }
  }

  async updateFeedback(nickname, resume_id, text) {
    try {
      await mongoClient.connect();
      const db = mongoClient.db("tutor_db");
      const resume = db.collection("resume");

      await resume.findOneAndUpdate(
        { resume_id },
        { $set: { "feedback.$[elem].text": text } },
        { arrayFilters: [{ "elem.author_name": nickname }] }
      );
    } catch (err) {
      console.log(err);
    } finally {
      await mongoClient.close();
    }
  }

  async isFeedbackExists(nickname, resume_id) {
    try {
      await mongoClient.connect();
      const db = mongoClient.db("tutor_db");
      const resume = db.collection("resume");

      if (
        (await resume.findOne({
          resume_id,
          feedback: { $elemMatch: { author_name: nickname } },
        })) === null
      )
        return false;
      return true;
    } catch (err) {
      console.log(err);
    } finally {
      await mongoClient.close();
    }
  }

  async addToFavorite(nickname, resume_id) {
    try {
      await mongoClient.connect();
      const db = mongoClient.db("tutor_db");
      const user = db.collection("users");

      await user.findOneAndUpdate(
        { nickname },
        { $push: { favorite: resume_id } }
      );
    } catch (err) {
      console.log(err);
    } finally {
      await mongoClient.close();
    }
  }

  async deleteFavorite(nickname, resume_id) {
    try {
      await mongoClient.connect();
      const db = mongoClient.db("tutor_db");
      const user = db.collection("users");

      await user.findOneAndUpdate(
        { nickname },
        { $pull: { favorite: resume_id } }
      );
    } catch (err) {
      console.log(err);
    } finally {
      await mongoClient.close();
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
    } finally {
      await mongoClient.close();
    }
  }

  async searchTutor(specialization, minAge, maxAge) {
    try {
      await mongoClient.connect();
      const db = mongoClient.db("tutor_db");
      const resume = db.collection("resume");

      return await resume
        .aggregate([
          {
            $project: {
              _id: 0,
              resume_id: 1,
              nickname: 1,
              full_name: 1,
              birth_date: 1,
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
    } finally {
      await mongoClient.close();
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
    } finally {
      await mongoClient.close();
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
    } finally {
      await mongoClient.close();
    }
  }

  // все студенты, которые добавили этого преподавателя в избранное
  async studentsFavoritedTutor(resume_id) {
    try {
      await mongoClient.connect();
      const db = mongoClient.db("tutor_db");
      const user = db.collection("users");

      const f = await user.find({ role: "student" }).toArray();

      return f.reduce((students, item) => {
        if (item["favorite"].includes(resume_id))
          students.push(item["nickname"]);
        return students;
      }, []);
    } catch (err) {
      console.log(err);
    } finally {
      await mongoClient.close();
    }
  }
}

const db = new Database();
Object.freeze(db);
//db.tutorsFeedbackedByStudent("Ludvick").then((el) => console.log(el));
// db.showSubjects().then((el) => console.log(el));
module.exports = db;
