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
}

const db = new Database();
Object.freeze(db);
