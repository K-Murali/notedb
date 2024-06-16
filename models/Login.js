const mongoose = require("mongoose");
const { Schema } = mongoose;

const Userschema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    saved: [{ type: mongoose.Schema.Types.ObjectId, ref: "notes" }],
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

Userschema.virtual("liked", {
  ref: "notes",
  foreignField: "likes",
  localField: "_id",
});

Userschema.virtual("tours", {
  ref: "notes",
  foreignField: "user",
  localField: "_id",
});

Userschema.pre(/^find/, function (next) {
  this.populate({
    path: "saved",
  });
  next();
});

const User = mongoose.model("login", Userschema);
module.exports = User;
