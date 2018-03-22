/*Esta función apartir de un nodo pinta esté y todos sus decendientes.
  Recibe:
	node: Es la referencia al controler.select, la cual contiene la referencia,
	al subconjunto de nodos selecionados.
*/
function Paint(node){
	if (node.isCompress) {
		// AÑADÍ .id
		obj = group.getObjectById(node.refSphere.id);
		if (typeof obj != "undefined") {
			obj.material.color.setHex(user.selectColor);
		}
	}
	else{
		// AÑADÍ && node.refCone != null
		if (node.refCone != -1 && node.refCone != null) {
			// AÑADÍ .id
			obj = group.getObjectById(node.refCone.id);
			if (typeof obj != "undefined") {
				obj.material.color.setHex(user.selectColor);
			}
			for (var i = 0; i < node.children.length; i++) {
				Paint(node.children[i]);
			};
		}	
	}
}

/*Esta función apartir de un nodo despinta esté y todos sus decendientes.
  Recibe:
	node: Es la referencia al controler.select, la cual contiene la referencia,
	al subconjunto de nodos selecionados.
*/
function discolor(node){
	if (node.isCompress) {
		// AÑADÍ .id
		obj=group.getObjectById(node.refSphere.id);
		if (typeof obj != "undefined") {			
			obj.material.color.setHex(user.sphereColor);		
		}
	}
	else{
		// AÑADÍ && node.refCone != null
		if (node.refCone != -1 && node.refCone != null) {
			// AÑADÍ .id
			obj=group.getObjectById(node.refCone.id);
			if (typeof obj != "undefined") {
				obj.material.color.setHex(user.defaultColor);
			}
			for (var i = 0; i < node.children.length; i++) {
				discolor(node.children[i]);
			};
		}	
	}
}

/*Esta función apartir de un nodo aumenta la opacidad del árbol.
  Recibe:
	opacityLevel: nivel de opacidad
	group: árbol.
*/
function opacity(opacityLevel,group){
	if (0.2 <= opacityLevel && opacityLevel <= 1) {
		for (var i = group.children.length - 1; i >= 0; i--) {
			if (group.children[i].type === "Object3D") {				
				for (var j = group.children[i].children.length - 1; j >= 0; j--) {					
					if(group.children[i].children[j].geometry.type !== "PlaneBufferGeometry"){
						group.children[i].children[j].material.opacity = opacityLevel;
					};
				};
			}
			else{
				if(group.children[i].geometry.type !== "PlaneBufferGeometry"){
					group.children[i].material.opacity = opacityLevel;
				};
			};
		};
	};
}

/* Durante la expansión, se toma el sub grupo y se hace una animación de desde el nivel más alto de opacidad
   hasta el que posee el grupo */
function makeOpacity () {
		subGroup.visible = false;
		var par ={
			radio: 16,
			x:subGroup.position.x,
			y:subGroup.position.y - 8,
			z:subGroup.position.z
		};
		var sphere = createSphere(par);
		group.add(sphere);
		sphere.material.color.setHex(0xFF0000);
		sphere.material.opacity = 1;
		for (var i = 0; i < subGroup.children.length; i++) {
			subGroup.children[i].material.opacity = 0;
		};
		subGroup.visible = true;
		setTimeout(function(){ 
			group.remove(sphere);
			for (var i = subGroup.children.length - 1; i >= 0; i--) {
				var level = opacityLevel;
				if (subGroup.children[i].geometry.type === "PlaneBufferGeometry") {
					level = 1;
				};
				new TWEEN.Tween(subGroup.children[i].material)
					.to({opacity:level},1000)
					.easing(TWEEN.Easing.Linear.None)
				.start();
			};
		 }, 500);		
}

/* Animación de difuminación para un subgrupo */
function fadeSubGroup(){
	for (var i = subGroup.children.length - 1; i >= 0; i--) {
		new TWEEN.Tween(subGroup.children[i].material)
			.to({opacity:0},1000)
			.easing(TWEEN.Easing.Linear.None)
		.start();
	};
}

/* Animación de difuminación para un grupo */
function fadeGroup(){
	for (var i = group.children.length - 1; i >= 0; i--) {
		if (!(group.children[i].id == subGroup.id)) {
			new TWEEN.Tween(group.children[i].material)
			.to({opacity:0},1000)
			.easing(TWEEN.Easing.Linear.None)
			.start();	
		};
	};
}

/* Función para rotar un sub grupo seleccionado */
function moveSubGroup(x,y,z){
	new TWEEN.Tween(subGroup.position).to({
		x:x,
		y:y,
		z:z
	},1000).easing(TWEEN.Easing.Linear.None).start();
}

/* Pinta una hoja seleccionada */
function paintLeaf(node){
	// AÑADÍ && node.refSquare != null
	if (node.refSquare !== -1 && node.refSquare != null) {
		var graf = group.getObjectById(node.refSquare.id);
		graf.material.color.setHex(user.selectColor);
	};
}

/* Despinta una hoja seleccionada */
function discolorLeaf(node){
	// AÑADÍ && node.refSquare != null
	if (node.refSquare !== -1 && node.refSquare != null) {
		var graf = group.getObjectById(node.refSquare.id);
		if (typeof graf !== 'undefined') {
			graf.material.color.setHex(0xFFFFFF);	
		};
	}
}