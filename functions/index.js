const express = require("express");
const cors = require("cors");
const uuidv5 = require("uuid/v5");
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

app.get("/", (req, res) => {
  return admin
    .database()
    .ref("/users")
    .on(
      "value",
      snapshot => {
        return res.status(200).send(snapshot.val());
      },
      error => {
        return res.status(500).send("Oops something happened: " + error);
      }
    );
});

exports.users = functions.https.onRequest(app);

exports.onCreate = functions.database
  .ref("/users/{userId}")
  .onCreate((snap, context) => {
    const newId = uuidv5(Date.now().toString(), uuidv5.DNS);
    return snap.ref.update({ id: newId });
  });
