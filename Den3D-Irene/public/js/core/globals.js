'use strict'

var container, scene, camera, renderer, controls, stats, globalColor,material; // Variables de ambiente de ThreeJS
var keyboard = new THREEx.KeyboardState(); // Variable para elemento de teclado de ThreeJS
THREE.ImageUtils.crossOrigin = '';
var group = new THREE.Object3D();	//Se crea un grupo vacio en cual se almacenan los objetos.
var subGroup = new THREE.Object3D();	//Se crea un grupo vacio en cual se almacenan los objetos.

var objects = []; // Lista con los objetos gráficos creados por ThreeJS
var opacityLevel = 0.5; // Nivel de opacidad del ambiente, inicializado en 0.5

var principalTree = null; // Representación lógica del árbol que esta desplegado en el área de trabajo

//var nodesArray = []; // Arreglo de nodos 
//var nodesCompress =[];
var parEsfera = {}; // Objeto para los parámetros de una esfera al momento de crearla
var procesing = false;
var bCardsOpened = []; // Arreglo de las baseball card abiertas
var tooltipsOpened = []; // Arreglo de los tooltips abiertos
var nodesMarked = []; // Arreglo con los nodos marcados
var nodesMarkedSorted = []; // Arreglo con los nodos marcados ordenados
var flagUndo = null; // Bandera que indica si se puede realizar un Undo
var flagAlphabetic = false; // Bandera que indica si se la lista de nodos marcados se encuentra en orden alfabético
var flagCrono = false; // Bandera que indica si se la lista de nodos marcados se encuentra en orden cronológico
var arrayUndo = []; // Arreglo que contiene los ID de los nodos para realizar el Undo

// Usuario de Prueba
var user = {
	_id : "",
    name : "",
    lastName : "",
    email : "",
    password : "",
    type : "",
    treeSelected : "",
    defaultColor : 0x0B2161,
    selectColor :  0xB40404,
    sphereColor :  0x8A4B08,
    forestSelected: null 
};

var controler = {}; // Controlador 
controler.select = {}; // Objeto lógico que representa cuál nodo está siendo seleccionado en el árbol principal
controler.move = {}; // Objeto lógico que representa cuál nodo está en moviento en el árbol principal
var isFrozen = false; // Bandera que indica que el sistema está esperando para la próxima actualización gráfica 
var gradesRotated = 0; // Grados que ha rotado el grupo desde que se inicializó
var saveStructure = { // Información gráfica del grupo a guardar
	camera: 		{x:0, y:0, z:0},
	rotation:       {x:0, y:0},
	opacity:        opacityLevel,
	tree:           controler.select
};
var isMoved = true; // Bandera que indica si se ha cambiado la posición del grupo

var CardManager; // Controlador de la Baseball Card
var TooltipManager; // Controlador del Tooltip

let TM = new TreeManager(null, null);