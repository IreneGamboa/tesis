/* Retorna el nodo lógico seleccionado a partir del **ID**(no se pasa el id) que puede ser buscado por: refCone, redSquare, redMark, refSphere o _id */
function getIndex (tree,idGra) {
	// || tree._id === idGra // porqué?
	if (tree.refCone === idGra || tree.refSquare === idGra || tree.refMark === idGra || tree.refSphere === idGra) {
		return tree;
	} 
	else{
		for (var i = 0; i < tree.children.length; i++) {
			var aux = getIndex(tree.children[i],idGra);
			if (Object.keys(aux).length !== 0) {
				return aux;
			};
		};
		return {};
	};
}
