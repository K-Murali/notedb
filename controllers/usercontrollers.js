const mongoose = require("mongoose");
const User = require("../models/Login");

exports.savetour = async (req, res) => {
  try {
    const user = await User.findById(req.body.userid);
    const newuser = await User.findOneAndUpdate(
      { _id: req.body.userid },
      { saved: user.saved.concat(req.body.tourid) },
      { new: true }
    );
    res.status(200).json({ status: "success", newuser });
  } catch (e) {
    res.status(400).json({ status: "fail", message: e.message });
  }
};
