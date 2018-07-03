var UserModel = require('../models/user');
var ArticleModel = require('../models/article');

const db = require('../database').db;
var Joi = require('joi');
var async = require('async');
const JWT = require('jsonwebtoken');  // used to sign our content


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
		path: '/auth',
		config: {
			validate:{
				payload:{
                    email:Joi.string(),
                    password:Joi.string()
                }
			}
		},
		handler: async (request, h) =>{
			let pr = async (resolve, reject) =>{
				UserModel.find({'email': request.payload.email}, function(err, data){
	                if (err){
	                    return reject({
	                        'error': err
	                    });
	                } else if (data.length ==0){
	                    return resolve({
	                        'data': "user does not exist!"
	                    });
	                } else {
	                    if (request.payload.password == data[0]['password']){
	                        const token = JWT.sign(data[0].toJSON(), "vZiIpmTzqXHp8PpYXTwqc9SRQ1UAyAfC"); // synchronous
	    
	                         return resolve( {
	                            token,
	                            userid: data[0]['_id'],
	                        } );
	                    }
	                }
	            });
			}
			return new Promise(pr)

		}
	},
	{
		method: 'PUT',
	    path: '/create/admin/{user_id}',
	    handler: (request, h) => {

			let pr = async (resolve, reject) =>{
				UserModel.findOne({ _id: request.params.user_id }, { $set: { is_admin: true}}, function(err, user){
					if (err){
						return reject({
							statusCode: 503,
							message: err
						})
					} else {
						return resolve({
							statusCode: 201,
							message: "Successfully create an admin",
						})
					}
				});

			}
			return new Promise(pr)

	    }
	}
]

export default routes;
