'use strict'

// Imports
const 
	express = require('express'),
	router = express.Router();

// Data models
const
	userModel = require('../model/User'),
	forestModel = require('../model/Forest');

var sess;


// Returns an existing user in the system with their respective information by mail
router.post('/user', (req, res)=> {

	if(req.body.email){
		userModel.findOne({"email":req.body.email}, (err,user)=> {
			if (!err ) {
				res.send(user);
			} else{
				res.send(err);
			};
		});
	}
});

// Sign up a user in the database
router.post('/signup', function(req,res) {
	if(
		req.body.name &&
		req.body.lastName &&
		req.body.email &&
		req.body.password
	){
		var user = new userModel({
			name : req.body.name,
			lastName : req.body.lastName,
			email : req.body.email.toLowerCase(),
			password : req.body.password,
			type : "Public",
			treeSelected : null
		});

		user.save((err)=> {
			if (!err) {
				req.session.email = user.email;
				res.send("Done");
			} else{
				res.send("Fail");
			};
		});
	}
});


// Login user into the system
router.post('/login', function(req,res){

	if(
		req.body.email &&
		req.body.password
	){
		var email = req.body.email.toLowerCase();;
		var password = req.body.password;
		userModel.findOne({
			$and: 
				[
					{"email":email},
					{"password":password}
				]},
			(err,user)=> 
		{
			if (!err && user !== null ) {
				req.session.email = req.body.email;
				res.send("done");
			} else{
				res.send("Fail");
			};
		});
	}

});

// Close an active session of the system
router.post('/logout', function(req,res){
	req.session.destroy(function(err) {
	if(err) {
		console.log(err);
	} else {
		res.redirect('/');
	}
	});
});

module.exports = router;