const mongoose = require("mongoose");
const { Schema } = mongoose;

const Notesschema = new Schema(
  {
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "login" }],
    likescount: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "login",
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      default: 750,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: "hyderabad",
    },
    tag: {
      type: String,
      default: "General",
    },
    photo: {
      type: String,
      default: "default.jpg",
    },
    para: {
      type: String,
    },
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

Notesschema.virtual("comments", {
  ref: "comments",
  foreignField: "tour",
  localField: "_id",
});



Notesschema.pre("save", function (next) {
  this.likescount = this.likes.length;
  next();
});

module.exports = mongoose.model("notes", Notesschema);
