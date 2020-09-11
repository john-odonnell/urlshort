// MAIN APPLICATION MODULE
// initializes express framework, listens for requests on a different port
// depending on local or hosted environment, initializes dbOps

// NPM PACKAGE IMPORTS
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
// local imports
const dbOps = require("./src/dbOps.js");
const router = require("./src/router.js");





// EXPRESS INIT
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/", router);





// SERVER: PORT 80 OR HEROKU PORT
const port = process.env.PORT || 80;
app.listen(port, () => {
  console.log("Server running.");
});
// DETERMINE URL PATH HEADER AS EITHER HOSTED DOMAIN OR LOCAL
let urlheader = "";
if (port == 80) {
  urlheader = "localhost:80/";
} else {
  urlheader = "https://jod.dev/";
}

// function to export url header
exports.getUrlHeader = function () {
  return urlheader;
}





// MONGODB INIT
dbOps.init(port);
