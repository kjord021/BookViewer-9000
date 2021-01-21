const express = require ("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const { Decimal128 } = require("bson");
const { Int32 } = require("bson");

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
  author: String,
  cover: String, //update type later
  genre: String,
  price: Decimal128,
  rating: Number,
  title: String,
  authorBio: String,
  date: Date,
  description: String,
  publisher: String
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
}).post( function(req, res){
  const newBook = new Book({
    author: req.body.author,
    cover: req.body.cover,
    genre: req.body.genre,
    price: req.body.price,
    rating: req.body.rating,
    title: req.body.title,
    authorBio: req.body.authorBio,
    date: req.body.date,
    description: req.body.description,
    publisher: req.body.publisher
  });
  newBook.save(function (err) {
    if(!err) {
      res.send("Book added");
    }
    else {
      console.log(err);
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
