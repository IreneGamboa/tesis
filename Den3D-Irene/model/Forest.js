'use strict'

const
	mongoose = require('mongoose'),
	Schema = mongoose.Schema;

const ForestSchema = new Schema({
	nameForest :		{type:String},
	dateCreated :		{
							type:Date,
							default:Date.now()
						},
	dateToUpdate :		{
							type:Date,
							default:Date.now()
						},
	type :				{type:String},
	idUser:				{type:Schema.Types.ObjectId, ref: 'User'}
});

const ForestModel = mongoose.model('Forest', ForestSchema);

//Publishes the model
module.exports = ForestModel;