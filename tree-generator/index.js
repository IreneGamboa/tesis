var ObjectID = require('mongodb').ObjectID;

function getObjectId() {
  return objectId = new ObjectID();
}

function getValidName(nodeNumber) {
  console.log("Node_"+nodeNumber)
  return "Node_"+nodeNumber;
}

function getNodeImage() {
  return "/images/rana.jpg"
}

function assignParent(node, parent) {
  console.log(node);
  console.log(parent);
  node.parent = parent._id.$oid;
}


function generateNode(nodeNumber) {
  return {
    "_id": {
		"$oid": getObjectId()
	},
	"validName": getValidName(nodeNumber),
	"description": "",
	"img_src": getNodeImage(),
	"url": "http://eol.org/pages/1552/overview",
	"numberSpecies": 0,
	"nextLeaf": null,
	"parent": null,
	"idUser": {
		"$oid": "5a96f4c490b9c96f4dbff2d5"
	},
	"graphicInformation": {
		"isInsideBar": false,
		"selected": false,
		"isMarked": false,
		"isCompress": false,
		"diameter": 64,
		"z": 0,
		"y": 0,
		"x": 0,
		"rotation": 0,
		"radiusBottom": 10.1859163578813
	},
	"habitatList": [],
	"synonymsList": [],
	"commonNameList": [{
		"commonName": "clave",
		"dateRegisted": {
			"$date": "2017-10-11T06:59:54.885Z"
		}
	}],
	"dateRegistered": {
		"$date": "2017-10-11T06:59:54.885Z"
	},
	"dateToUpdate": {
		"$date": "2017-10-11T06:59:54.885Z"
	},
	"__v": 0
  }
}

function generateJSONFile(name, tree) {
  var fs = require('fs');
  fs.writeFile(name+".json", tree, function(err) {
      if(err) {
          return console.log(err);
      }

      console.log("The file " + name + " was saved!");
  });
}

function createRandomTree(totalNodes){
	var listNodes = [],
		  listTree = []
      tree = "",
      nameFile = "tree_random_"+totalNodes+"_nodes",
      nameRaiz = "Random_"+totalNodes;
		// fs = require('fs');
	while (totalNodes){
		var node = generateNode(totalNodes);
		listNodes.push(node);
		totalNodes--;
	}
	while(listNodes.length > 0){
		var indexListNodes =  Math.floor((Math.random() * listNodes.length-1) + 1);
		if (listTree.length === 0){
      listNodes[indexListNodes].validName = nameRaiz;
			listTree.push(listNodes[indexListNodes]);
      tree = tree + JSON.stringify(listNodes[indexListNodes]) + "\n"
      console.log("Nodo Actual: " + listNodes.length);
      console.log("Index List Nodes: "+indexListNodes);
		} else {
			var indexListTree =  Math.floor((Math.random() * listTree.length-1) + 1);
			assignParent(listNodes[indexListNodes],listTree[indexListTree]);
			listTree.push(listNodes[indexListNodes]);
      tree = tree + JSON.stringify(listNodes[indexListNodes]) + "\n";
      console.log("Cantidad Nodos: " + listNodes.length);
      console.log("Index List Nodes: "+indexListNodes);
      console.log("Index List Tree:"+indexListTree);
		}
		listNodes.splice(indexListNodes, 1);
	}

	generateJSONFile(nameFile, tree);
}

function createWithTree(cantNivels,nodeXLeaf){
  var listNodes = [],
		  listTree = []
      tree = "",
      totalNodes = Math.pow(nodeXLeaf, cantNivels),
      nameFile = "tree_width"+totalNodes+"_nodes",
      raiz = generateNode("raiz_"+nameFile);

  listTree.push(raiz);
  listNodes.push(raiz);
  tree = tree + JSON.stringify(raiz) + "\n"
  console.log(listNodes[0]);

  while(listTree.length < totalNodes+1){
    for(i = 1; i <= nodeXLeaf; i++){
      var node = generateNode(i);
      debugger;
      assignParent(node, listNodes[0]);
      listNodes.push(node);
      listTree.push(node);
      tree = tree + JSON.stringify(node) + "\n"
    }
    listNodes.splice(0, 1);
  }
  generateJSONFile(nameFile, tree);

}

function createDepthTree(cantNivels, maxNode){
  var listNodes = [],
		  listTree = []
      tree = "",
      nameFile = "tree_depth_"+cantNivels+"_nivels",
      raiz = generateNode("raiz_"+nameFile);

  listTree.push(raiz);
  listNodes.push(raiz);
  tree = tree + JSON.stringify(raiz) + "\n"
  console.log(listNodes[0]);

  while(cantNivels > 0){
    var nodes = Math.floor(Math.random() * Math.floor(maxNode)+1),
        indexListNodes = Math.floor((Math.random() * listNodes.length-1) + 1),
        nodeFather = listNodes[indexListNodes];
    console.log(nodes)
    listNodes = [];
    for (i = 1; i <= nodes; i++){
      var node = generateNode(i);
      assignParent(node, nodeFather);
      listNodes.push(node);
      listTree.push(node);
      tree = tree + JSON.stringify(node) + "\n"
    }
    cantNivels--;
  }
  console.log(tree);
  generateJSONFile(nameFile, tree);
}

// createRandomTree(200);

// createTree(4,7);
//
console.log(process.argv.length);
if (process.argv.length <= 2){
    console.log("Debe ingresar más parámetros ejemplo: \n tipo_arbol [random|anchura|profundidad]");
} else {
    var type = process.argv[2];
    console.log(type);
    switch(type) {
      case 'random':
          if (process.argv.length === 4){
            var nodes = process.argv[3];
            createRandomTree(nodes)
          } else {
            console.log("Debe ingresar más parámetros ejemplo: \n random cant_nodos [10]");
          }
          break;
      case 'anchura':
          if (process.argv.length === 5){
            var cantNivels = process.argv[3],
                nodeXLeaf = process.argv[4];
            createWithTree(cantNivels, nodeXLeaf);
          } else {
            console.log("Debe ingresar más parámetros ejemplo: \n anchura cant_niveles [3] node_leaf [4]");
          }
          break;
      case 'profundidad':
          if (process.argv.length === 5){
            var cantNivels = process.argv[3],
                maxNode = process.argv[4];
            createDepthTree(cantNivels, maxNode);
          } else {
            console.log("Debe ingresar más parámetros ejemplo: \n anchura cant_niveles [10] maxNode [4]");
          }
          break;

    }
}
