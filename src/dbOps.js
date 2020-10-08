// DATABASE OPERATIONS MODULE
// handles requests from other modules for db functions
//
// init      :: initializes mongo connection and model
// insertUrl :: returns existing doc or calls insertNew
// insertNew :: inserts a new shortened url into the db
// findAll   :: returns json of all db content
// findOne   :: returns one doc of a given idx

// NPM PACKAGE IMPORTS
const mongoose = require("mongoose");
const base62 = require("base62");

// db document model, set by Init function
let Url = null;






// MONGODB INIT
exports.init = function (port) {
  // connect to local mongo db
  if (port == 80) {
    mongoose.connect('mongodb://mongo/shorturldb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });
  } else {
    mongoose.connect('mongodb+srv://user:${{ secrets.MONGO_API_KEY }}@cluster0.1pvti.mongodb.net/urlshrt?retryWrites=true&w=majority',
      // mongoose.connect('mongodb://localhost:27017/urls',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      });
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
    },
    date: {
      type: Date,
      required: [true, "Date Required."]
    },
    useCount: {
      type: Number,
      required: [true, "User Count Required."]
    }
  });
  // create db model based off document schema
  Url = mongoose.model("Url", urlSchema);
}

// EXPORT MODEL
exports.getModel = function () {
  return Url;
}





// DB FUNCTIONS
let insertNew = function (longUrl, urlHeader) {
  // creates a new document and inserts it into db
  return new Promise((resolve, reject) => {
    Url.countDocuments({}, (err, count) => {
      if (err) {
        console.log(err);
        reject(err);
      }

      let idx = count;
      let shortUrl = urlHeader + base62.encode(idx);
      let todayDate = new Date();
      let newLong = new Url({
        idx: idx,
        longurl: longUrl,
        shorturl: shortUrl,
        date: todayDate,
        useCount: 0
      });
      newLong.save();

      resolve(newLong);
    });
  });
}

exports.insertUrl = function (longUrl, urlHeader) {
  // either returns an existing document or calls insertNew
  return new Promise((resolve, reject) => {
    Url.findOne({longurl: longUrl}, 'idx longurl shorturl', async (err, doc) => {
      if (err) {
        console.log(err);
        reject(err);
      }

      if (doc) {
        resolve(doc);
      } else {
        let newDoc = await insertNew(longUrl, urlHeader);
        resolve(newDoc);
      }
    });
  });
}

exports.findAll = function () {
  // returns an array contianing all db entries
  return new Promise((resolve, reject) => {
    Url.find({}, 'idx inputurl longurl shorturl', (err, docs) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(docs);
      }
    });
  });
}

exports.findOne = function (idx) {
  // returns the db entry at a particular idx
  // includes idx, long url and short url
  return new Promise((resolve, reject) => {
    Url.findOne({ idx: idx }, 'idx longurl shorturl', (err, doc) => {
      if (err) {
        console.log(err);
        reject(err);
      }

      if (doc) {
        resolve(doc);
      } else {
        resolve({ invalidIdx: true });
      }
    });
  });
}

exports.routeUsed = function (idx) {
  // increments the db entry use count by 1
  return new Promise((resolve, reject) => {
    Url.findOneAndUpdate({ idx: idx }, {$inc: {useCount: 1} }, (err, doc) => {
      if (err) {
        console.log(err);
        reject(err);
      }

      if (doc) {
        resolve(doc);
      } else {
        resolve({ invalidIdx: true });
      }
    });
  });
}
