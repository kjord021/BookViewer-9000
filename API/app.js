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

console.log("Attempting DB Connection");

mongoose.connect("mongodb+srv://"+process.env.DB_USER+":"+process.env.DB_PASS+process.env.DB_LOCATION, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {

  if (err){
    throw err;
  } else {
    console.log("DB Connected Sucessfully");
  }

});

const bookSchema = {
  title: String,
  content: String
};

const Book = mongoose.model("Book", bookSchema);

//Request all books

app.route('/books')

.get( function(req, res){

  Book.find(  function(err, foundBooks){
    if (!err){
      res.send(foundBooks);
    } else {
      res.send(err);
    }
  });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
