/* Función que determina y realiza las rotaciones necesarias 
   en el Eje X y Eje Y de los sub árboles y el árbol para traer
   una ficha seleccionada al frente de la pantalla */
function bringToFront(){
	var node = controler.select;
	//if (typeof(father) == "undefined" || father == null){
	//	alert("entro");
	//	return;
	//}	
	if (Object.keys(node).length !== 0) {
		var father = node.parent;
		if (typeof(father) != "undefined" && father != null) {
			var grandFather = father.parent;

			render();
			addSubTree(subGroup);
			group.remove(subGroup);
			
			subGroup = createSubTree(father);
			group.add(subGroup);

			
			var obj_H = subGroup.getObjectById(node.refSquare.id);
			var obj_P = subGroup.getObjectById(father.refSquare.id);
			
			var vector_H = new THREE.Vector3();
			var vector_P = new THREE.Vector3();
			var vector_A = new THREE.Vector3();

			obj_H.localToWorld(vector_H);
			obj_P.localToWorld(vector_P);

			var recta_P_H = createStraight(vector_P,vector_H);
			
			var direc;

			var angle;
			
			if (typeof(grandFather) != "undefined" && grandFather != null) {
				
				var obj_A = group.getObjectById(grandFather.refSquare.id);
				obj_A.localToWorld(vector_A);			
				direc = getDirection(node,vector_A,vector_H);
				var recta_A_P = createStraight(vector_A,vector_P);				
				angle = getAngle(recta_A_P,recta_P_H);							

			} else{
				
				camera.localToWorld(vector_A);
				direc = getDirection(node,vector_A,vector_H) * -1;
				var recta_A_P = createStraight(vector_A,vector_P);
				
				angle = getAngle(recta_A_P,recta_P_H);
				angle = Math.PI-angle;
			};

			angle = direc * angle;

			if (isNaN(angle)){
				window.alert(angle);
				return;
			}

			
			new TWEEN.Tween(subGroup.rotation)
					.to({y:angle},1000)
					.easing(TWEEN.Easing.Linear.None)
			.start();

			setTimeout(function(){
					controler.select = father;
					bringToFront();
				}, 1000);
		} else{								
			var obj_R = subGroup.getObjectById(node.refSquare.id);
			var obj_N = subGroup.getObjectById(controler.first.refSquare.id);
			var obj_C = camera;

			var vector_R = new THREE.Vector3();
			var vector_N = new THREE.Vector3();
			var vector_C = new THREE.Vector3();

			obj_R.localToWorld(vector_R);
			obj_N.localToWorld(vector_N);
			obj_C.localToWorld(vector_C);

			var recta_R_N = [vector_R.y-vector_N.y,vector_R.z-vector_N.z];
			var recta_R_C = [vector_R.y-vector_C.y,vector_R.z-vector_C.z];
			
			var angleX = getAngle(recta_R_N,recta_R_C);
			angleX = -angleX;
			var newX = ((Math.floor(group.rotation.x/(2 * Math.PI))))*2 * Math.PI;
			angleX += newX;
			//if (angleX > -0.9 && angleX < -0.7){
			//	angleX += 0.5
			//} 
			
			new TWEEN.Tween(group.rotation)
				.to({x:angleX},1000)
			.easing(TWEEN.Easing.Linear.None)
			.start();
			
			controler.select = controler.first;
			focusLamina();
		};
	} 
}

/*Función que recibe un nodo lógico y el vector de la raiz,
y determina la dirección en la cual tiene que rotar.
El nodo tiene que estar dentro del sub-arbol correspondiente.*/
function getDirection (node,vectorP,vector_H) {
	var objGra = subGroup.getObjectById(node.refSquare.id);
	var vector = new THREE.Vector3();

	subGroup.rotation.y += (Math.PI/180);
	render();
	objGra.localToWorld(vector);
	
	var distanciaIn = vectorP.distanceTo(vector_H);
	var distanciaSeg = vectorP.distanceTo(vector);	
	
	subGroup.rotation.y -= (Math.PI/180);
	if (distanciaIn < distanciaSeg) {
		render();
		return 1;
	} else{
		render();
		return -1;
	};
}

/* Función que retorna el ángulo entre una recta V y una recta U */
function getAngle(V,U){
	if (U[0] == 0 && U[1] == 0){
		return 0;
	}
	var nume = (V[0]*U[0])+(V[1]*U[1]);
	var denoP = Math.pow(V[0],2)+Math.pow(V[1],2);
	var denoS = Math.pow(U[0],2)+Math.pow(U[1],2);
	var resul = (nume)/(Math.sqrt(denoP) * Math.sqrt(denoS));
	if (resul > 1) {
		resul = 1;
	} else if(resul < -1){
		resul = -1;
	};
	return Math.acos(resul);
}

/* Función que retorna la recta que existe de un nodo V a un nodo U */
function createStraight(V,U){
	return [V.x-U.x,V.z-U.z];
}

/* Funcion que crea y retorna una lista con todas las hojas de un árbol */
function nextLeaf(node){
 var list = [];
 if (node !== null) {
 	for (var i=0; i < node.children.length; i++){
		list = list.concat(nextLeaf(node.children[i]));
	}
	if (node.children.length == 0){
		list.push(node);
	}
 };
 return list;
}

/* Función que busca y retorna la hoja anterior a una hoja seleccionada */
function buscarNodoAnterior(node){
	
	var nodo = TM.preList()[TM.mainTree._id].indexOf(node);
	if (nodo == TM.preList()[TM.mainTree._id].length-1 || nodo === -1){
		nodo = 0;
	} else {
		nodo = nodo + 1;
	};
	var next = TM.preList()[TM.mainTree._id][nodo];
	
	return next;
	
}

/* Función que busca y retorna la hoja siguiente a una hoja seleccionada */
function buscarNodoSiguiente(node){
	
	var nodo = TM.preList()[TM.mainTree._id].indexOf(node);
	if (nodo == 0 || nodo === -1){
		nodo = TM.preList()[TM.mainTree._id].length-1;
	} else {
		nodo = nodo - 1;
	};
	var prev = TM.preList()[TM.mainTree._id][nodo];
	
	return prev;
	
}

/* Función que determina y realiza las rotaciones necesarias 
   en el Eje X de los sub árboles y el árbol para traer el nodo
   siguiente o anterior de una ficha seleccionada al frente de la pantalla
   Recibe:
   	angleRotation: Variable que indica si se pide el siguiente o el anterior */
function bringNextPrev(angleRotation){

	var node = controler.select;
	
	if (Object.keys(node).length !== 0) {
		var father = node.parent;
		if (typeof(father) != "undefined" && father != null) {
			var grandFather = father.parent;

			var x = group.rotation.x;
			var y = group.rotation.y;
			var z = group.rotation.z;

			group.rotation.x = 0;
			group.rotation.y = 0;
			group.rotation.z = 0;

			render();
			addSubTree(subGroup);
			group.remove(subGroup);

			group.rotation.x = x;
			group.rotation.y = y;
			group.rotation.z = z;

			if (Object.keys(node).length !== 0) {
				discolor(node);	
			};

			
			subGroup = createSubTree(father);
			group.add(subGroup);

			
			var obj_H = subGroup.getObjectById(node.refSquare.id);
			var obj_P = subGroup.getObjectById(father.refSquare.id);
			
			var vector_H = new THREE.Vector3();
			var vector_P = new THREE.Vector3();
			var vector_A = new THREE.Vector3();

			obj_H.localToWorld(vector_H);
			obj_P.localToWorld(vector_P);

			var recta_P_H = createStraight(vector_P,vector_H);

			var direc;

			var angle;
			
			if (typeof(grandFather) != "undefined" && grandFather != null) {
				var obj_A = group.getObjectById(grandFather.refSquare.id);
				obj_A.localToWorld(vector_A);
				direc = getDirection(node,vector_A,vector_H);
				var recta_A_P = createStraight(vector_A,vector_P);
				angle = getAngle(recta_A_P,recta_P_H);

			} else{
				
				camera.localToWorld(vector_A);
				direc = getDirection(node,vector_A,vector_H);
				var recta_A_P = createStraight(vector_A,vector_P);
				
				angle = getAngle(recta_A_P,recta_P_H);
				angle = Math.PI-angle;
			};

			angle = direc * angle;

			if (angleRotation === -1 && angle > 0){
				angle = -angle;
			}

			if (angleRotation === 1 && angle < 0){
				angle = -angle;
			}
			
			new TWEEN.Tween(subGroup.rotation)
					.to({y:angle},1000)
					.easing(TWEEN.Easing.Linear.None)
			.start();

			setTimeout(function(){
				document.addEventListener("keydown", keydown,true);
				procesing = false;
			}, 1050);
		} else{
			
			var obj_R = subGroup.getObjectById(node.refSquare.id);
			var obj_N = subGroup.getObjectById(controler.first.refSquare.id);
			var obj_C = camera;

			var vector_R = new THREE.Vector3();
			var vector_N = new THREE.Vector3();
			var vector_C = new THREE.Vector3();

			obj_R.localToWorld(vector_R);
			obj_N.localToWorld(vector_N);
			obj_C.localToWorld(vector_C);

			var recta_R_N = [vector_R.y-vector_N.y,vector_R.z-vector_N.z];
			var recta_R_C = [vector_R.y-vector_C.y,vector_R.z-vector_C.z];
			
			var angleX = getAngle(recta_R_N,recta_R_C);

			angleX = -angleX;
			
			new TWEEN.Tween(group.rotation)
				.to({x:angleX},1000)
			.easing(TWEEN.Easing.Linear.None)
			.start();
			
			
			
			controler.select = controler.first;
			focusLamina();
			
		};
	} else{
		
	};
}