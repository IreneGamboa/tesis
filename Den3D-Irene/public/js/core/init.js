'use strict'
/*
let container, scene, camera, renderer, controls, stats, globalColor,material; // Variables de ambiente de ThreeJS
var group = new THREE.Object3D();
var subGroup = new THREE.Object3D();	//Se crea un grupo vacio en cual se almacenan los objetos.
let keyboard = new THREEx.KeyboardState(); // Variable para elemento de teclado de ThreeJS
var opacityLevel = 0.5; // Nivel de opacidad del ambiente, inicializado en 0.5
var saveStructure = { // Información gráfica del grupo a guardar
	camera: 		{x:0, y:0, z:0},
	rotation:       {x:0, y:0},
	opacity:        opacityLevel
	//tree:           controler.select
};
var procesing = false;
var isMoved = true; // Bandera que indica si se ha cambiado la posición del grupo
var objects = []; // Lista con los objetos gráficos creados por ThreeJS
var controler = {}; // Controlador
controler.select = {}; // Objeto lógico que representa cuál nodo está siendo seleccionado en el árbol principal
controler.move = {}; // Objeto lógico que representa cuál nodo está en moviento en el árbol principal
*/
let taxones = [];
let limit = 20;
/*
for (var i = 0; i < limit; i++) {
	taxones.push(new Taxon('Node ' + i, null, i, "/images/rana.jpg", "","", false, false, false, false));
}
for (var i = 1; i < 11; i++) {
	taxones[0].add(taxones[i]);
}
for (var i = 11; i < 13; i++) {
	taxones[2].add(taxones[i]);
}

for (var i = 13; i < limit; i++) {
	taxones[12].add(taxones[i]);
}

taxones[1].compress();*/


//startDReady();

//let mainTree = taxones[0];

//let TM = new TreeManager(TreeManager.createReferences(OWdb.root), [taxones[0]]);



//let mainTree = TreeManager.createReferences(OWdb.root);

//let TM = new TreeManager(null, null);


function init()
{
	// ESCENA
	scene = new THREE.Scene();
	// CAMARA
	//Cambio de la altura por la altura menos un procentaje.

	let SCREEN_WIDTH = window.innerWidth;
	let SCREEN_HEIGHT = window.innerHeight;
	let VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;

	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);

	scene.add(camera);

	camera.position.z = 1500;
	camera.position.y = -100;
	camera.lookAt(scene.position);

	// RENDERER
	renderer = new THREE.WebGLRenderer({antialias:true});
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

	container = document.getElementById( 'ThreeJS' );
	container.appendChild( renderer.domElement );

	//Luces
	let light = new THREE.AmbientLight( 0x404040 );
	scene.add( light );
	let directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
	directionalLight.position.set( 0, 100, 0 );
	scene.add( directionalLight );
	let directionalLight2 = new THREE.DirectionalLight( 0xffffff, 0.5 );
	directionalLight2.position.set( 0,-1000, 0 );
	scene.add( directionalLight2 );
	let directionalLight3 = new THREE.DirectionalLight( 0xffffff, 0.5 );
	directionalLight3.position.set( 0,0,700 );
	scene.add( directionalLight3 );
	scene.add(group);

	container.addEventListener( 'dblclick', animateCard, false );

	container.addEventListener( 'mousedown', onDocumentMouseDown, false );

	document.addEventListener("keydown", keydown,true);

	animate();
}
function render()
{
	TWEEN.update();
	renderer.render( scene, camera );
}

function removeTooltip() {
	//$('.tooltip').addClass('hide');
}

function update()
{
	var grados = 3*(Math.PI/180);

	if ( keyboard.pressed("right") )
	{
		console.log(group);
		if (!procesing) {
			removeTooltip();
			group.rotation.y += grados;
			saveStructure.rotation.y += grados;
			isMoved = true;
		};

	}
	else if( keyboard.pressed("down"))
	{
		//$('.tooltip').addClass('hide');
		if (!procesing) {
			removeTooltip();
			group.rotation.x += grados;
			saveStructure.rotation.x += grados;
			isMoved = true;
		};

	}
	else if( keyboard.pressed("left"))
	{
		console.log(group);
		//$('.tooltip').addClass('hide');
		if (!procesing) {
			removeTooltip();
			group.rotation.y -= grados;
			saveStructure.rotation.y -= grados;
			isMoved = true;
		};

	}
	else if( keyboard.pressed("up"))
	{
		//$('.tooltip').addClass('hide');
		if (!procesing) {
			removeTooltip();
			group.rotation.x -= grados;
			saveStructure.rotation.x -= grados;
			isMoved = true;
		};

	}

	else if( keyboard.pressed("a"))
	{
		if (!procesing) {
			removeTooltip();
			camera.position.z += 15;
			isMoved = true;
		};

	}
	else if( keyboard.pressed("z"))
	{
		if (!procesing) {
			removeTooltip();
			camera.position.z -= 15;
			isMoved = true;
		};

	}
}

function onDocumentMouseDown( event ) {
	isMoved = true;
	var raycaster = new THREE.Raycaster();
	event.preventDefault();
	var vector = new THREE.Vector3();
	vector.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
	vector.unproject(camera );
	raycaster.ray.set( camera.position, vector.sub( camera.position ).normalize() );
	var intersects = raycaster.intersectObjects( objects );

	var x = group.rotation.x;
	var y = group.rotation.y;

	group.rotation.x = 0;
	group.rotation.y = 0;

	render();
	addSubTree(subGroup);
	group.remove(subGroup);
	group.rotation.x = x;
	group.rotation.y = y;

	if (Object.keys(controler.select).length !== 0) {
		discolorLeaf(controler.select);
		discolor(controler.select);
	};

	controler.select = {};

	if(intersects.length > 0){
		controler.select = getIndex( TM.mainTree ,intersects[0].object);
		playSelect();
		paintLeaf(controler.select);
		Paint(controler.select);
		subGroup = createSubTree(controler.select);
		group.add(subGroup);
	}

	setDisable();
}


function animate()
{
	requestAnimationFrame( animate );
	render();
	update();
}

function keydown(e){
	console.log(e.keyCode);
		var grades = 3*(Math.PI/180);
	    if(e.keyCode === 66) { // B
			//alert("Traer al frente");
			if (controler.select.parent !== null) {
				traerAlFrente();
			} ;
		}
		if(e.keyCode === 67) { // C
			Commander.compress();
		}
		if(e.keyCode === 84) { // T
			var radius = controler.select.radiusBottom,
					coneFather = {
						"x": controler.select.parent.x,
						"y": controler.select.parent.y,
						"z": controler.select.parent.z
					},
					cone = {
						"x": controler.select.x,
						"y": controler.select.y,
						"z": controler.select.z
					},
					center = {
						"x": controler.select.parent.x,
						"y": controler.select.parent.y + 100,
						"z": controler.select.parent.z
					},
					rotation = getRotation(radius, coneFather, cone, center, -15);
			console.log("Rotation: ");
			console.log(rotation)
			console.log("Contoller: ")
			console.log(controler.select);
			debugger;
			console.log("subGroup: ")
			console.log(subGroup);
			subGroup.rotation.z -= rotation.z;
			subGroup.rotation.y -= rotation.y;
			subGroup.rotation.x -= rotation.x;
		}
		if(e.keyCode === 88) { // X
			// AÑADÍ controler.select
			if (controler.select != null && controler.select.children.length > 0) {
				subGroup.rotation.y -= grades;
				controler.select.gradesRotation  -= grades;
			};
		}
		if(e.keyCode === 83) { // S
			// AÑADÍ controler.select
			if (controler.select != null && controler.select.children.length > 0) {
				subGroup.rotation.y += grades;
				controler.select.gradesRotation  += grades;
			};
		}
		if(e.keyCode === 69) { // E
			Commander.expand();
		}
		if(e.keyCode === 80) // P
		{
			Commander.snip();
		}
		if(e.keyCode === 82) // R
		{
			Commander.prune();
		}
		if(e.keyCode === 46) // [DEL]
		{
			Commander.delete();
		}
		if(e.keyCode === 77) // M
		{
			alert("menu");
			//mostrarMenu();
		}
		if(e.keyCode === 87) // W
		{
			decreaseOpacity();
		}
		if(e.keyCode === 81) // Q
		{
			increaseOpacity();
		}
		if(e.keyCode === 70) // F
		{
			document.removeEventListener("keydown", keydown,true);
			procesing = true;
			discolorLeaf(controler.select);
			discolor(controler.select);
			controler.first = controler.select;
			controler.select = buscarNodoSiguiente(controler.select);
			paintLeaf(controler.select);
			if(controler.select.parent != controler.first.parent || isMoved){
				controler.first = controler.select;

				group.rotation.x = group.rotation.x%(2 * Math.PI);
				group.rotation.y = group.rotation.y%(2 * Math.PI);

				var newY = 0;
				var newX = 0;

				if (0 <= group.rotation.x && Math.PI >= group.rotation.x || 0 > group.rotation.x && -Math.PI <= group.rotation.x){
					newX = 0;
				}
				else if (group.rotation.x < -Math.PI && group.rotation.x >= -2*Math.PI ) {
					newX = -(2*Math.PI);
				} else {
					newX = 2*Math.PI;
				}

				if (0 <= group.rotation.y && Math.PI >= group.rotation.y || 0 > group.rotation.y && -Math.PI <= group.rotation.y){
					newY = 0;
				}
				else if (group.rotation.y < -Math.PI && group.rotation.y >= -2*Math.PI ) {
					newY = -(2*Math.PI);
				} else {
					newY = 2*Math.PI;
				}

				let zoom = TM.mainTree.diameter + 2000;

				isMoved = false;

				new TWEEN.Tween(group.rotation)
					.to({x:newX,y:newY},1000)
				.easing(TWEEN.Easing.Linear.None)
				.start();

				new TWEEN.Tween(camera.position)
					.to({z:zoom},1000)
				.easing(TWEEN.Easing.Linear.None)
				.start();

				setTimeout(function(){
					bringToFront();
				}, 1050);
			} else {
				let angle = -1;
				bringNextPrev(angle);
			}
		}
		if(e.keyCode === 68) // D
		{
			document.removeEventListener("keydown", keydown,true);
			procesing = true;
			discolorLeaf(controler.select);
			discolor(controler.select);
			controler.first = controler.select;
			controler.select = buscarNodoAnterior(controler.select);
			paintLeaf(controler.select);
			if(controler.select.parent != controler.first.parent || isMoved){
				controler.first = controler.select;

				group.rotation.x = group.rotation.x%(2 * Math.PI);
				group.rotation.y = group.rotation.y%(2 * Math.PI);

				var newY = 0;
				var newX = 0;

				if (0 <= group.rotation.x && Math.PI >= group.rotation.x || 0 > group.rotation.x && -Math.PI <= group.rotation.x){
					newX = 0;
				}
				else if (group.rotation.x < -Math.PI && group.rotation.x >= -2*Math.PI ) {
					newX = -(2*Math.PI);
				} else {
					newX = 2*Math.PI;
				}

				if (0 <= group.rotation.y && Math.PI >= group.rotation.y || 0 > group.rotation.y && -Math.PI <= group.rotation.y){
					newY = 0;
				}
				else if (group.rotation.y < -Math.PI && group.rotation.y >= -2*Math.PI ) {
					newY = -(2*Math.PI);
				} else {
					newY = 2*Math.PI;
				}

				let zoom = TM.mainTree.diameter + 2000;

				isMoved = false;

				new TWEEN.Tween(group.rotation)
					.to({x:newX,y:newY},1000)
				.easing(TWEEN.Easing.Linear.None)
				.start();

				new TWEEN.Tween(camera.position)
					.to({z:zoom},1000)
				.easing(TWEEN.Easing.Linear.None)
				.start();

				setTimeout(function(){
					bringToFront();
				}, 1050);
			} else {
				let angle = 1;
				bringNextPrev(angle);
			}
		}
}

function increaseOpacity(){
	if (opacityLevel < 0.9) {
		opacityLevel += 0.1;
		opacity(opacityLevel,group);
	};
}
function decreaseOpacity(){
	if (opacityLevel > 0.3) {
		opacityLevel -= 0.1;
		opacity(opacityLevel,group);
	};
}

function traerAlFrente(){
	document.removeEventListener("keydown", keydown,true);
	procesing = true;
	isMoved = false;

	controler.first = controler.select;
	group.rotation.x = group.rotation.x%(2 * Math.PI);
	group.rotation.y = group.rotation.y%(2 * Math.PI);

	var newY = 0;
	var newX = 0;

	if (0 <= group.rotation.x && Math.PI >= group.rotation.x || 0 > group.rotation.x && -Math.PI <= group.rotation.x){
		newX = 0;
	}
	else if (group.rotation.x < -Math.PI && group.rotation.x >= -2*Math.PI ) {
		newX = -(2*Math.PI);
	} else {
		newX = 2*Math.PI;
	}

	if (0 <= group.rotation.y && Math.PI >= group.rotation.y || 0 > group.rotation.y && -Math.PI <= group.rotation.y){
		newY = 0;
	}
	else if (group.rotation.y < -Math.PI && group.rotation.y >= -2*Math.PI ) {
		newY = -(2*Math.PI);
	} else {
		newY = 2*Math.PI;
	}

	let zoom = TM.mainTree.diameter + 2000;

	new TWEEN.Tween(group.rotation)
		.to({x:newX,y:newY},1000)
	.easing(TWEEN.Easing.Linear.None)
	.start();

	new TWEEN.Tween(camera.position)
		.to({z:zoom},1000)
	.easing(TWEEN.Easing.Linear.None)
	.start();

	setTimeout(function(){
		if (controler.select.parent !== null) {
			bringToFront();
		}else{
			focusLamina();
		};

	}, 1050);
}

function focusLamina(){

  	addSubTree(subGroup);
 	group.remove(subGroup);
  	subGroup = createSubTree(controler.select);
  	group.add(subGroup);

	let zoom = subGroup.position.z + 600;

	new TWEEN.Tween(camera.position)
		.to({z:zoom},1000)
	.easing(TWEEN.Easing.Linear.None)
	.start();

	setTimeout(function(){
		document.addEventListener("keydown", keydown,true);
		procesing = false;
	}, 1050);

}

function getTangent(center, point){
	console.log(center);
	console.log(point);
  var x0 = center.x,
      y0 = center.y,
      x1 = point.x,
      y1 = point.y,
      m,
      b,
      tangent;

  m = (y1-y0)/(x1-x0)
  m = -1/m

  b = y1- m*x1

  tangent = {
    "m": m,
    "b": b
  };

  return tangent;
}

function getPlane(coneFather, center, point, radius) {
  var angle = Math.random()*Math.PI*2,
      newPoint = {
        "x": center.x + Math.cos(angle)*radius,
        "y": center.y,
        "z": center.z + Math.sin(angle)*radius
      };
  newPoint = rotate(newPoint, coneFather.y, coneFather.x, coneFather.z)

  var vX = point.x - center.x,
      vY = point.y - center.y,
      vZ = point.z - center.z,
      wX = newPoint.x - center.x,
      wY = newPoint.y - center.y,
      wZ = newPoint.z - center.z,
      a,b,c,d;

  a = (vY * wZ) - (wY * vZ);
  b = (wX * vZ) - (vX * wZ);
  c = (vX * wY) - (wX * vY);
  d = -((a*center.x)+(b*center.y)+(c*center.z));

  return {
    "a": a,
    "b": b,
    "c": c,
    "d": d
  }

}

function rotate(point,pitch, roll, yaw) {
    var cosa = Math.cos(yaw),
        sina = Math.sin(yaw),
        cosb = Math.cos(pitch),
        sinb = Math.sin(pitch),
        cosc = Math.cos(roll),
        sinc = Math.sin(roll),
        Axx = cosa*cosb,
        Axy = cosa*sinb*sinc - sina*cosc,
        Axz = cosa*sinb*cosc + sina*sinc,
        Ayx = sina*cosb,
        Ayy = sina*sinb*sinc + cosa*cosc,
        Ayz = sina*sinb*cosc - cosa*sinc,
        Azx = -sinb,
        Azy = cosb*sinc,
        Azz = cosb*cosc,
        px = point.x,
        py = point.y,
        pz = point.z;

    point.x = Axx*px + Axy*py + Axz*pz;
    point.y = Ayx*px + Ayy*py + Ayz*pz;
    point.z = Azx*px + Azy*py + Azz*pz;

    return point;
}


function getRotation(radius, coneFather, cone, center, degree) {
  var plane = getPlane(coneFather, center, cone, radius),
      tangent = getTangent(center, cone),
      x0 = 0,
      x1 = 1,
      y0 = tangent.m * x0 + tangent.b,
      y1 = tangent.m * x1 + tangent.b,
      z0 = -(plane.a * x0 + plane.b * y0 + plane.d) / plane.c,
      z1 = -(plane.a * x1 + plane.b * y1 + plane.d) / plane.c,
      xD = Math.sqrt(Math.pow((x0-x1),2)),
      yD = Math.sqrt(Math.pow((y0-y1),2)),
      zD = Math.sqrt(Math.pow((z0-z1),2)),
      length = Math.sqrt(xD^2+yD^2+zD^2),
      xU = xD/length,
      yU = yD/length,
      zU = zD/length,
      xRotation = xU * degree,
      yRotation = yU * degree,
      zRotation = zU * degree;

	debugger;
	console.log(plane);
	console.log(tangent);
  return {
    "x": xRotation,
    "y": yRotation,
    "z": zRotation
  }
}

init();
startDReady();
