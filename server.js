const express = require("express");
const mongoose = require("mongoose");
var cors = require("cors");
const db = require("./config/keys").mongoURI;
require("./models/User");
//Connecting
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Connection Created Successfully"))
  .catch((err) => console.log("Following Error Occured" + err));

const bodyParser = require("body-parser");
const users = require("./routes/api/users");

const app = express();
app.use(cors());

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

//DB Configurations

//Passport middleware
const passport = require("passport");
require("./config/passport")(passport);
app.use(passport.initialize());

//Passport config

//Routes
app.use("/api/users", users);

const port = process.env.PORT || 5000;

app.listen(port, () =>
  console.log(`Server is started and running on port ${port}!`)
);
