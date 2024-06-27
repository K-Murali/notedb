const User = require("../models/Login");

exports.savetour = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.userid);

    if (!user) {
      return res
        .status(404)
        .json({ status: "fail", message: "User not found" });
    }

    const tourId = req.body.tourid.toString();

    const isSaved = user.saved.some((e) => e._id.toString() == tourId);
    if(req.body.flag) {
      return res.status(200).json({
        status: "success",
        flag:isSaved,
        message: "Tour already saved",
      });
      next();
    }

    if (isSaved) {
      user.saved = user.saved.filter((e) => e._id.toString() !== tourId);
      await user.save();
      return res.status(200).json({
        status: "success",
        flag:false,
        message: "Tour removed from saved list",
      });
      next();
    }

    user.saved.push(tourId);
    await user.save();
    res.status(200).json({
      status: "success",
      flag:true,
      message: "Tour added to saved list",
    });
  } catch (e) {
    res.status(400).json({
      status: "fail",
      message: e.message,
    });
  }
};
