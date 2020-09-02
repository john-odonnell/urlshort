// NPM PACKAGE IMPORTS
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const base62 = require("base62/lib/ascii");





// EXPRESS INIT
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static("public"));





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
  urlheader = "https://www.johnodonnell.dev/";
}





// MONGODB INIT
// connect to local mongo db
if (port == 80) {
  mongoose.connect('mongodb://mongo/urlshrt',
  {useNewUrlParser: true, useUnifiedTopology: true});
} else {
  mongoose.connect('mongodb+srv://user:mjQ9XUU93GVHQzD5@cluster0.1pvti.mongodb.net/urlshrt?retryWrites=true&w=majority',
  // mongoose.connect('mongodb://localhost:27017/urls',
  {useNewUrlParser: true, useUnifiedTopology: true});
}
// create document schema
const urlSchema = new mongoose.Schema({
  idx: {
    type: Number,
    required: [true, "ID Required."]
  },
  longurl: {
    type: String,
    required: [true, "Destination URL required."]
  },
  shorturl: {
    type: String,
    required: [true, "Short URL required."]
  }
});
// create db model based off document schema
const Url = mongoose.model("Url", urlSchema);






// WEBAPP ROUTES
// GET: ROOT
app.get("/", (req, res) => {
  // displays results if redirected from post route
  res.render(__dirname + "/views/index.ejs", {longurl: null, shorturl: null});
});
// POST: LONG URL FROM ROOT
app.post("/", (req, res) => {
  Url.findOne({longurl: req.body.longurl}, 'idx longurl shorturl',(err, doc) => {
    if (err) {
      console.log(err);
    }

    // if the url has already been shortened, return its short url
    // otherwise, create new short url, insert into db and render index page with parameters
    let long = ""
    if (req.body.longurl.match(/^http*/)) {
      long = req.body.longurl;
    } else {
      long = "https://" + req.body.longurl;
    }

    if (doc) {
      res.render(__dirname + "/views/index.ejs", {longurl: req.body.longurl, shorturl: doc.shorturl});
    } else {
      Url.countDocuments({}, (err, count) => {
        let idx = count + 1;
        // let idx = nextAvailableIdx
        let shorturl = urlheader + base62.encode(idx);
        let newLong = new Url({
          idx: idx,
          longurl: long,
          shorturl: shorturl
        });
        newLong.save();

        res.render(__dirname + "/views/index.ejs", {longurl: req.body.longurl, shorturl: shorturl});
      });
    }
  });
});





// API ROUTES
// GET: IDX SHORTENED URL
app.get("/shrt/all", (req, res) => {
  // returns an array contianing all db entries
  Url.find({}, 'idx longurl shorturl', (err, docs) => {
    if (err) {
      console.log(err);
    } else {
      res.json(docs);
    }
  })
})
app.get("/shrt/:idx", (req, res) => {
  // returns the db entry at a particular idx
  // includes idx, long url and short url
  Url.findOne({idx: req.params.idx}, 'idx longurl shorturl',(err, doc) => {
    if (err) {
      console.log(err);
    }
    if (doc) {
      res.json(doc);
    } else {
      res.send("John's URL Shortener: Invalid URL");
    }
  })
});
// POST: URL FROM API REQ BODY
app.post("/shrt", (req, res) => {
  // for use in the command line
  // usage:
  // curl -X POST -H "Content-Type: application/json" -d '{"longurl":"<insert_url>"}' localhost:80/shrt
  // returns:
  // JSON containing db idx, long url and short url

  Url.findOne({longurl: req.body.longurl}, 'idx longurl shorturl',(err, doc) => {
    if (err) {
      console.log(err);
    }

    // if the url has already been shortened, return its short url
    // otherwise, create new short url, insert into db and render index page with parameters
    if (doc) {
      res.json(doc);
    } else {
      Url.countDocuments({}, (err, count) => {
        let idx = count + 1;
        // let idx = nextAvailableIdx
        let shorturl = urlheader + base62.encode(idx);
        let newLong = new Url({
          idx: idx,
          longurl: req.body.longurl,
          shorturl: shorturl
        });
        newLong.save();

        res.json(newLong);
      });
    }
  });
});






// REDIRECT SHORT URLS TO DESTINATIONS
// GET: USE SHORTENED URL
app.get("/:path", (req, res) => {
  // paths correspond to the bse 62 notation of the url's idx in the db
  // either redirects to the original site, or provides and message of invalid url
  let idx = base62.decode(req.params.path);
  Url.findOne({idx: idx}, (err, doc) => {
    if (err) {
      console.log(err);
    }
    if (doc) {
      res.redirect(doc.longurl);
    } else {
      res.send("John's URL Shortener: Invalid URL");
    }
  });
});
