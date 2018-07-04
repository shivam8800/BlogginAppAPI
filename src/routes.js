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
	    config: { auth: 'jwt' },
	    handler: (request, h) => {
	    	const authenticated_user = request.auth.credentials
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
		method: 'GET',
	    path: '/create/admin/{user_id}',
	    config:{
	    	auth: 'jwt'
	    },
	    handler: (request, h) => {
			let pr = async (resolve, reject) =>{
	    		const authenticated_user = request.auth.credentials;
				if (authenticated_user.is_superadmin){
					UserModel.findOneAndUpdate({ _id: request.params.user_id },{$set: {is_admin: true}}, function(err, user){
						if (err){
							return reject({
								statusCode: 503,
								message: err
							});
						} else {
							return resolve({
								statusCode: 201,
								message: "Successfully create an admin",
							});
						}
					});
				} else {
					return resolve({
						statusCode: 500,
						message: "Only superAdmin has access to create admin"
					})

				}

			}
			return new Promise(pr)
	    }
	},
	{
		method: 'POST',
		path: '/registration',
        config: {
            // we joi plugin to validate request
            validate:{
              payload:{
              		name:Joi.string().required(),
              		email:Joi.string().required(),
              		password:Joi.string().required()
              	}
            }
        },
		handler: async (request, h) =>{

			let pr = async (resolve, reject) =>{
				UserModel.find({'email': request.payload.email}, function(err, data){

					if(err){
						return reject({
							statusCode: 500,
							message: "error handled",
							data: err
						});
					} else if( data.length != 0){
						return resolve({
							statusCode: 201,
							message: 'This user is already exist'
						});
					} else {
						var newUser = new UserModel({
							"name": request.payload.name,
							"email": request.payload.email,
							"password": request.payload.password
						});
						newUser.save(function(err, user){
							if (err){
								return reject({
									data: err,
									message: "error handled"
								});
							} else {
								return resolve({
									statusCode: 200,
									message: "you have Successfully created use",
									data: user
								});
							}
						})
					}

				});
			}
			return new Promise(pr)		
		}
	}
]

export default routes;
