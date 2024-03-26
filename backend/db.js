const MongoClient = require("mongodb").MongoClient;

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
        password,
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

  async checkUser(nickname, password) {
    try {
      await mongoClient.connect();
      const db = mongoClient.db("tutor_db");
      const user = db.collection("users");

      const extractData = await user.findOne({ nickname, password });

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

      console.log(curResumeId);

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

      return resume.findOne({ nickname });
    } catch (err) {
      console.log(err);
    } finally {
      await mongoClient.close();
    }
  }
}

const db = new Database();
Object.freeze(db);
