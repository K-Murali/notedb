const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
    "<password>",
    process.env.DATABASE_PASSWORD
);
// console.log(process.env.USERNAME);

const connectToMongo = () => {
  mongoose.connect(DB, {}).then((con) => {
    console.log("DB connection successful");
  });
};
module.exports = connectToMongo;
