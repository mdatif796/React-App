require('dotenv').config();
var jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.SECRET;

const fetchUser = (req, res, next) => {
  // get the user from jwt token and id to req object
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "please authenticate with valid token" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "please authenticate with valid token" });
  }
};

module.exports = fetchUser;
