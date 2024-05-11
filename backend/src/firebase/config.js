const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require("firebase/firestore");
const { getDatabase } = require("firebase/database");
require('dotenv').config()

var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


let db = admin.firestore(); 


module.exports = {
    db
}