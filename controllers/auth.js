var express = require("express");
var router = express.Router();
var db = require('../models');
const bcrypt = require('bcrypt');

//get route for secret clubhouse, if logged in will elt you in, otherwise will fail
router.get('/secret',function(req,res){
    if(req.session.user) {
        res.json("cool secret stuff!");
    }else {
        res.json('not logged in')
    }
})
//creates new instance of user
router.post('/signup',function(req,res){
    console.log(req.body)
    db.User.create({
        name:req.body.name,
        password:req.body.password
    }).then(function(newUser){
        console.log(newUser)
        res.json({name:newUser.name});
    }).catch(err=>{
        res.status(500).json('creation failed')
    })
})

//route for user login
router.post('/login',function(req,res){
    db.User.findOne({
        where:{
            name:req.body.name
        }}).then(function(dbUser){
            //compares password send in req.body to one in database, will return true if matched.
        if(dbUser&&bcrypt.compareSync(req.body.password,dbUser.password)) {
            //create new session property "user", set equal to logged in user
            req.session.user = {
                id:dbUser.id,
                name:dbUser.name
            };
        }
        else {
            //delete existing user, add error
            req.session.user= false;
            req.session.error = 'auth failed bro'
        }
        res.json(req.session.user);
    })
})

router.get('/logout',function(req,res){
    //delete session user, logging you out
    req.session.destroy(function(){
        res.send('successfully logged out')
    })
})
router.get('/readsessions',function(req,res){
    if(req.session.user){
        res.json(req.session.user)
    }else {
        res.json(false)
    }
})

module.exports = router;