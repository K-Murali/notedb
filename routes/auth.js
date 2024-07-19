const express = require("express");
const router = express.Router();
const User = require("../models/Login");
const Notes = require("../models/Notes");
const fetchuser = require("../middleware/fetchuser");

const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const { savetour } = require("../controllers/usercontrollers");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "myname is murali";

//ROUTE 1 sing up a user :POST "api/auth/createuser"
router.post(
  "/createuser",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "password must be atleat 5 char").isLength({ min: 5 }),
    body("name", "Enter a valid name").isLength({ min: 3 }),
  ],
  async (req, res) => {
    let success = false;
    //if there are errors then return errors and bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    try {
      // checking for unique mail
      let name = req.body.name;
      let unqemail = await User.findOne({ email: req.body.email });
      if (unqemail) {
        return res
          .status(400)
          .json({ success, error: "Sorry a user with email exits !" });
      }
      // hassing password
      const salt = await bcrypt.genSalt(10);
      let secpass = await bcrypt.hash(req.body.password, salt);
      req.body.password = secpass;

      // creating user schema and inserting into database
      const user = await User(req.body);
      await user.save();

      // sending res of created user data

      const data = {
        user: { id: user.id, email: user.email },
      };
      success = true;
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json({ success, authtoken, data, name });
    } catch (err) {
      console.log(err.message);
      res.status(500).send("some error");
    }
  }
);

// ROUTE 2 authenticate a user: POST "api/auth/login" .
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "password canot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email }); //returns a single 1st document that matches this email
      if (!user) {
        return res.status(400).json({
          success,
          error: "User not found plaese register",
        });
      }
      let name = user.name;

      const passwordmatch = await bcrypt.compare(password, user.password);

      if (!user || !passwordmatch) {
        return res.status(400).json({
          success,
          error: "please try to login with correct credentials",
        });
      }
      const data = {
        user: { id: user.id, email: user.email },
      };
      const photo = user.photo;
      // shoukd not change this one!!! above
      success = true;
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json({ success, authtoken, name, data, photo });
    } catch (err) {
      console.log(err.message);
      res.status(500).send("some error in the server!!");
    }
  }
);

// ROUTE 3 getloggedin user Details :POST "/api/auth/getuser" .login required

router.get("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId)
      .select("-password")
      .populate({
        path: "tours",
        select: "_id photo",
      })
      .populate({
        path: "liked",
        select: "_id photo",
      })
      .populate({
        path: "bookings",
        select: "tour -user",
      });

    res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("some error in the server");
  }
});
router.get("/bookings", fetchuser, async (req, res) => {
  try {
    const userid = req.user.id;
    const user = await User.findById(userid)
      .select("bookings -saved")
      .populate({
        path: "bookings",
        select: "tour -user",
      });
    const booked = user.bookings.map((e) => e.tour._id);

    console.log(booked);
    res.json(booked);
  } catch (e) {
    res.status(400).json({
      status: "fail",
      message: e.message,
    });
  }
});
router.patch("/updateuser", fetchuser, async (req, res) => {
  try {
    const userid = req.user.id;

    if (req.body.name == "" && req.body.email == "" && req.body.photo == "") {
      res.status(200).json({
        status: "fail",
        message: "please make changes in the fileds",
      });
    }
    const curruser = await User.findById(userid);

    if (!curruser) {
      return res.status(404).json({ msg: "User not found" });
    }
    if (req.body.name != "") {
      curruser.name = req.body.name;
    }
    if (req.body.photo != "") {
      curruser.photo = req.body.photo;
    }
    if (req.body.email == "") {
      curruser.save();
      return res.status(200).json({ msg: "Name updated !!" });
    }

    if (req.body.email === curruser.email) {
      await curruser.save();
      return res.status(200).json({ msg: "Changes updated !!" });
    }

    const newuser = await User.find({ email: req.body.email });

    if (newuser.length > 0) {
      return res.status(409).json({ msg: "User with email already exists !!" });
    }

    curruser.email = req.body.email;
    await curruser.save();
    return res.status(200).json({ msg: "Changes updated !!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ msg: "Some error occurred on the server" });
  }
});

router.patch("/save", fetchuser, savetour);
module.exports = router;
