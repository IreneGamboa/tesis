(function () {
	TooltipManager = {
		tooltipContainer : $('.tooltip-container'),
		tooltip_src: $('#tooltip-template'),
	}
})(); 

(function () {
	CardManager = {

		cardContainer : $('.card-container'),
		card_src: $('#card-template'),



		init: function () {

			this.initProperties();
			this.timeout;

			$('#toolkit').draggable();
			
			$('#toolkit-show-btn').on('click', function() {
				if($('#toolkit').hasClass('hide-toolkit')){
					$('#toolkit').fadeIn('fast', function() {
						$('#toolkit').toggleClass('hide-toolkit');	
					});
				}else{
					$('#toolkit').fadeOut('fast', function() {
						$('#toolkit').toggleClass('hide-toolkit');	
					});
				}
			});

			$('#close-toolkit-btn').on('click', function() {
				$('#toolkit').fadeOut('fast', function() {
					$('#toolkit').addClass('hide-toolkit');	
				});
			});

			/*$('#toolkit-compress-btn').on('click', function() {
				if (subGroup.children.length != 0) {
		        	addSubTree(subGroup);	
		        };
		        var firstNode = compress(group,nodesArray);
		        if (firstNode != -1) {
		        	nodesArray = [firstNode];	
		        };
			});
			$("#toolkit-expand-btn").on('click',function() {
				if (subGroup.children.length != 0) {
		        	addSubTree(subGroup);	
		        };
		       	expand(nodesArray[0]);
				nodesArray = [];
			});
			$("#toolkit-lspin-btn").mousedown(function() {
				timeout = setInterval(function(){
			        subGroup.rotation.y += 3*(Math.PI/180);
			    }, 10);
			});
			$("#toolkit-lspin-btn").mouseup(function(){
			    clearInterval(timeout);
			});
			$("#toolkit-rspin-btn").mousedown(function() {
				timeout = setInterval(function(){
			        subGroup.rotation.y -= 3*(Math.PI/180);
			    }, 10);
			});
			$("#toolkit-rspin-btn").mouseup(function(){
			    clearInterval(timeout);
			});
			$("#toolkit-prune-btn").on('click',function() {
				prune(group,nodesArray);
				nodesArray = [];
			});*/

		},

		initProperties: function () {

			//class compress, just the header of the card
			//class expand, card without all the info
			//class show-more, card with all the info
			CardManager.cardContainer.delegate('.modalDialog .compress-card-btn', 'click', function() {
				$this = $(this);
				if($this.parents('.modalDialog').hasClass('expand')){
					$this.parents('.modalDialog').switchClass('expand','compress');
				}else{
				 	$this.parents('.modalDialog').switchClass('show-more','compress');
				}
				$this.switchClass('compress-card-btn','expand-card-btn');
			});

			CardManager.cardContainer.delegate('.modalDialog .expand-card-btn', 'click', function() {
				$this = $(this);
				$this.parents('.modalDialog').switchClass('compress','expand');
				$this.switchClass('expand-card-btn','compress-card-btn');
			});

			CardManager.cardContainer.delegate('.modalDialog .close-card-btn', 'click', function() {
				$this = $(this);
				$this.parents('.modalDialog').remove();
				var modalId = $this.parents('.modalDialog').data('id');
				//borrar

			});

			CardManager.cardContainer.delegate('.modalDialog .show-more-btn', 'click', function() {
				$this = $(this);
				if($this.parents('.modalDialog').hasClass('expand')){
					$this.parents('.modalDialog').switchClass('expand','show-more');
				}else{
					$this.parents('.modalDialog').switchClass('show-more','expand');
				}
			});
			CardManager.cardContainer.delegate('.modalDialog .mark-card-btn', 'click', function() {
				$this = $(this);
				var modalId = $this.parents('.modalDialog').data('id');
				API.mark(modalId).then((r)=>{
					// Search the reference in bCardsOpened list to set the mark
					if(getCardRef(modalId) != null)
						getCardRef(modalId).mark();
					else{
						// Is a heavyweight becasuse this funciton should check all the nodes of the user.
						let node = getNodeRef(modalId);
						node[0].isMarked = !node[0].isMarked;

						if(node[1] == true){
							// Just if the card is in the current tree, we reload
							Graphic.deleteElements();
							TM.mainTree.clean();
							TM.mainTree.show();
							setDisable();
							loadForest(TM.forest);
						}
					}
					// Set the corret star
					var baseCard = $('[data-id=' +modalId+']').find("div.modal-header").find("div.btn-group").find("button.mark-card-btn").children()[0];
					var str = '/assets/img/Star.png';
					if (r.isMarked) {
						str = '/assets/img/Star 2.png';
					};
					baseCard.src = str;

				});
			});
			CardManager.cardContainer.delegate('.modalDialog', 'click', function() {
				$this = $(this);

			 	playSelect();
			 	if ($this.hasClass('selectedCard')) {
				  	$this.parent().find('div').removeClass('selectedCard');
				  } else{
				  	$this.parent().find('div').removeClass('selectedCard');
				  	$this.addClass('selectedCard');	
				  	playSelect();
				  };
			 });
		}
	}

	CardManager.init();
})();

function animateCard( event ) {
	if (controler.select!= null && controler.select.isCompress == false) {
		
		var cardGeometry = new THREE.PlaneGeometry(50, 75);
		var cardMaterial = new THREE.MeshBasicMaterial({
			color: 0x666666,
			opacity: 0.5
		});
		var card = new THREE.Mesh( cardGeometry, cardMaterial );
		card.position.x = 0;
		card.position.y = 0;
		card.position.z = 0;
		//card.position.copy( intersects[ 0 ].point );
		
		var objSelected = subGroup.getObjectById(controler.select.refSquare.id);
		
		card.applyMatrix(objSelected.matrixWorld);
		scene.add(card);

		new TWEEN.Tween( card.position ).to( {
		x: camera.position.x,
		y: camera.position.y,
		z: camera.position.z - 200 }, 1000 )
		.easing( TWEEN.Easing.Linear.None).start();

		new TWEEN.Tween( card.rotation ).to( {
		x: camera.rotation.x,
		y: camera.rotation.y,
		z: camera.rotation.z }, 1000 )
		.easing( TWEEN.Easing.Linear.None).start();
		

		scene.remove(card);

		var auxData =
		{
			modalId:controler.select._id,
			title:controler.select.validName,
			imageSrc:controler.select.img_src,
			desc:controler.select.description,
			url: ( (controler.select.url != "")?controler.select.url:"http://www.google.com" ), 
			ref: controler.select
		};
		bCardsOpened.push(auxData);

		var card_template = Handlebars.compile( CardManager.card_src.html() );

		var lastOpenedCard = getLast(bCardsOpened);
		CardManager.cardContainer.append( card_template(lastOpenedCard));
		$('.modalDialog').addClass('show');
		$('.modalDialog').draggable({handle: ".modal-header"});

		var baseCard = $('[data-id=' +controler.select._id+']').find("div.modal-header").find("div.btn-group").find("button.mark-card-btn").children()[0];
		var str = '/assets/img/Star.png';
		if (controler.select.isMarked) {
			str = '/assets/img/Star 2.png';
		};
		baseCard.src = str;
	}
}

function getLast(array) {
	if(array){
		return array[array.length-1];
	}
}

function getCardRef(id){
	for (var i = bCardsOpened.length - 1; i >= 0; i--) {
		if(bCardsOpened[i].modalId == id){
			return bCardsOpened[i].ref;
		}
	}
	return null;
}

function getNodeRef(id){
	let mt = getNodeRefAux(id, TM.mainTree);
	if( mt != null && mt != undefined){
		return [mt, true];
	}

	for (var i = TM.forest.length - 1; i >= 0; i--) {
		mt = getNodeRefAux(id, TM.forest[i]);
		if( mt != null && mt != undefined){
			return [mt, false];
		}
	}
}

function getNodeRefAux(id, tree){
	if(tree._id == id){
		return tree
	}
	else{

		for (var i = tree.children.length - 1; i >= 0; i--) {
			let mt = getNodeRefAux(id, tree.children[i]);
			if( mt != null && mt != undefined){
				return mt;
			}
		}

	}
}


function openBC( obj ) {
	var cardGeometry = new THREE.PlaneGeometry(50, 75);
	var cardMaterial = new THREE.MeshBasicMaterial({
		color: 0x666666,
		opacity: 0.5
	});
	var card = new THREE.Mesh( cardGeometry, cardMaterial );
	card.position.x = 0;
	card.position.y = 0;
	card.position.z = 0;
	scene.add(card);

	new TWEEN.Tween( card.position ).to( {
	x: camera.position.x,
	y: camera.position.y,
	z: camera.position.z - 200 }, 1000 )
	.easing( TWEEN.Easing.Linear.None).start();

	new TWEEN.Tween( card.rotation ).to( {
	x: camera.rotation.x,
	y: camera.rotation.y,
	z: camera.rotation.z }, 1000 )
	.easing( TWEEN.Easing.Linear.None).start();
	scene.remove(card);
	
	createCard(obj);
}

function createCard( obj ) {
	var auxData =
	{
		modalId:obj._id,
		title:obj.validName,
		imageSrc:obj.img_src,
		desc:obj.description,
		url: ( (obj.url != "")?obj.url:"http://www.google.com" ), 
		ref: null
	};
	bCardsOpened.push(auxData);

	var card_template = Handlebars.compile( CardManager.card_src.html() );

	var lastOpenedCard = getLast(bCardsOpened);
	CardManager.cardContainer.append( card_template(lastOpenedCard));
	$('.modalDialog').addClass('show');
	$('.modalDialog').draggable({handle: ".modal-header"});

	var baseCard = $('[data-id=' +obj._id+']').find("div.modal-header").find("div.btn-group").find("button.mark-card-btn").children()[0];
	var str = '/assets/img/Star.png';
	if (obj.isMarked) {
		str = '/assets/img/Star 2.png';
	};
	baseCard.src = str;
}