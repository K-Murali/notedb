const jwt = require("jsonwebtoken");
const JWT_SECRET = "myname is murali";

const fetchuser = (req, res, next) => {
  // Get the user from the JWT token and append it to the req object
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json({ error: "access denied" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    // console.log(req.user);
    next();
  } catch (error) {
    return res.status(401).json({ error: "access denied" });
  }
};

module.exports = fetchuser;
