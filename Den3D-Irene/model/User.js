'use strict'

const
	mongoose = require('mongoose'),
	Schema = mongoose.Schema;

const UserSchema = new Schema({
	name:			{type:String,required : true},
	lastName:		{type:String,required : true},
	email:			{type:String,required : true,unique :true},
	password:		{type:String,required : true},
	type:			{type:String,required : true},
	treeSelected:	{type:Schema.Types.ObjectId, ref: 'TaxonomicRank'}
});

const UserModel = mongoose.model('User', UserSchema);

// Publishes the model
module.exports = UserModel;