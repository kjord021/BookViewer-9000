const express = require ("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

console.log("Attempting DB Connection");

mongoose.connect("mongodb+srv://"+process.env.DB_USER+":"+process.env.DB_PASS+process.env.DB_LOCATION, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {

  if (err){
    throw err;
  } else {
    console.log("DB Connected Sucessfully");
    console.log("Backend Server Ready to Recieve Commands");
  }

});

app.route('/')

.get( function(req, res){

    res.render('index');
  
})

app.listen(3000, function() {
    console.log("Server started on port 3000");
  });