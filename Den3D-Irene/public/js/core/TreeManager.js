'use strict'

class TreeManager{

	constructor(mainTree, forest){
		this._mainTree = mainTree;
		this._forest = forest;
		this._preList = {};
	}

	mainTree() {
		return this._mainTree;
	}

	mainTree(mainTree) {
		this._mainTree = mainTree;
	}	

	forest() {
		return this._forest;
	}

	forest(forest) {
		this._forest = forest;
	}

	preList(){
		return this._preList;
	}

	preListSet(id, data){
		this._preList[id] = data;
	}

	// ---------------------------------------------------------------------------
	// Takes the result of endpoint server and create the local references
	// between parents and their children
	// ---------------------------------------------------------------------------

	static createReferences(tree){
		let root = new Taxon(tree.validName, null, tree._id,
			tree.img_src, tree.description, tree.url,
			tree.isCompress, tree.isMarked, 
			tree.selected, tree.isInsideBar);

		TreeManager.createReferencesAux(tree.children, root);

		return root;
	}

	static createReferencesAux(children, parent){

		children.forEach((tree)=>{
			let child = new Taxon(tree.validName, null, tree._id,
				tree.img_src, tree.description, tree.url,
				tree.isCompress, tree.isMarked, 
				tree.selected, tree.isInsideBar);
			TreeManager.createReferencesAux(tree.children, child);
			parent.add(child);
		})

	}

	// ---------------------------------------------------------------------------

	static searchTree(forest, id){
		let t = null;
		forest.forEach((tree)=>{
			if(tree._id == id){
				t = tree;
			}
		})
		return t;
	}

	// ---------------------------------------------------------------------------

	static flatten(arr) {
		return arr.reduce(function (flat, toFlatten) {
			return flat.concat(Array.isArray(toFlatten) ? TreeManager.flatten(toFlatten) : toFlatten);
		}, []);
	}

	static getNodesMarked(){
		let nM = []

		nM.push(TreeManager.getNMTree(TM.mainTree));

		TM.forest.forEach((_tree)=>{
			nM.push(TreeManager.getNMTree(_tree));
		})

		// Flatten list
		nM = TreeManager.flatten(nM);

		return nM;

	}

	static getNMTree(node){

		let nM = []

		if(node.isMarked){
			nM.push({
				_id: node._id,
				validName: node.validName
			});
		}

		node.children.forEach((el)=>{
			nM.push(TreeManager.getNMTree(el));
		});

		return nM;

	}

}