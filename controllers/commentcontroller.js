const mongoose = require("mongoose");
const comments = require("../models/Comments");

exports.getall_comments = async (req, res) => {
  try {
    const reviews = await comments.findById(req.body.id);
    res.status(200).json({
      status: "success",
      results: reviews.length,
      data: {
        reviews,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.create_comments = async (req, res) => {
  try {
    console.log("body" + req.body.data);
    let reviews = await comments.create(req.body);
    reviews = await reviews.populate("users");

    console.log(reviews);
    res.status(201).json({
      status: "success",
      data: {
        reviews,
      },
    });
  } catch (err) {
    // console.log(err)
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
