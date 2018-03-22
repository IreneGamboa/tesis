'use strict'

const
	mongoose = require('mongoose'),
	Schema = mongoose.Schema;

const TaxonomicRankSchema = new Schema({
	validName:				{type:String},
	description:			{type:String},
	img_src:				{type:String},
	url:					{type:String},
	dateToUpdate:			{
								type:Date,
								default: Date.now()
							},
	dateRegistered:			{
								type:Date,
								default: Date.now()
							},
	numberSpecies:			{type:Number},
	parent:					{
								type:Schema.Types.ObjectId,
								ref: 'TaxonomicRank',
								required:false
							},
	nextLeaf:				{
								type:Schema.Types.ObjectId,
								ref: 'TaxonomicRank',
								required:false
							},
	idUser:					{
								type:Schema.Types.ObjectId,
								ref: 'User',
								required:true
							},
	commonNameList:			[{
								commonName:			{type:String},
								dateRegisted:		{type:Date,default:Date.now()}
							}],
	synonymsList:			[{
								synonym:			{type:String},
								author:				{type:String},
								date:				{type:Date,default:Date.now()}
							}],
	habitatList:			[{
								habitatName:			{type:String},
								description:			{type:String}
							}],
	graphicInformation:		{
								radiusBottom:			{type:Number,default: 10.185916357881302},
								rotation:				{type:Number,default: 0},
								x:						{type:Number,default: 0},
								y:						{type:Number,default: 0},
								z:						{type:Number,default: 0},
								diameter:				{type:Number,default: 64},
								isCompress:				{type:Boolean,default: false},
								isMarked:				{type:Boolean,default: false},
								selected:				{type:Boolean,default: false},
								isInsideBar:			{type:Boolean,default: false}
							}
});

const TaxonomicRankModel = mongoose.model('TaxonomicRank', TaxonomicRankSchema);

//Publishes the model
module.exports = TaxonomicRankModel;