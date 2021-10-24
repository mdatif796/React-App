require('dotenv').config();
const mongoose = require("mongoose");

const mongoURI =
`mongodb+srv://Admin-Atif:${process.env.PASSWORD}@cluster0.lymyd.mongodb.net/secret?retryWrites=true&w=majority`
const connectMongo = () => {
  mongoose.connect(mongoURI, () => {
    console.log("connected to mongo successfully.");
  });
};

module.exports = connectMongo;
