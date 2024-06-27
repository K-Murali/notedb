const express = require("express");
const cors = require("cors");
const connectToMongo = require("./db");
connectToMongo();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json({ limit: "100mb" }));
// app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(express.static("public"));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));
app.use("/api/comments", require("./routes/comments"));
app.use("/api/bookings", require("./routes/bookings"));

app.listen(PORT, () => {
  console.log(`Example app listening on port https://localhost:${PORT}`);
});
