const Tour = require("../models/Notes");
const book = require("../models/Bookings");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.sendbookings = async (req, res) => {
  try {
    console.log("2nd time..");

    const data = await book.findById(req.params.id);
    console.log("3rd time..");
    return res.status(200).json({
      status: "success",
      data,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getcheckout = async (req, res, next) => {
  // get the currently booked tour

  try {
    const tour = await Tour.findById(req.params.tourid);
    console.log("came here..");
    // create checkout session
    const clientSecret = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      client_reference_id: req.params.tourid,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: tour.title,
              images: [`https://notedb.onrender.com/Images/${tour.photo}`],
              description: tour.description.slice(0, 80),
            },
            unit_amount: 997 * 100, // amount in cents
          },
          quantity: 1, // You may adjust quantity if needed
        },
      ],
      mode: "payment", // Specify the mode: payment or subscription
      // customer_email: req.user.email,
      success_url: `${req.protocol}://localhost:${3000}/home?tour=${
        req.params.tourid
      }&user=${req.user.id}&price=${900}`,

      // not secure at all;
      cancel_url: `${req.protocol}://${req.get("host")}/tour/${
        req.params.tourid
      }`,
    });

    // create session as response;

    res.status(200).json({
      status: "success",
      clientSecret,
    });
  } catch (e) {
    console.log(e);
    res.status(400).send({
      status: "failed",
      message: e.message,
    });
  }
};

exports.createBookingCheckout = async (req, res, next) => {
  try {
    const { tour, user, price } = req.query;
    if (!tour || !user || !price) {
      return next();
    }
    await book.create({ tour, user, price });
    return next();
  } catch (e) {
    res.status(400).send({
      status: "failed",
      message: e.message,
    });
  }
};
