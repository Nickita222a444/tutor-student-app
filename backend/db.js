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
}

const db = new Database();
Object.freeze(db);

db.checkUser("1", "3");
