var mongoose = require('mongoose');
var Schema = mongoose.Schema;

import User from './user'

var ArticleSchema = new Schema({
	title:{type: String, required: true},
	content:{type: String, required:true},
	auther_id:{type: Schema.Types.ObjectId, ref: 'User', required:true},
	image: {type: String, required:true, default: '/'},
	date: {type: Date, default: Date.now},
	approved: {type: Boolean, default: false}
});

const Article = mongoose.model('Article', ArticleSchema)
module.exports = Article;
