const mongoose = require("mongoose");
const { Schema } = mongoose;

const Notesschema = new Schema(
  {
    likes: [
      { type: mongoose.Schema.Types.ObjectId,
         ref: "login" }
        ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "login",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
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

module.exports = mongoose.model("notes", Notesschema);
