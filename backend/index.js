const connectMongo = require("./db");
const express = require("express");
var cors = require("cors");
connectMongo();

const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());
//Available routes
app.use("/api/auth/", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log(`SECRET app listening at http://localhost:${port}`);
});
