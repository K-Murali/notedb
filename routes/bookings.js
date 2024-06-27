const express = require("express");
const router = express.Router();
const {
  getcheckout,
  sendbookings,
} = require("../controllers/bookingscontroller");
const fetchuser = require("../middleware/fetchuser");

router.route("/checkout-session/:tourid").get(fetchuser, getcheckout);
router.route("/getbookings/:id").get(fetchuser, sendbookings);

module.exports = router;
