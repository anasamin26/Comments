const express = require("express");
const User = require("../../models/User");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

//Load input validation
const validateSignupInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
//Load user model

//creating api for registeration
router.post("/signup", (req, res) => {
  debugger;
  const { errors, isValid } = validateSignupInput(req.body);

  //checking if data entered is valid or not
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        dateofbirth: req.body.dateofbirth,
        password: req.body.password,
      });
      //hashing the password before storing it in the db
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          else {
            newUser.password = hash;
            newUser
              .save()
              .then((user) => res.json(user))
              .catch((err) =>
                console.log("Error Occured in Creating User:" + err)
              );
          }
        });
      });
    }
  });
});
//creating api for login
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(400).json({ emailnotfound: "User doest not exist" });
    }

    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        //create JsonWebToken payload
        const payload = {
          id: user.id,
          name: user.name,
        };
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926, //1 year in secs
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer" + token,
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password is incorrect" });
      }
    });
  });
});
module.exports = router;
