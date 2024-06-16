const express = require("express");
const mongoose = require("mongoose");
const Tour = require("../models/Notes");

exports.handle_likes = async (req, res) => {
  try {
    const tour = await Tour.findOne({ _id: req.body.id });
    const updatedtour = await Tour.findOneAndUpdate(
      { _id: req.body.id },
      { likes: req.body.likes},
      { new: true }
    );

    const data = updatedtour.likes;
    res.status(200).json({
      status: "success",
      data,
    });
  } catch (e) {
    res.status(400).json({
      message: e.message,
      status: "failed",
    });
  }
};
