//Referencias de los id's
var createSubTree =function(node){
	var subGroup = new THREE.Object3D();	
	if (node.isCompress === false){//node.refSquare != -1){// && node.isCompress == false){
		// AÑADÍ .id
		obj=group.getObjectById(node.refSquare.id);
		subGroup.position.x = obj.position.x;
		subGroup.position.y = obj.position.y;
		subGroup.position.z = obj.position.z;
		obj.position.x -= subGroup.position.x;
		obj.position.y -= subGroup.position.y;
		obj.position.z -= subGroup.position.z;
		group.remove(obj);
		subGroup.add(obj);
		if (node.refCone != -1 && node.refCone != null) {
			// AÑADÍ .id
			obj=group.getObjectById(node.refCone.id);
			obj.position.x -= subGroup.position.x;
			obj.position.y -= subGroup.position.y;
			obj.position.z -= subGroup.position.z;
			group.remove(obj);
			subGroup.add(obj);
		};
		if (node.refMark != -1 && node.refMark != null) {
			// AÑADÍ .id
			obj=group.getObjectById(node.refMark.id);
			obj.position.x -= subGroup.position.x;
			obj.position.y -= subGroup.position.y;
			obj.position.z -= subGroup.position.z;
			group.remove(obj);
			subGroup.add(obj);
		};
		if (node.isCompress == true) {
			// AÑADÍ .id
			obj=group.getObjectById(node.refSphere.id);
			obj.position.x -= subGroup.position.x;
			obj.position.y -= subGroup.position.y;
			obj.position.z -= subGroup.position.z;
			group.remove(obj);
			subGroup.add(obj);
		};
		for (var i = 0; i < node.children.length; i++) {
			createSubTreeAux(node.children[i],subGroup);
		};
	}
	else{
		// AÑADÍ .id
		obj=group.getObjectById(node.refSphere.id);
		subGroup.position.x = obj.position.x;
		subGroup.position.y = obj.position.y;
		subGroup.position.z = obj.position.z;
		obj.position.x -= subGroup.position.x;
		obj.position.y -= subGroup.position.y;
		obj.position.z -= subGroup.position.z;
		group.remove(obj);
		subGroup.add(obj);
	};
	return subGroup;
}
//Referencias de los id's
var createSubTreeAux =function(node,subGroup){
	// AÑADÍ && node.refSquare != null
	if (node.refSquare != -1 && node.refSquare != null){// && node.isCompress  == false) {
		// AÑADÍ .id
		obj=group.getObjectById(node.refSquare.id);
		obj.position.x -= subGroup.position.x;
		obj.position.y -= subGroup.position.y;
		obj.position.z -= subGroup.position.z;
		group.remove(obj);
		subGroup.add(obj);
		// AÑADÍ && node.refCone != null
		if (node.refCone != -1 && node.refCone != null) {
			// AÑADÍ .id
			obj=group.getObjectById(node.refCone.id);
			obj.position.x -= subGroup.position.x;
			obj.position.y -= subGroup.position.y;
			obj.position.z -= subGroup.position.z;
			group.remove(obj);
			subGroup.add(obj);
		};
		// AÑADÍ && node.refMark != null
		if (node.refMark != -1 && node.refMark != null) {
			// AÑADÍ .id
			obj=group.getObjectById(node.refMark.id);
			obj.position.x -= subGroup.position.x;
			obj.position.y -= subGroup.position.y;
			obj.position.z -= subGroup.position.z;
			group.remove(obj);
			subGroup.add(obj);
		};
		if (node.isCompress == true) {
			// AÑADÍ .id
			obj=group.getObjectById(node.refSphere.id);
			obj.position.x -= subGroup.position.x;
			obj.position.y -= subGroup.position.y;
			obj.position.z -= subGroup.position.z;
			group.remove(obj);
			subGroup.add(obj);
		};
		for (var i = 0; i < node.children.length; i++) {
			createSubTreeAux(node.children[i],subGroup);
		};
	}
	else{
		// AÑADÍ .id
		obj=group.getObjectById(node.refSphere.id);
		obj.position.x -= subGroup.position.x;
		obj.position.y -= subGroup.position.y;
		obj.position.z -= subGroup.position.z;
		group.remove(obj);
		subGroup.add(obj);
	};
}
//Referencias de los id's
var addSubTree =function(subGroup){
	for (var i = subGroup.children.length - 1; i >= 0; i--) {
		var vector = new THREE.Vector3();
		var matrix = new THREE.Matrix4();
		var nodeAux = subGroup.children[i];
		nodeAux.localToWorld(vector);

		subGroup.remove(nodeAux);
		group.add(nodeAux);
		nodeAux.applyMatrix(subGroup.matrixWorld);
		nodeAux.position.x = vector.x; 
		nodeAux.position.y = vector.y;
		nodeAux.position.z = vector.z;
	};
}