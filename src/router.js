// HTTP REQUEST ROUTING MODULE
// handles incoming https requests by using dbOps module to populate responses
//
// GET  /           :: browser req to root, renders ejs template
// POST /           :: main shortener logic, takes url and returns dc doc as json
// GET  /shrt/all   :: returns json of all db content
// GET  /shrt/:idx  :: returns single doc of given idx (base 10)
// GET  /:idx       :: redirects user to the long url associated with the given idx (base 62)

// NPM PACKAGE IMPORTS
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const base62 = require("base62");
const validator = require("validator");
// LOCAL IMPORTS
const app = require("./../app.js");
const dbOps = require("./dbOps.js");

// establissh express router
let router = express.Router();





// WEBAPP ROUTES
// GET: ROOT
router.get("/", (req, res) => {
  // displays results if redirected from post route
  res.render("./../views/index.ejs", {
    longurl: null,
    shorturl: null,
    badurl: false
  });
});

// POST: ROOT
router.post("/", async (req, res) => {
  // local vairables
  let Url = dbOps.getModel();
  let urlHeader = app.getUrlHeader();
  let input = req.body.inputurl;
  let button = req.body.button;
  // post route for getting shortened url
  // used from root in browser or in the command line
  // cli usage:
  // curl -X POST -H "Content-Type: application/json" -d '{"longurl":"<insert_url>"}' localhost:80/shrt
  // returns:
  // JSON containing db idx, long url and short url

  // if the url is valid, either find it in the db or insert it into the db
  // otherwise return error
  // validator does not require scheme, so add scheme afterwards to keep validation pure
  if (validator.isURL(input)) {
    // check if the url contains a scheme and add https if it doesn't
    let long = ""
    if (input.match(/^https:\/\/*/) || input.match(/^http:\/\/*/) || input.match(/^ftp:\/\/*/)) {
      long = input;
    } else {
      long = "https://" + input;
    }

    // await response from dbOps module
    // result is either an existing document or new document
    let result = await dbOps.insertUrl(long, urlHeader);

    // render based on webpage input or return json
    if (button != null) {
      res.render("./../views/index.ejs", {
        longurl: input,
        shorturl: result.shorturl,
        badurl: false
      });
    } else {
      res.json(result);
    }

  } else {
    // render for webpage input or return json
    if (button != null) {
      res.render("./../views/index.ejs", {
        longurl: input,
        shorturl: null,
        badurl: true
      });
    } else {
      // res.json({badurl: true});
      res.send(400, "\nInvalid URL.");
    }
  }
});





// GET: ALL
// returns all documents in the db
router.get("/shrt/all", async (req, res) => {
  let all = await dbOps.findAll();
  res.json(all);
})

// GET: ONE
// returns a single doc of a given base 10 index
router.get("/shrt/:idx", async (req, res) => {
  let idx = req.params.idx;
  let doc = await dbOps.findOne(idx);
  res.json(doc);
});





// REDIRECT SHORT URLS TO DESTINATIONS
// GET: USE SHORTENED URL
router.get("/:path", async (req, res) => {
  // paths correspond to the bse 62 notation of the url's idx in the db
  // either redirects to the original site, or provides and message of invalid url
  let idx = base62.decode(req.params.path);
  let result = await dbOps.findOne(idx);

  if (result.longurl) {
    let doc = await dbOps.routeUsed(idx);
    res.redirect(result.longurl);
  } else {
    res.send("John's URL Shortener: Invalid URL");
  }
});

// export router object
module.exports = router;
