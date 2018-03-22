'use strict'

// Data models
const
	taxonomicModel = require('../model/TaxonomicRank');

module.exports = class TaxonManager{
	constructor(){}

	static updateNode(res, idTaxon, validName, description, url, idUser, numberChildren, img_src){
		// Get the taxon to update
		taxonomicModel.findOne({"_id":idTaxon},(err,taxon)=>{
			if (!err) {
				// Update variables
				taxon.validName = validName;
				taxon.description = description;
				taxon.url = url;
				if(img_src != null){
					taxon.img_src = img_src;
				}
				taxon.dateToUpdate = Date.now();
				let newNodes = [];

				// Create new nodes
				for (let i = 0; i < numberChildren; i++) {
					let taxonChild = new taxonomicModel({
						validName : "",
						description : "",
						img_src : "/images/rana.jpg",
						url : "",
						numberSpecies : 0,
						parent : taxon._id,
						nextLeaf : null,
						idUser : idUser,
						commonNameList: [],
						synonymsList: [],
						habitatList: []
					});
					newNodes.push(taxonChild);
				};

				// Set references between leaves
				for (let i = 0; i < newNodes.length; i++) {
					if (i+1 < newNodes.length) {
						newNodes[i].nextLeaf = newNodes[i+1]._id;
					};
				};

				let updateNodes = [];
				updateNodes.push(taxon);

				// Search a brother to set the leaf
				taxonomicModel.findOne({"parent":taxon._id,"nextLeaf":null}, (errLastNode,lastNode)=> {
					if (!errLastNode && lastNode != null && numberChildren > 0) {
						lastNode.nextLeaf = newNodes[0]._id;
						updateNodes.push(lastNode);
						
					};
					for (var i = 0; i < updateNodes.length; i++) {
						updateNodes[i].save( (err)=> {
							if (err) {
								res.send(err);
							}else{
								
								if(newNodes.length >0){
									// Inserts all the document in just one request to DB
									taxonomicModel.insertMany(newNodes).then((docs) => {

										let resultMainTreeTP = TaxonManager.parseNode(taxon);

										docs.forEach((t)=>{
											resultMainTreeTP.children.push(TaxonManager.parseNode(t));
										});

										res.send(resultMainTreeTP);
									}).catch((err) => {
									});
								}
								else{
									res.send( TaxonManager.parseNode(taxon));
								}
							}
						});
					};
				});
			};
		});
	}


	static newTree(res, validName, description, img_src, url, idUser, numberChildren){
		let newNodes = []; // Nodes to store in db
		// Create main taxon
		const taxon = new taxonomicModel({
			validName : validName,
			description : description,
			img_src : ((img_src !== null)? img_src: "/images/rana.jpg"),
			url : url,
			numberSpecies : 0,
			parent : null,
			nextLeaf: null,
			idUser : idUser,
			commonNameList: [],
			synonymsList: [],
			habitatList: []
		});

		// Autoreference of next leaf
		taxon.nextLeaf = taxon._id;
		// Add taxon to list that will be stored
		newNodes.push(taxon);

		let newChildren =[]; // Temp list to children

		// Create the default children
		for (let i = 0; i < numberChildren; i++) {
			let taxonChild = new taxonomicModel({
				validName : "",
				description : "",
				img_src : "/images/rana.jpg",
				url : "",
				numberSpecies : 0,
				parent : taxon._id,
				nextLeaf: null,
				idUser : idUser,
				commonNameList: [],
				synonymsList: [],
				habitatList: []
			});

			newChildren.push(taxonChild);
		};

		// Set references between leaves
		for (let i = 0; i < newChildren.length; i++) {
			if (i+1 < newChildren.length) {
				newChildren[i].nextLeaf = newChildren[i+1]._id;
			};
			newNodes.push(newChildren[i]);
		};

		// Inserts all the document in just one request to DB
		taxonomicModel.insertMany(newNodes).then((docs) => {

			// Create a tree to send user, just for the created tree recently.
			// We start from the docs inserted in DB.

			// Search the parent of this simple tree of two levels.
			let mainTaxon = docs.filter((index)=> {
				if (index.parent === null) {
					return true;
				};
			});

			// Generate tree
			let resultMainTree = TaxonManager.generateTree(docs, mainTaxon[0]._id);

			res.send(resultMainTree.root);

		}).catch((err) => {
			res.send(err);
		})
	}

	static addRightTo(res, idTaxon,validName, description, url, idUser,numberChildren,img_src){
		taxonomicModel.findOne({"_id":idTaxon}, (err,taxon)=> {
			if (!err && taxon.parent != null) {

				let newTaxonNextLeaf = null;
				if(taxon.nextLeaf != null){
					newTaxonNextLeaf = taxon.nextLeaf;
				}

				var newNodes=[]; // Nodes to store in db

				// Create main taxon
				var newTaxon = new taxonomicModel({
					validName : validName,
					description : description,
					img_src : ((img_src !== null)? img_src: "/images/rana.jpg"),
					url : url,
					numberSpecies : 0,
					parent : taxon.parent,
					idUser : idUser,
					nextLeaf: newTaxonNextLeaf,
					commonNameList: [],
					synonymsList: [],
					habitatList: []
				});
				newNodes.push(newTaxon);
				
				// Reference of next leaf
				taxon.nextLeaf = newTaxon._id;
				taxon.save((errSave)=>{});
				//newNodes.push(taxon);

				var children = []; // Temp list to children
				// Create the default children
				for (var i = 0; i < numberChildren; i++) {
					var child = new taxonomicModel({
							validName : "",
							description : "",
							img_src : "/images/rana.jpg",
							url : "",
							numberSpecies : 0,
							parent : newTaxon._id,
							idUser : idUser,
							nextLeaf: null,
							commonNameList: [],
							synonymsList: [],
							habitatList: []
						});
					children.push(child);
				};

				// Set references between leaves
				for (var i = 0; i < children.length; i++) {
					if (i+1 < children.length) {
						children[i].nextLeaf = children[i+1]._id;
					};
					newNodes.push(children[i]);
				};

				// Inserts all the document in just one request to DB
				taxonomicModel.insertMany(newNodes).then((docs) => {

					// Create a tree to send user, just for the created tree recently.
					// We start from the docs inserted in DB.

					// Search the parent of this simple tree of two levels.
					let mainTaxon = docs.filter((index)=> {
						if (index.parent == taxon.parent) {
							return true;
						};
					});

					// Generate tree
					let resultMainTree = TaxonManager.generateTree(docs, mainTaxon[0]._id);

					res.send(resultMainTree.root);
				}).catch((err) => {
					res.send(err);
				})

			}else{
				res.send(taxon);
			};
		})
	}

	static createTrees(res, taxones, idTree){

		return new Promise((resolve, reject) => {

			// SideBar has the root taxons nodes
			let sideBarObjs = taxones.filter((index)=> {
				if (index.parent === null && !index._id.equals(idTree)) {
					return true;
				};
			});
			// It'll has side bar trees
			let sideBar = [];

			let mainTree;
			let resultMainTree; // This variable can be used for a tree from the forest.

			if(idTree != null){
				// Generate the main tree
				resultMainTree = TaxonManager.generateTree(taxones, idTree);
				mainTree = resultMainTree.root;

				// Update data
				taxones = resultMainTree.taxonesAux;
			}
			else{
				// In case that the user doesn't have a selected tree 
				// or the request has a null in idTree
				// The default of mainTree is {}
				mainTree = {};

				if(sideBarObjs.length != 0){
					// For the algorithm to work, it is necessary to execute 
					// once the generation of one tree (of the forest), 
					// while the rest of the trees are generated later.

					let sidePop = sideBarObjs.pop(); // Get one of sidebar to generate
					resultMainTree = TaxonManager.generateTree(taxones, sidePop._id);
					sideBar.push(resultMainTree.root);

					// Update data
					taxones = resultMainTree.taxonesAux;
				}
			}


			if(sideBarObjs.length == 0 ){
				resolve({
					"root": mainTree,
					"sb": []
				});
			}
			else{


				// Generate side bar trees
				sideBarObjs.forEach((tree)=>{
					taxones.push(tree)

					let resultSideTree = TaxonManager.generateTree(taxones, tree._id);

					sideBar.push(resultSideTree.root);
					// Update data
					taxones = resultSideTree.taxonesAux;

				});

				resolve({
					"root": mainTree,
					"sb": sideBar
				});
			}

		});
	}

	static generateTree(taxones, idNode){
			
		// Filter to get the current root node
		let rootObject = taxones.filter((index)=> {
			return index._id.equals(idNode);
		});

		// Filter to get the rest of taxons
		let taxonesAux = taxones.filter((index)=> {
			return !index._id.equals(idNode);
		});

		let root = {};
		if(rootObject.length == 1){
			// Parse the current node
			root = TaxonManager.parseNode(rootObject[0]);

			let result = TaxonManager.findChildren(taxonesAux,root._id);
			root.children = result.children;
			taxonesAux = result.taxonesAux;

		}

		return { "root":root, "taxonesAux":taxonesAux };
	}

	static findChildren(taxones,idParent){
	
		// Filter to get the children of the idParent
		let taxonesPrincipal = taxones.filter((index)=> {
			return  index.parent !== null && index.parent.equals(idParent);
		});
		// Filter to get the rest of taxons
		let taxonesAux = taxones.filter((index)=> {
			return  index.parent !== null &&  !index.parent.equals(idParent);
		});
		let brothers = [];
		for (let i = 0; i < taxonesPrincipal.length; i++) {
			// Parse the current node
			let node = TaxonManager.parseNode(taxonesPrincipal[i]);
			// Recursion
			let result = TaxonManager.findChildren(taxonesAux,node._id);
			// Update node
			node.children = result.children;
			// Update data
			taxonesAux = result.taxonesAux;
			// Add to brothers list
			brothers.push(node);
		};
		return { "children":brothers, "taxonesAux":taxonesAux };
	}

	static parseNode(listElement){
		let auxNode = {};
		auxNode._id = listElement._id;
		auxNode.validName = listElement.validName;
		auxNode.img_src = listElement.img_src;
		auxNode.numberSpecies = listElement.numberSpecies;
		auxNode.parent = listElement.parent;
		auxNode.isInsideBar = listElement.graphicInformation.isInsideBar;
		auxNode.selected = listElement.graphicInformation.selected;
		auxNode.isMarked = listElement.graphicInformation.isMarked;
		auxNode.isCompress = listElement.graphicInformation.isCompress;
		auxNode.diameter = listElement.graphicInformation.diameter;
		auxNode.z = listElement.graphicInformation.z;
		auxNode.y = listElement.graphicInformation.y;
		auxNode.x = listElement.graphicInformation.x;
		auxNode.rotation = listElement.graphicInformation.rotation;
		auxNode.radiusBottom = listElement.graphicInformation.radiusBottom;
		auxNode.nextLeaf = listElement.nextLeaf;
		auxNode.description = listElement.description;
		auxNode.url = listElement.url;
		auxNode.children = [];
		return auxNode;
	};


	static cut(res, idTaxon){

		// Get the taxon to edit
		taxonomicModel.findOne({"_id":idTaxon}, (err,taxon)=> {
			if (err || taxon === null) {
				res.send({"Status":"Error doesn´t found " + taxon});
			} else{

				// Perform the cut
				// deleting the parent
				taxon.parent = null;
				// updating the date
				taxon.dateToUpdate = Date.now();

				let nextLeaf = taxon.nextLeaf;
				// If was an intermediate node fix the correct linking of leaves
				taxonomicModel.findOne({"nextLeaf":taxon._id}, (errBrother,brother)=> {
					if (!(errBrother || brother === null)) {
						brother.nextLeaf = nextLeaf;
						brother.save((errSaveBrother)=> {});
					};
				})
				taxon.nextLeaf = null;
				taxon.save((errSave)=> {
					if (errSave) {
						res.send({"Status":"Error save"});	
					} else{
						res.send(taxon);
					};
				});
			};
		});
	}


	static link(res, idParent, idChild){

		// Search object child
		taxonomicModel.findOne({"_id":idChild},(err,taxonChild)=> {
			if (err || taxonChild === null || taxonChild.parent !== null) {
				res.send({"Status":"Fail","Error":"Taxon child doesn´t found"});
			} else{
				// Search object parent
				taxonomicModel.findOne({"_id":idParent}, (err,taxonParent)=> {
					if (err || taxonParent === null) {
						res.send({"Status":"Fail","Error":"Taxon father doesn´t found"});
					} else{
						// Link by the parent
						taxonChild.parent = idParent;
						// Update
						taxonChild.dateToUpdate = Date.now();
						// The child is inserted in the end, so the next leaf is null.
						taxonChild.nextLeaf = null;
						// But is necessary fix the nextleaf of the last leaf in the parent.
						// Search the last leaf of the parent
						taxonomicModel.findOne({"parent":taxonParent._id,"nextLeaf":null}, (errLastNode,lastNode)=> {
							if (!errLastNode && lastNode !== null) {
								// Fix the nextleaf
								lastNode.nextLeaf = taxonChild._id;
								// Save this change
								lastNode.save( (errLastNode)=> {
									if (errLastNode) {
										console.log(errLastNode);
									};
								});
							} else{
								console.log("The father does not have children");
							};
							// Save the child taxon
							taxonChild.save((errSave)=> {
								if (errSave) {
									res.send({"Status":"Fail","Error":"Taxon child doesn´t found"});
								} else{
									res.send(taxonChild);
								};
							});
						});
					};
				});
			};
		});

	}

	static linkRightTo(res, idTree, idNode){

		// Search the selected node in the current tree
		taxonomicModel.findOne({"_id":idNode}, (errNode,nodeSelected)=> {
			if (errNode || nodeSelected === null) {
				console.log(errNode);
				res.send({"Status":"Fail","Error":"Taxon idNode doesn´t found"});
			} else{
				// Search the selected tree in side bar
				taxonomicModel.findOne({"_id":idTree}, (errTree,tree)=> {
					if (errTree || tree === null) {
						console.log(errTree);
						res.send({"Status":"Fail","Error":"Taxon idTree doesn´t found"});
					} else{
						var nextNode = nodeSelected.nextLeaf;
						// Fix the relationship between the tree in the forest and the current tree
						tree.parent = nodeSelected.parent;
						// Fix the 
						tree.nextLeaf = nextNode;
						nodeSelected.nextLeaf = tree._id;
						// Save tree
						tree.save( (saveTree)=> {
							if (saveTree) {
								console.log(saveTree);
								res.send({"Status":"Fail","Error":"Storing tree"});
							} else{
								console.log("Tree saved");

								// Save the node of current tree
								nodeSelected.save( (saveNode)=> {
									if (saveNode) {
										console.log(saveNode);
										res.send({"Status":"Fail","Error":"Storing nodeSelected"});
									} else{
										console.log("Node saved");
										res.send(nodeSelected);
									};
								});
							};
						});
					};
				})
			};
		});
	}

	static swap(res, idChild, idParent){

		// Search object child
		taxonomicModel.findOne({"_id":idChild}, (err,taxonChild)=> {
			if (err || taxonChild === null || taxonChild.parent !== null) {
				res.send({"Status":"Fail","Error":"Taxon child doesn´t found"});
			} else{
				// Search object parent
				taxonomicModel.findOne({"_id":idParent}, (err,taxonParent)=> {
					if (err || taxonParent === null) {
						res.send({"Status":"Fail","Error":"Taxon child doesn´t found"});
					} else{

						taxonomicModel.findOne({"nextLeaf":idParent}, (errPre, preNode)=> {
							if (!errPre && preNode !== null) {
								// Fix nextleaf
								preNode.nextLeaf = idChild;
								preNode.save((errSave)=>{
									if (errSave) {
										res.send({"Status":"Fail","Error":"Taxon preNode doesn´t found"});
									}
								});

							};

							// Fix the correct nextleaf to child (new component of current tree)
							taxonChild.nextLeaf = taxonParent.nextLeaf;
							taxonChild.parent = taxonParent.parent;

							// Fix the parent (isolate in the forest)
							taxonParent.nextLeaf = null;
							taxonParent.parent = null;

							taxonChild.save((errSave)=>{
								if (errSave) {
									res.send({"Status":"Fail","Error":"Taxon taxonChild doesn´t found"});
								}else{
									taxonParent.save((errSave)=>{
										if (errSave) {
											res.send({"Status":"Fail","Error":"Taxon taxonParent doesn´t found"});
										}else{
											res.send(taxonChild);
										}
									});
								}
							});
							
						});
					}
				});
			}
		});
	}

}