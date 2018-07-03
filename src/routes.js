var UserModel = require('../models/user');
var ArticleModel = require('../models/article');

const db = require('../database').db;
var Joi = require('joi');


const routes = [
	{
		method: 'GET',
	    path: '/',
	    handler: (request, h) => {

	        return 'Hello, world!';
	    }

	},
	{
		method: 'POST',
	    path: '/createsuperadmin',
	    handler: (request, h) => {

	        return 'Hello, ' + encodeURIComponent(request.params.name) + '!';
	    }
	}
]

export default routes;
