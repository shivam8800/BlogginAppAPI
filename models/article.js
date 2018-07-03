var mongoose = require('mongoose');
var Schema = mongoose.Schema;

import User from './user';

var ArticleSchema = new Schema({
	title:{type: String, required: true},
	content:{type: String, required:true},
	auther_id:{type: Number, ref: 'User'},
	image: {type: String, required:true},
	date: {type: Date, default: Date.now}
});   

const Article = mongoose.model('Article', ArticleSchema)
module.exports = Article;