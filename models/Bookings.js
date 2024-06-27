const mongoose = require("mongoose");
const bookingschema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "notes",
      required: [true, "booking must belong to a tour"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "login",
      required: [true, "booking must belong to a user"],
    },
    price: {
      type: Number,
      required: [true, "booking must have a price"],
    },

    createdAt: {
      type: Date,
      default: Date.now(),
    },

    paid: {
      type: Boolean,
      default: true,
    },
  },
  { strictPopulate: false },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
bookingschema.pre(/^find/, function (next) {
  this.populate({
    path: "tour",
    select: "photo",
  });
  this.populate({
    path: "user",
  });
  next();
});
const Bookings = mongoose.model("bookings", bookingschema);
module.exports = Bookings;
