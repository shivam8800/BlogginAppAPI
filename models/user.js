var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const Email = require('mongoose-type-mail');
import Article from './article';


var UserSchema = new Schema({
	name:{type: String, required: true},
	email:{type:Email, required:true, unique: true },
	is_admin:{type: Boolean, default: false},
	is_superadmin: {type: Boolean, default: false},
	articles : [{ type: Schema.Types.ObjectId, ref: 'Article' }]
});

const User = mongoose.model('User', UserSchema)

module.exports = User;