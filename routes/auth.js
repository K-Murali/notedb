const express = require("express");
const router = express.Router();
const User = require("../models/Login");
const fetchuser = require("../middleware/fetchuser");

const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

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
    let success=false;
    //if there are errors then return errors and bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success,errors: errors.array() });
    }

    try {
      // checking for unique mail
      let unqemail = await User.findOne({ email: req.body.email });
      if (unqemail) {
        return res
          .status(400)
          .json({success, error: "Sorry a user with email exits !" });
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
        user: { id: user.id },
      };
      success=true;
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json({success, authtoken });
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
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      
      return res.status(400).json({ success,errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email }); //returns a single 1st document that matches this email

      const passwordmatch = await bcrypt.compare(password, user.password);

      if (!user || !passwordmatch) {
       
        return res.status(400).json({ success,error: "please try to login with correct credentials" });
      }
      const data = {
        user: { id: user.id },
      };
      success=true;
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json({ success,authtoken });
    } catch (err) {
      console.log(err.message);
      res.status(500).send("some error in the server");
    }
  }
);

// ROUTE 3 getloggedin user Details :POST "/api/auth/getuser" .login required

router.post("/getuser", fetchuser, async (req, res) => {
  try {
     userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("some error in the server");
  }
});
module.exports = router;
