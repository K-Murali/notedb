const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const {
  getall_comments,
  create_comments,
} = require("../controllers/commentcontroller");

const protect=require("../middleware/fetchuser");
router.route("/get").get(getall_comments).post(
    protect,
    create_comments);
module.exports = router;
