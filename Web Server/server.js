const express = require ("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const { reduce } = require("async");

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

//create schema for db
const userSchema = {
  userName: String,
  password: String,
  name: String,
  nickname: String,
  emailAddress: String,
  homeAddress: String,
  creditCard: Object,
  creditCards: Array
};

//bind schema to object
const User = mongoose.model("User", userSchema);

//Requests for index

app.route('/')

.get( function(req, res){

    res.render('index');
  
});

//Requests for login

app.route('/login')

.get( function(req, res){

  res.render('login');

})

.post( function(req, res){
  //parse data from html form
  const password = req.body.password;
  const userName = req.body.userName;

  //if finds matching user name
  User.findOne({userName: userName}, function(err, user){
    if (user){
      //if finds matching password
      if (user.password == password){
          //redirect to the dashboard
          res.render('dashboard');
      } else {
        res.render('loginfail');
      }

    } else {
      res.render('loginfail');
    }
  })
});

//Requests for register

app.route('/register')

.get( function (req, res){
  res.render('register');
})

.post( function(req, res){
   //parse data from html form
  const userName = req.body.userName;
  const email = req.body.emailAdd;
  const fullName = req.body.fullName;
  const password = req.body.password;

  //check to see if UN or email exist
  User.findOne({userName: userName}, function(err, user){
    if (user){
      res.render('registerfail');
    }
    else {
      console.log(err);
      User.findOne({emailAddress: email}, function(err, user){
        if (user){
          res.render('registerfail');
        }
        else {
          console.log(err);

          //if login data doesnt exist create new login

          const newUser = User({
            userName: userName,
            emailAddress: email,
            name: fullName,
            password: password
          });
        
          newUser.save( function (err){
            if (!err){
              //redirect user to the login page
              res.render('login');
            }
            else {
              console.log(err);
            }
          });

        }  
      });
    }    
  });
})



app.listen(3000, function() {
    console.log("Server started on port 3000");
  });