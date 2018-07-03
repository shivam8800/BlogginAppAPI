var mongoose = require('mongoose');
var Schema = mongoose.Schema;
import Article from './article'

const Email = require('mongoose-type-mail');


var UserSchema = new Schema({
	name:{type: String, required: true},
	email:{type:Email, required:true, index: {unique: true} },
	password: { type: String, required: true },
	is_admin:{type: Boolean, default: false},
	is_superadmin: {type: Boolean, default: false},
	articles : [{ type: Schema.Types.ObjectId, ref: 'Article', default: null }]
});

const User = mongoose.model('User', UserSchema)
module.exports = User;
