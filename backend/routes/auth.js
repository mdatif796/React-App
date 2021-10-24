const express = require("express");
require('dotenv').config();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const fetchUser = require("../middleware/fetchuser");

const JWT_SECRET = process.env.SECRET;
// Route-1:create a user using post:/api/auth/createuser
router.post(
  "/createuser",
  [
    //here we use express validator to make unique
    body("email", "invalid email").isEmail(),
    body("password", "password length should be min 5 characters").isLength({
      min: 5,
    }),
    body("name", "name length should be min 3 characters").isLength({ min: 3 }),
  ],
  //using async and await function to make promises
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //check that the user exist or not
    try {
      let user = await User.findOne({ email: req.body.email });
      //if the user is already present then sending the error
      if (user) {
        return res
          .status(400)
          .json({ errors: "Sorry a user with this email already exist" });
      }
      // Using bcrypt to generating salt and hashing it.
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      //create a user
      user = await User.create({
        email: req.body.email,
        password: secPass,
        name: req.body.name,
      });
      // .then((user) => res.json(user))
      // .catch((err) => {
      //   console.log(err);
      //   res.json({
      //     error: "please enter a unique email",
      //     message: err.message,
      //   });
      // });

      // Using jwt web token for auth.

      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authToken: authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

// Route-2:authenticate a user using post:/api/auth/login
router.post(
  "/login",
  [
    //here we use express validator to make unique
    body("email", "invalid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  //using async and await function to make promises
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res
          .status(400)
          .json({
            success,
            errors: "Please try to login with valid credentials",
          });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res
          .status(400)
          .json({
            success,
            error: "Please try to login with valid Credentials",
          });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

// Route-3: get login user details using post: /api/auth/getuser

router.post("/getuser", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
