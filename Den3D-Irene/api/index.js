'use strict'

// Imports
const 
	express = require('express'),
	server_config = require('../config/server_config'),
	router = express.Router();

var sess;

router.get('/', (req, res)=>{
	sess = req.session;
	if(sess.email){
		res.render('Den3D',{email_user:sess.email});
	}else{
		res.render('login');
	}
});

module.exports = router;