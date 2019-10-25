const express = require("express");
const cors = require("cors");

// Firebase init
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// Express and CORS middleware init
const app = express();
app.use(cors());

// POST / method
app.post("/", (req, res) => {
  const Users = req.body;

  return admin
    .database()
    .ref("/users")
    .push(Users)
    .then(() => {
      return res.status(200).send(Users);
    })
    .catch(error => {
      return res.status(500).send("Oops something happened: " + error);
    });
});

exports.users = functions.https.onRequest(app);
