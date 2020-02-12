var express = require('express');
//using express-session to enable session storage for our server
var session = require("express-session");
require('dotenv').config();
const cors = require('cors');
// Sets up the Express App
// =============================================================
var app = express();
// app.use(cors({
//     origin:["http://localhost:3000"],
//     credentials:true
// }));
app.use(cors({
    origin:["https://joessimplereactauth.herokuapp.com/"],
    credentials:true
}));
// app.use(cors());
var PORT = process.env.PORT || 8080;
//imports entire controllers folder, we will handle moularization there
var allRoutes = require('./controllers');

// Requiring our models for syncing
var db = require('./models');

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static directory
app.use(express.static('public'));


//initializing sessions on our server, basically boilerplate
app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true,cookie:{maxAge: 7200000} }));


app.use('/',allRoutes);


db.sequelize.sync({ force: false}).then(function() {
    app.listen(PORT, function() {
    console.log('App listening on PORT ' + PORT);
    });
});