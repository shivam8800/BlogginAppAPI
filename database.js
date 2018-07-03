var Mongoose = require('mongoose')

Mongoose.connect('mongodb://shivam8800:password123@ds125241.mlab.com:25241/bloggingappapi');
var db = Mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
	console.log('Connection with database succeeded.');
});

exports.db = db;