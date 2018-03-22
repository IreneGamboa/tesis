'use strict'

// Imports
const 
	express = require('express'),
	session = require('express-session'),
	path =  require('path'),
	favicon = require('serve-favicon'),
	logger = require('morgan'),
	fs = require('fs'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	http = require('http'),
	multer = require('multer'),
	mongoose = require('mongoose');

// Local Files
const 
	index = require('./api/index'),
	users = require('./api/users'),
	core = require('./api/core');

// Server App
const 
	app = express(),
	server = http.Server(app);

// Settings
const 
	port = process.argv[2] || 8080,
	dev = (process.argv[3] == "true")?true:false || false;

// Save logs, create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(
		path.join(__dirname, 'api.log'),
		{flags: 'a'}
	);
app.use(logger('tiny', {stream: accessLogStream}));

// Dev section
if(dev == true){
	console.log("Dev mode");
	// Show logs
	app.use(logger('dev'));

	// Middleware to enable CORS 
	app.use((req, res, next)=> {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
		next();
	});
}

// Setup of session
app.use(session({
	secret: 'yatDQGoyuj1PaZVh77dl7zLiFzutxZ1gLOglRJSql27UbNfe0geFnbJ6wDIgzVh7',
	proxy: true,
	resave: true,
	saveUninitialized: true
}));

// Set favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// BodyParser and Cookie Parser
app.use( bodyParser.json({limit : '50mb'}) );
app.use( bodyParser.urlencoded({extended: true}) );
app.use(cookieParser()); 

// Setup view engine
app.set('view engine', 'jade');

// Setup static files
app.set('views', path.join(__dirname, 'views'));
app.use("/views", express.static(__dirname + '/views'));
app.use("/assets", express.static(__dirname + '/public/assets'));
app.use("/css", express.static(__dirname + '/public/css'));
app.use("/fonts", express.static(__dirname + '/public/fonts'));
app.use("/images", express.static(__dirname + '/public/images'));
app.use("/js", express.static(__dirname + '/public/js'));
app.use("/sounds", express.static(__dirname + '/public/sounds'));

app.use(express.static(path.join(__dirname, 'public')));

// Connection with mongo
mongoose.connect('mongodb://localhost/Den3D');

mongoose.connection.on('error',(err)=>{
	console.log(err);
});

mongoose.connection.once('open',()=>{
	console.log('Connected to mongodb://localhost/Den3D Succesfully');
});

// Test Ping 
app.get('/ping',(req, res)=>
	{
		res
			.status(200)
			.json({pong:true})
	}
);

// Routers
app.use('/', index);
app.use('/users', users);
app.use('/core',core);


server.listen(port, ()=>{
	console.log('Server running on port: '+port);
});