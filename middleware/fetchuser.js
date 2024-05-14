const jwt = require("jsonwebtoken");
const JWT_SECRET = "myname is murali";

const fetchuser = (req, res, next) => {
  // get the user from the jwt token and append if to the req object
  const token = req.header("auth-token");
  if (!token) {
    res.send(401).send({ error: "access denied" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.send(401).send({ error: "access denied" });
  }
};
module.exports = fetchuser;
