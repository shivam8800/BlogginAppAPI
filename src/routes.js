var UserModel = require('../models/user');
var ArticleModel = require('../models/article');

const db = require('../database').db;
var Joi = require('joi');
var async = require('async');
const JWT = require('jsonwebtoken');  // used to sign our content
const fs = require('fs');

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
	},
	{
		method: 'POST',
		path: '/create/article',
        config: {
            // we joi plugin to validate request
            validate:{
              payload:{
              		title:Joi.string().required(),
              		content:Joi.string().required()
              	}
            },
			auth: 'jwt',
        },
        handler: async (request, h) =>{
        	
        	let pr = async (resolve, reject) =>{
				const authenticated_user = request.auth.credentials;
				var newArticle = new ArticleModel({
					"title": request.payload.title,
					"content": request.payload.content,
					"auther_id": authenticated_user
				});

				newArticle.save(async function(err, data){
					if (err){
						return reject({
							data: err,
							message: "error handled"
						});
					} else {
						authenticated_user.articles.push(data._id);
						let user = await UserModel.findOneAndUpdate({ _id: authenticated_user._id }, { $set: { articles: authenticated_user.articles}});
						return resolve({
							statusCode: 201,
							message: "Successfully created article of a user",
							data: data
						});

					}
				});
			}
			return new Promise(pr)
        }
	},
	{

		method: 'POST',
		path: '/article/image/{article_id}',
		config: {
			auth: 'jwt',
			payload: {
				output: 'stream',
				parse: true,
				allow: 'multipart/form-data'
			},

			handler: async function (request, h){
				let pr = async (resolve, reject) =>{
					var data = request.payload;
					if (data.file) {
						var name = data.file.hapi.filename;
						var path = __dirname + "/uploads/" + name;
						var file = fs.createWriteStream(path);

						file.on('error', function (err) {
							console.error(err)
							return reject({
								message:"you got the error while sending file",
								data: err
							})
						});

						data.file.pipe(file);

						data.file.on('end',async function (err) {
							var ret = {
								filename: data.file.hapi.filename,
								headers: data.file.hapi.headers
							}
							const authenticated_user = request.auth.credentials;
							let article = await ArticleModel.findOneAndUpdate({_id: request.params.article_id},{ $set: { image: path}});
							return resolve(JSON.stringify(ret));
						})
					}
				}
				return new Promise(pr)
			}
		}
	},

]

export default routes;
