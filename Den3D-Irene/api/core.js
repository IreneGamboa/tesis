'use strict'

// Imports
const 
	express = require('express'),
	router = express.Router(),
	officegen = require('officegen'),
	fs = require("fs"),
	multer = require('multer'),
	path = require('path');

// Classes
const
	FileManager = require('../controller/FileManager'),
	TaxonManager = require('../controller/TaxonManager');

// Data models
const
	userModel = require('../model/User'),
	taxonomicModel = require('../model/TaxonomicRank');

const upload = multer(
	{ 
		limits: {
			fieldNameSize: 250,
			fieldSize: 999999999
		},
		dest: './public/images/'
	}
);

const 
	DEFAULTIMG = "/images/rana.jpg";

// Obtain a taxon by ID, return all the information of this taxon.
router.post('/getTaxon', (req,res)=> {
	var idTaxon = req.body.idTaxon;
	if(idTaxon){
		taxonomicModel.findOne({"_id":idTaxon}, (err,taxon)=> {
			if (!err) {
				res.send(taxon);
			} else{
				res.send(err);
			};
		});
	}
});

// Create a new node with a default children. OP*
router.post('/newTree',  upload.any(), (req,res)=>{
	
	const
		validName = req.body.validName,
		description = req.body.description,
		url = req.body.url,
		numberChildren = req.body.numberChildren,
		idUser = req.body.idUser;

	if(
		validName != null && description != null && url != null && 
		numberChildren != null && idUser != null
	){

		// If an image has been sent, this image is caught and create locally.
		// Otherwise, set the default image sending null in img_src.

		if(req.files && req.files.length >0){
			FileManager.uploadImage(req)
				.then((img_src)=>{
					TaxonManager.newTree(res, validName, description,
						img_src, url, idUser, numberChildren
					);
				})
				.catch((err)=>{
					res.send(err);
				});
		}
		else{
			TaxonManager.newTree(res, validName, description,
					null, url, idUser, numberChildren
				);
		}		
	}
});

router.get('/newTreeTest', (req, res)=>{
	res.send(
		'<form action="/core/newTree" method="post" enctype="multipart/form-data">'+
		'<input type="file" name="source"><br>'+
		'<input type="text" name="validName" value="algo"><br>'+
		'<input type="text" name="description" value="algo"><br>'+
		'<input type="text" name="url" value="http://c.as"><br>'+
		'<input type="text" name="numberChildren" value="8"><br>'+
		'<input type="text" name="idUser" value="5a10faae47a0d77c661310fc"><br>'+
		'<input type="submit" value="Upload">'+
		'</form>'
	);
});

// Update a node OP*
router.post('/UpdateNode', upload.any(), (req,res)=>{

	const
		idTaxon = req.body.idTaxon,
		validName = req.body.validName,
		description = req.body.description,
		url = req.body.url,
		numberChildren = req.body.numberChildren, // is new children
		idUser = req.body.idUser;
	
	if(
		validName != null && description != null && url != null && 
		numberChildren != null && idUser != null && idTaxon != null 
	){
		if(req.files && req.files.length >0){
			FileManager.uploadImage(req)
			.then((img_src)=>{
				TaxonManager.updateNode(res, idTaxon,validName, description, url, 
					idUser,numberChildren,img_src
				)
			})
			.catch((err)=>{
				res.send(err);
			})
		}else{
			TaxonManager.updateNode(res, idTaxon,validName, description, url, 
				idUser,numberChildren,null
			)
		}
	}
	
});

router.get('/UpdateNodeTestA', (req, res)=>{
	res.send(
		'<form action="/core/UpdateNode" method="post" enctype="multipart/form-data">'+
		'<input type="file" name="source"><br>'+
		'<input type="text" name="validName" value="algo"><br>'+
		'<input type="text" name="description" value="algo"><br>'+
		'<input type="text" name="url" value="http://c.as"><br>'+
		'<input type="text" name="numberChildren" value="8"><br>'+
		'<input type="text" name="idUser" value="5a10faae47a0d77c661310fc"><br>'+
		'<input type="text" name="idTaxon" value="5a11b6d39134a1652a4f2ca7"><br>'+
		'<input type="submit" value="Upload">'+
		'</form>'
	);
});

router.get('/UpdateNodeTestB', (req, res)=>{
	res.send(
		'<form action="/core/UpdateNode" method="post" enctype="multipart/form-data">'+
		'<input type="text" name="validName" value="algo"><br>'+
		'<input type="text" name="description" value="algo"><br>'+
		'<input type="text" name="url" value="http://c.as"><br>'+
		'<input type="text" name="numberChildren" value="8"><br>'+
		'<input type="text" name="idUser" value="5a10faae47a0d77c661310fc"><br>'+
		'<input type="text" name="idTaxon" value="5a11b6d39134a1652a4f2ca7"><br>'+
		'<input type="submit" value="Upload">'+
		'</form>'
	);
});

// Add a node to the right of a node. OP*
router.post('/addRightTo', upload.any(), (req,res)=>{
	const
		idTaxon = req.body.idTaxon,
		validName = req.body.validName,
		description = req.body.description,
		url = req.body.url,
		numberChildren = req.body.numberChildren, // is new children
		idUser = req.body.idUser;
	
	if(
		validName != null && description != null && url != null && 
		numberChildren != null && idUser != null && idTaxon != null
	){

		// If an image has been sent, this image is caught and create locally.
		// Otherwise, set the default image sending null in img_src.

		if(req.files && req.files.length >0){
			FileManager.uploadImage(req)
				.then((img_src)=>{
					TaxonManager.addRightTo(res, idTaxon, validName, 
						description, url, idUser, numberChildren, img_src);
				})
				.catch((err)=>{
					res.send(err);
				});
		}
		else{
			TaxonManager.addRightTo(res, idTaxon, validName, 
				description, url, idUser, numberChildren, null);
		}
		
	}
});

router.get('/addRightToTest', (req, res)=>{
	res.send(
		'<form action="/core/addRightTo" method="post" enctype="multipart/form-data">'+
		'<input type="file" name="source"><br>'+
		'<input type="text" name="validName" value="algo"><br>'+
		'<input type="text" name="description" value="algo"><br>'+
		'<input type="text" name="url" value="http://c.as"><br>'+
		'<input type="text" name="numberChildren" value="8"><br>'+
		'<input type="text" name="idUser" value="5a10faae47a0d77c661310fc"><br>'+
		'<input type="text" name="idTaxon" value="5a11b6d39134a1652a4f2ca7"><br>'+
		'<input type="submit" value="Upload">'+
		'</form>'
	);
});

router.post('/makeSumary', (req,res)=> {

	if(req.body.idElement){
		const list = JSON.parse(req.body.idElement);
		if (list.length > 0) {
			taxonomicModel.find({"_id":{$in:list}}, (err,amphibians)=>{
				if (!err) {
					
					res.writeHead ( 200, {
						"Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
						'Content-disposition': 'attachment; filename=ReporteDen3D.docx',
						'set-cookie':'fileDownload =true; path=/'
					});
				
					let docx = officegen ( 'docx' );

					docx.on ( 'finalize', ( written )=> {
						console.log ( 'Finish to create Word file.\nTotal bytes created: ' + written + '\n' );
					});

					docx.on ( 'error', ( err )=> {
						console.log ( err );
					});

					var pObj = docx.createP ( { align: 'center' } );
					pObj.addText ( 'Reporte de Información', {font_size: 18} );

					for (var i = 0; i < amphibians.length; i++) {
						var pObj = docx.createListOfNumbers ( { align: 'jestify' });
						pObj.addText (amphibians[i].validName, { italic: true });
					};

					for (var i = 0; i < amphibians.length; i++) {

						let validName = amphibians[i].validName;

						if(validName === ""){
							validName = "Sin título";
						}

						var pObj = docx.createP ( { align: 'center' } );
						pObj.addText (validName, { bold: true, underline: true, italic: true, font_size: 24, color: '5571D8' } );

						if(amphibians[i].description != ""){
							var pObj = docx.createP ();
							pObj.addText (amphibians[i].description);
						}

						if(amphibians[i].url != ""){
							var pObj = docx.createP ();
							pObj.addText ('Consultar la UBI:', { bold: true });

							var pObj = docx.createP ();
							pObj.addText (amphibians[i].url);
						}

						var pObj = docx.createP ( { align: 'center' } );

						pObj.addImage ( path.join(__dirname, "..", "public", amphibians[i].img_src ) );
						pObj.addLineBreak ();
								
					}	
					docx.generate (res);
				}
				else {
					res.send(err);
				};
			});
		}else{
			res.send({"message":"Ok"});
		};
	}
});

router.post('/openWorkbench', (req,res)=> {
	
	var idUser = req.body.idUser;
	var idTree = (req.body.idTree!="")?req.body.idTree:null;

	if(idUser ){
		taxonomicModel.find({idUser:idUser}, (err,taxones)=> {
			if(! err){

				if(taxones.length > 0){
					TaxonManager.createTrees(res, taxones, idTree)
						.then((result)=>{
							res.send(result);
						});
				}
				else{
					res.send({
						"root": {},
						"sb": []
					});
				}
			}
		});
	}
});

// Compress a node OP*
router.post('/compress', (req,res)=> {
	const idTaxon = req.body.idTaxon;
	if(idTaxon){
		taxonomicModel.update(
			{"_id":idTaxon},
			{$set:{"graphicInformation.isCompress":true}},
			(err,taxon)=> {
				if (!err) {
					res.send({"Status":"Compressed"});
				}
				else{
					res.send(err);
				}
			}
		)
	}
});

// Expand a node OP*
router.post('/expand', (req,res)=> {
	const idTaxon = req.body.idTaxon;
	if(idTaxon){
		taxonomicModel.update(
			{"_id":idTaxon},
			{$set:{"graphicInformation.isCompress":false}},
			(err,taxon)=> {
				if (!err) {
					res.send({"Status":"Expanded"});
				}
				else{
					res.send(err);
				}
			}
		)
	}

});

router.post('/marksList', (req, res)=> {
	const idUser = req.body.idUser;
	
	if(idUser){
		taxonomicModel.find({
			$and: 
				[
					{"graphicInformation.isMarked":true},
					{"idUser":idUser}
				]},
			(err,taxones)=>
		{
			if (err) {
				res.send(err);
			} else{
				res.send(taxones)
			};
		})
	}
});

router.post('/mark', (req,res)=> {
	const idTaxon = req.body.idTaxon;
	if(idTaxon){
		taxonomicModel.findOne({"_id":idTaxon},(err,taxon)=> {
			if (!err) {
				if (taxon.graphicInformation.isMarked) {
					taxon.graphicInformation.isMarked = false;
				} else{
					taxon.graphicInformation.isMarked = true;
				};
				taxon.save((errSave)=> {
					if (errSave) {
						res.send({"Status":"Error save"});	
					} else{
						res.send({"Status":"Marked","isMarked":taxon.graphicInformation.isMarked});
					};
				});
			} else{
				res.send(err);
			};
		});
	}
});


// Cut function to Snip and Prune
router.post('/cut', (req,res)=> {
	const idTaxon = req.body.idTaxon;

	if(idTaxon){
		TaxonManager.cut(res, idTaxon);
	}

});

// A link is made between a tree in the forest and a node selected from the tree that is in the work area
router.post('/link', (req,res)=> {
	const 
		idChild = req.body.idChild,
		idParent = req.body.idParent;
	
	if(idChild != null && idParent != null){
		TaxonManager.link(res, idParent, idChild);
	}
});

//
router.post('/linkRightTo', (req,res)=> {
	const 
		tree = req.body.tree,		//Es el nodo que esta en el bosque.
		idNode = req.body.idNode;  	//Es el nodo seleccionado.

	if(tree != null && idNode != null ){
		TaxonManager.linkRightTo(res, tree, idNode);
	}
});


// An exchange is made between a forest tree and a node or branch that is in the work area
router.post('/swap', (req,res)=> {
	const 
		idChild = req.body.idChild,  //Es el arbol en el bosque.
		idParent = req.body.idParent; //Es el nodo del arbol.

	if(idChild != null && idParent != null ){
		TaxonManager.swap(res, idChild, idParent);
	}
});

router.post('/delete', (req,res)=> {
	const idTaxon = req.body.idTaxon;
	if(idTaxon){
		taxonomicModel.findOne({"_id":idTaxon}, (err,taxon)=> {
			if (err || taxon === null) {
				res.send({"Status":"Fail","Error":"Taxon child doesn´t found"});
			} else{
				userModel.findOne({"_id":taxon.idUser}, (errUser,user)=>{
					if (!err && user !== null && user.treeSelected != null && user.treeSelected.equals(taxon._id)) {
						user.treeSelected = null;

						user.save( (errSave)=> {
						});
					} else{
						//res.send(err);Cambiar el error
					};
				});
				taxonomicModel.findOne({"nextLeaf":taxon._id}, (err,brother)=> {
					if (!err && brother !== null) {
						brother.nextLeaf = taxon.nextLeaf;
						brother.save( (brotherSaved)=> {
							console.log("Changed brother");
						});
					}
				});
				deleteNode(taxon);
				if(taxon.img_src !== DEFAULTIMG){
					FileManager.deleteImage(path.join(__dirname, '..', 'public')+taxon.img_src);
				}
				taxonomicModel.findOne({"_id":taxon._id}).remove().exec( (err,data)=> {
				});

				res.send({'Status':'ok'});
			};
		});
	}
});

// Delete recursively the nodes
function deleteNode (taxon) {
	taxonomicModel.find({"parent":taxon._id}, (err,taxones)=> {
		for (var i = taxones.length - 1; i >= 0; i--) {
			deleteNode(taxones[i]);
			if(taxones[i].img_src !== DEFAULTIMG){
				FileManager.deleteImage(path.join(__dirname, '..', 'public')+taxones[i].img_src);
			}
			taxonomicModel.findOne({"_id":taxones[i]._id}).remove().exec( (err,data)=> {
			});
		};
	});
}

// Search by valid name. OP*
router.post('/searchValidName', (request,response)=> {

	const 
		validName = request.body.validName,
		idUser = request.body.idUser;
	
	if(validName && idUser){

		taxonomicModel.find(
			{
				$text:{$search: validName},
				"idUser":idUser
			},
			{_id:1, validName:1, img_src:1, idUser:1, "graphicInformation.isMarked":1},
			(err,result)=>
		{
			if(!err){
				response.send(result);
			}
			else {
				response.send(err);
			}
		});
		
	}
});

// Search by description OP*
router.post('/searchDescription', (request,response)=> {

	const 
		description = request.body.description,
		idUser = request.body.idUser;
	
	if(description && idUser){
		const regularExpression = new RegExp(".*" + description + ".*");
		taxonomicModel.find(
			{
				"description" : regularExpression,
				"idUser":idUser
			},{_id:1, validName:1, img_src:1, idUser:1, "graphicInformation.isMarked":1},
			(err,result)=> 
		{
			if(!err){
				response.send(result);
			}
			else {
				response.send(err);
			}
		});
	}

});

// Search by common name. OP*
router.post('/searchCommonName', (request,response)=>{

	const 
		commonName = request.body.commonName,
		idUser = request.body.idUser;

	if(commonName && idUser){
		taxonomicModel.find(
			{
				"commonNameList.commonName" : commonName,
				"idUser":idUser
			},
			{_id:1, validName:1, img_src:1, idUser:1, "graphicInformation.isMarked":1},
			(err,result)=> 
		{
			if(!err){
				response.send(result);
			}
			else {
				response.send(err);
			}
		});
	}
});


// Set treeSelected
router.post('/setTreeSelected', (req, res)=>{

	const
		idUser = req.body.idUser,
		idTree = req.body.idTree;

	if(idUser){
		userModel.findOne({"_id":idUser}, (err,user)=> {
			if (!err ) {

				user.treeSelected = idTree;

				user.save( (errSave)=> {});

				res.send(user);
			} else{
				res.send(err);
			};
		});
	}

});

module.exports = router;