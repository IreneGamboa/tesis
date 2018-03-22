

function hoverItem (element,scr) {
	if (!$(element).hasClass('disable')) {
		var imgElement = $(element).find('p').find('img');
		imgElement.attr('src', scr);
	};
}

// Request to server
// to get information about the current user
// to store some relevant information.
function startDReady(){
	$('#markedItems').draggable({handle: ".modal-header-mark"});
	$('#searchModal').draggable({handle: ".modal-header-mark"});
	$('#loading-indicator').show();
	$(document).ajaxSend(function() {
		$('#loading-indicator').show();
	});
	$(document).ajaxComplete(function() {
		$('#loading-indicator').hide();
	});
	// Get the username in HTML
	let email = document.getElementById("userName").innerHTML;

	API.user(email).then((data)=>{
		user._id = data._id;
		user.name = data.name;
		user.lastName = data.lastName;
		user.email = data.email;
		user.type = data.type;
		user.treeSelected = data.treeSelected;

		// Request to get all the trees (Main and tree)
		return API.openWorkbench(user._id, user.treeSelected);
	})
	.then((data)=>{

		user.forestSelected = null;
		controler.select = {};

		// If the user has some tree selected
		if(Object.keys(data.root).length > 0){
			// Convert rootJson to treeLogic
			TM.mainTree = TreeManager.createReferences(data.root);

			TM.preListSet(TM.mainTree._id, nextLeaf(TM.mainTree));

			// Display main tree
			TM.mainTree.show();
		}

		let forestArray = [];

		// Convert rootJson in the forest to treeLogic
		data.sb.forEach((t)=>{
			if(Object.keys(t).length > 0){
				let ftree = TreeManager.createReferences(t);
				forestArray.push( ftree );
				TM.preListSet( ftree._id, nextLeaf(ftree));
			}
		})
		TM.forest = forestArray;		

		setDisable();

		loadForest(TM.forest);

		//prelist = nextLeaf(principalTree);
	});
}

// Help to load the tree forest.
function loadForest(list){
	var div = document.getElementById("forestBar");
	var str = "";
	for (var i = 0; i < list.length; i++) {
		str += '<li onClick="getTreeInForest(this)" id="'+list[i]._id+'"">';
		str += '<img src="'+list[i].img_src+'" class="img-circle" height="50px">';
		str += '<br/>';
		str += '<span>'+list[i].validName+'</span>';
		str += '</li>';
	};
	div.innerHTML = str;
	$("ul[id=forestBar] li").click(function () {
		$that = $(this);
		if ($that.hasClass('treeSelected')) {
			$that.parent().find('li').removeClass('treeSelected');
			user.forestSelected = null;
		}else{
			//$that.parent().find('li').removeClass('treeSelected');
			$that.parent().find('li').removeClass('treeSelected');
			$that.addClass('treeSelected');
			playSelect();  
		};
		setDisable();
	});
};


// Help to select and unselect the a tree in the forest.
function getTreeInForest(span){
	user.forestSelected = span.id;
	setDisable();
}


function setDisable() {
	if (user.forestSelected !== null) {
		$("#changeNodeSpan").parent().removeClass("disable");
		$("#changeNodeSpan img").attr({src: '/assets/img/change.png'});
	}else{
		$("#changeNodeSpan").parent().addClass("disable");
		$("#changeNodeSpan img").attr({src: '/assets/img/changeDisable.png'});

	};
	if (user.forestSelected !== null && Object.keys(controler.select).length !== 0 && controler.select.parent !== null )  {
		$("#linkRight").parent().removeClass("disable");
		$("#linkRight img").attr({src: '/assets/img/Link.png'});
	}else{
		$("#linkRight").parent().addClass("disable");
		$("#linkRight img").attr({src: '/assets/img/linkDisable.png'});
	};
	if (Object.keys(controler.select).length !== 0 && controler.select.parent !== null )  {
		$("#addRight").parent().removeClass("disable");
		$("#addRight img").attr({src: '/assets/img/New Node.png'});
	}else{
		$("#addRight").parent().addClass("disable");
		$("#addRight img").attr({src: '/assets/img/New node Disable.png'});
	};
	if (user.forestSelected !== null && Object.keys(controler.select).length !== 0)  {
		$("#linkNodeSpan").parent().removeClass("disable");
		$("#swapNodeSpan").parent().removeClass("disable");
		$("#linkNodeSpan img").attr({src: '/assets/img/Link.png'});
		$("#swapNodeSpan img").attr({src: '/assets/img/swap.png'});
	}else{
		$("#linkNodeSpan").parent().addClass("disable");
		$("#swapNodeSpan").parent().addClass("disable");
		$("#linkNodeSpan img").attr({src: '/assets/img/linkDisable.png'});
		$("#swapNodeSpan img").attr({src: '/assets/img/swapDisable.png'});
	};
	if (Object.keys(controler.select).length !== 0)  {
		$("#pruneNodeSpan").parent().removeClass("disable");
		$("#snipNodeSpan").parent().removeClass("disable");
		$("#updateNodeSpan").parent().removeClass("disable");
		$("#deleteNodeSpan").parent().removeClass("disable");
		$("#pruneNodeSpan img").attr({src: '/assets/img/prune.png'});
		$("#snipNodeSpan img").attr({src: '/assets/img/snip.png'});
		$("#updateNodeSpan img").attr({src: '/assets/img/Update.png'});
		$("#deleteNodeSpan img").attr({src: '/assets/img/Delete.png'});

	}else{
		$("#pruneNodeSpan").parent().addClass("disable");
		$("#snipNodeSpan").parent().addClass("disable");
		$("#updateNodeSpan").parent().addClass("disable");
		$("#deleteNodeSpan").parent().addClass("disable");
		$("#pruneNodeSpan img").attr({src: '/assets/img/pruneDisable.png'});
		$("#snipNodeSpan img").attr({src: '/assets/img/snipDisable.png'});
		$("#updateNodeSpan img").attr({src: '/assets/img/updateDisable.png'});
		$("#deleteNodeSpan img").attr({src: '/assets/img/deleteDisable.png'});
	};
	if (flagUndo !== null) {
		$("#UndoSpan").parent().removeClass("disable");
		$("#UndoSpan").html('<img src="/assets/img/undo.png">Undo '+flagUndo);
		$("#UndoSpan img").attr({src: '/assets/img/undo.png'});
	}else{
		$("#UndoSpan").parent().addClass("disable");
		$("#UndoSpan").html('<img src="/assets/img/undoDisable.png">Undo');
		$("#UndoSpan img").attr({src: '/assets/img/undoDisable.png'});
 	};
}


// ---------------------------------------------------------------------------
// Search listener
// ---------------------------------------------------------------------------

$("#search").keypress(function( event ) {
	if ( event.which == 13 ) {
		document.addEventListener("keydown", keydown,true);   
		event.preventDefault();
		searchName($("#search").val());		
		$("#search").val("");
	$("#search").blur();
		//flagKeyboard = true;
	}
});


$( "#search" ).click(function(event) {
	event.stopPropagation();
	document.removeEventListener("keydown", keydown,true);
	//flagKeyboard = false;
});

// ---------------------------------------------------------------------------




// ---------------------------------------------------------------------------
// Menu Listeners
// ---------------------------------------------------------------------------

// New node Listener
$('#newNodeSpan').unbind("click").click(function(event) {
	$("#validNameNN").val("");
	$("#descriptionNN").val("");
	$("#urlNN").val("");
	$("#myimage").attr("src","/images/rana.jpg");
	$("#numberChildren").val(0);
	$('#modelNewNode').modal('show');
	document.removeEventListener("keydown", keydown,true); 	
});

// New node submit
$("form#newNode").unbind("submit").submit(function(event){
	event.preventDefault();
	var formData = new FormData($("form#newNode")[0]);
	formData.append("idUser",user._id);

	// Validate data
	if(
		$('#validNameNN').val() != "" // Must has some validName
	)
	{

		API
			.newTree(formData)
			.then((data)=>{
				user.treeSelected = data._id;
				$('#modelNewNode').modal('hide');
				document.addEventListener("keydown", keydown,true);

				// Clean screen
				Graphic.deleteElements();

				// NewTree endpoint create the nodes in DB
				// but also, build the new tree and its returned

				// Move main tree to the forest
				TM.forest.push(TM.mainTree);

				// Allocate the new Tree
				TM.mainTree = TreeManager.createReferences(data);

				// Draw new tree
				TM.mainTree.show();

				setDisable();
				loadForest(TM.forest);

				return API.setTreeSelected(user._id, user.treeSelected);
			})
			.then((data)=>{});
	}
	else{
		bootbox.alert("Debe ingresar un nombre válido.");
	}

	return false;
});

// New node to the right Listener
$('#addRight').unbind("click").click(function(event) {
	if ($("#addRight").parent().attr('class') != "disable" && subGroup.children.length >= 1) {
		$("#validNameNNR").val("");
		$("#descriptionNNR").val("");
		$("#urlNNR").val("");
		$("#myimage2").attr("src","/images/rana.jpg");
		$("#numberChildrenNNR").val(0);
		$('#modelAddRight').modal('show');
		document.removeEventListener("keydown", keydown,true);
	}

});

// New node to the right submit
// New node submit
$("form#newNodeRight").unbind("submit").submit(function(event){
	event.preventDefault();
	var formData = new FormData($("form#newNodeRight")[0]);
	formData.append("idUser",user._id);
	formData.append("idTaxon",controler.select._id);

	// Validate data
	if(
		$('#validNameNNR').val() != "" 
	)
	{

		API
			.addRightTo(formData)
			.then((data)=>{
				user.treeSelected = data._id;
				$('#modelAddRight').modal('hide');
				document.addEventListener("keydown", keydown,true);

				// Clean screen
				Graphic.deleteElements();

				// NewTreeRight endpoint create the nodes in DB
				// but also, build the new tree and its returned

				controler.select.parent.add(TreeManager.createReferences(data));

				// Draw new tree
				TM.mainTree.show();

				setDisable();

			});
	}
	else{
		bootbox.alert("Debe ingresar toda la información solicitada.");
	}

	return false;
});


// Update node Listener
$('#updateNodeSpan').unbind("click").click((event)=> {
	if ($("#updateNodeSpan").parent().attr('class') != "disable" && subGroup.children.length >= 1) {

		/*API
			.getTaxon(controler.select._id)
			.then((data)=>{
				$("#validNameUpdate").val(data.validName);
				$("#descriptionUpdate").val(data.description);
				$("#urlUpdate").val(data.url);
				$("#imageUpdate").attr("src",data.img_src);
				$("#numberChildrenUpdate").val(0);
				$('#fileCreateUpdate').val(""); // Clean image input
				document.removeEventListener("keydown", keydown,true); 	
				$('#modelUpdateNode').modal('show');
			});*/
		$("#validNameUpdate").val(controler.select.validName);
		$("#descriptionUpdate").val(controler.select.description);
		$("#urlUpdate").val(controler.select.url);
		$("#imageUpdate").attr("src",controler.select.img_src);
		$("#numberChildrenUpdate").val(0);
		$('#fileCreateUpdate').val(""); // Clean image input
		document.removeEventListener("keydown", keydown,true); 	
		$('#modelUpdateNode').modal('show');
	}
});

// Update node submit
$("form#updateNode").unbind("submit").submit(function(event){
	event.preventDefault();
	var formData = new FormData($("form#updateNode")[0]);
	formData.append("idUser",user._id);
	formData.append("idTaxon",controler.select._id);

	// Validate data
	if(
		$('#validNameUpdate').val() != "" // Must has some validName
	)
	{

		if($('#fileCreateUpdate').prop('files')[0] == undefined){
			// Not edit the image
			formData.delete("upl");
		}

		API
			.updateNode(formData)
			.then((data)=>{
				$('#modelUpdateNode').modal('hide');
				document.addEventListener("keydown", keydown,true);

				// UpdateNode endpoint create the nodes in DB
				// but also, build the new children and its returned
				// In case that the user didn't increase the children
				// Just return the parent updated

				// Update the node
				controler.select.validName = data.validName;
				controler.select.img_src = data.img_src;
				controler.select.description = data.description;
				controler.select.url = data.url;


				// Add the children.
				data.children.forEach((child)=>{
					let taxon = new Taxon(child.validName, null, child._id, child.img_src,
						child.description, child.url,
						child.isCompress, child.isMarked, child.selected, child.isInsideBar);

					controler.select.add(taxon);
				});

				if(
					$('#numberChildrenUpdate').val() != "0" ||
					$('#fileCreateUpdate').prop('files')[0] != undefined
				){
					// Clean screen
					Graphic.deleteElements();
					// Draw new tree
					TM.mainTree.show();

					setDisable();

				}

			});
	}
	else{
		bootbox.alert("Debe ingresar toda la información solicitada.");
	}

	return false;

});


// Bring tree
$('#changeNodeSpan').unbind("click").click((event)=> {
	if($("#changeNodeSpan").parent().attr('class') != "disable" ){
		Commander.bringTree();
	}
});

// Delete
$('#deleteNodeSpan').unbind("click").click((event)=> {
	if($("#deleteNodeSpan").parent().attr('class') != "disable" ){
		Commander.delete();
	}
});

// Prune
$('#pruneNodeSpan').unbind("click").click((event)=> {
	if($("#pruneNodeSpan").parent().attr('class') != "disable" ){
		Commander.prune();
	}
});

// Snip
$('#snipNodeSpan').unbind("click").click((event)=> {
	if($("#snipNodeSpan").parent().attr('class') != "disable" ){
		Commander.snip();
	}
});

// Link node
$('#linkNodeSpan').unbind("click").click((event)=> {
	if($("#linkNodeSpan").parent().attr('class') != "disable" ){
		Commander.link();
	}
});

// Link node to right
$('#linkRight').unbind("click").click((event)=> {
	if($("#linkRight").parent().attr('class') != "disable" ){
		Commander.linkRightTo();
	}
});

// Swap
$('#swapNodeSpan').unbind("click").click(function(event) {
	if($("#swapNodeSpan").parent().attr('class') != "disable" ){
		Commander.swap();
	}
});

// Undo
$('#UndoSpan').unbind("click").click(function(event) {
	if($("#UndoSpan").parent().attr('class') != "disable" ){
		alert("Undo");
	}
});

// Report
$('#reportSpan').unbind("click").click(function(event) {
	nodesMarked = TreeManager.getNodesMarked();
	displayList(nodesMarked);
	$('#markedItems').show();
	$('#upItem').addClass('disable');
	$('#downItem').addClass('disable');
	$('#deleteItem').addClass('disable');
});

// ---------------------------------------------------------------------------



// ---------------------------------------------------------------------------
// Modal functions
// ---------------------------------------------------------------------------

// New node
$('#btn-less-create').unbind("click").click((event)=> {
	var num = parseInt($('#numberChildren').val());
	if (isNaN(num) || num <= 0) {
		$('#numberChildren').val(0);
	} else{
		num -= 1;
		$('#numberChildren').val(num);
	};
});

// New node 
$('#btn-more-create').unbind("click").click((event)=> {
	var num = parseInt($('#numberChildren').val());
	if (isNaN(num) || num < 0) {
		$('#numberChildren').val(0);
	} else{
		num += 1;
		$('#numberChildren').val(num);
	};
});

// add right
$('#btn-less-createR').unbind("click").click((event)=> {
	var num = parseInt($('#numberChildrenNNR').val());
	if (isNaN(num) || num <= 0) {
		$('#numberChildrenNNR').val(0);
	} else{
		num -= 1;
		$('#numberChildrenNNR').val(num);
	};
});

// New node and add right
$('#btn-more-createR').unbind("click").click((event)=> {
	var num = parseInt($('#numberChildrenNNR').val());
	if (isNaN(num) || num < 0) {
		$('#numberChildrenNNR').val(0);
	} else{
		num += 1;
		$('#numberChildrenNNR').val(num);
	};
});

// Update node
$('#btn-less-Update').unbind("click").click((event)=> {
	var num = parseInt($('#numberChildrenUpdate').val());
	if (isNaN(num) || num <= 0) {
		$('#numberChildrenUpdate').val(0);
	} else{
		num -= 1;
		$('#numberChildrenUpdate').val(num);
	};
});

// Update node
$('#btn-more-Update').unbind("click").click((event)=> {
	var num = parseInt($('#numberChildrenUpdate').val());
	if (isNaN(num) || num < 0) {
		$('#numberChildrenUpdate').val(0);
	} else{
		num += 1;
		$('#numberChildrenUpdate').val(num);
	};
});

$('#closeMark').unbind("click").click((event)=> {
	$('#markedItems').hide();
});

$('#closeSearch').unbind("click").click((event)=> {
	$('#searchModal').hide();
});

$("#btn-open-bc").click(function() {
	var id = $("#itemsSearch").find("li.selectedItem").attr("value");
 	if (typeof id !== 'undefined') {
 		var obj = {
			_id: id,
			validName:$("#itemsSearch").find("li.selectedItem").attr("validName"),
			img_src:$("#itemsSearch").find("li.selectedItem").attr("img_src"),
			description:$("#itemsSearch").find("li.selectedItem").attr("description"),
			url: $("#itemsSearch").find("li.selectedItem").attr("url"),
			isMarked: $("#itemsSearch").find("li.selectedItem").attr("isMarked")
		};
  		openBC(obj);
	};
});

// ---------------------------------------------------------------------------