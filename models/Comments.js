// review /rating/ created at/ ref to user/ ref to notes/
// parent referencing comments is child parents are tours and users
const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
    },

    createdtAt: {
      type: Date,
      default: Date.now,
    },
    users: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "login",
      required: [true, "review can be given by a login person"],
    },
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "notes",
      required: [true, "review must belong to tour"],
    },
  },
  { strictPopulate: false },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "users",
  });
  next();
});


const Comments = mongoose.model("comments", commentSchema);
module.exports = Comments;
