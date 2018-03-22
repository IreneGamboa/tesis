
var nodesMarked = []
var idSelectItemReport = "";

function displayList (_nodesMarked) {
	// body...
	var str = "";
	for (var i = 0; i < _nodesMarked.length; i++) {
		let name = _nodesMarked[i].validName;
		if(name == ""){
			name = "Sin nombre"
		}
		str += '<li value="'+_nodesMarked[i]._id+'">'+name+"</li>"
	};
	var ul = document.getElementById("itemsMarked");
	ul.innerHTML =str;
	$("ul[id=itemsMarked] li").click(function () {
		$that = $(this);
		if ($that.hasClass('selectedItem')) {
			idSelectItemReport = "";
			$that.parent().find('li').removeClass('selectedItem');
			$('#upItem').addClass('disable');
			$('#downItem').addClass('disable');
			$('#deleteItem').addClass('disable');
		} else{
			idSelectItemReport = $that.attr("value");
			$that.parent().find('li').removeClass('selectedItem');
			$that.addClass('selectedItem');	
			$('#upItem').removeClass('disable');
			$('#downItem').removeClass('disable');
			$('#deleteItem').removeClass('disable');
			playSelect();
		};
	});
}


function upItem () {
	var opcionSeleccionada = $("#itemsMarked").find("li.selectedItem");
	var anterior = opcionSeleccionada.prev();
	if (anterior.length > 0)
		opcionSeleccionada.detach().insertBefore(anterior);

}

function downItem () {
	var opcionSeleccionada = $("#itemsMarked").find("li.selectedItem");
	var next = opcionSeleccionada.next();
	if (next.length > 0)
		opcionSeleccionada.detach().insertAfter(next);
}

function sortAlphabetic(){
	nodesMarked = nodesMarked.sort(function(a, b) {
  		var nameA = a.validName.toUpperCase(); // ignore upper and lowercase
  		var nameB = b.validName.toUpperCase(); // ignore upper and lowercase
  		if (nameA < nameB) {
    		return -1;
  		}
  		if (nameA > nameB) {
    		return 1;
  		}
  		// names must be equal
  		return 0;
	});
	if (flagAlphabetic) {
		nodesMarked = nodesMarked.reverse();
		flagAlphabetic = false;
	}else{
		flagAlphabetic = true;
	};
	displayList(nodesMarked);
}

function sortCrono(){
	nodesMarked = nodesMarked.slice();
	if (flagCrono) {
		nodesMarked = nodesMarked.reverse();
		flagCrono = false;
	}else{
		nodesMarked = nodesMarked.reverse();
		flagCrono = true;
	};
	displayList(nodesMarked);
}

function deleteItem(){
	if( idSelectItemReport != ""){
		nodesMarked = nodesMarked.filter((obj)=>{
			return obj._id != idSelectItemReport
		});

		displayList(nodesMarked);
	}
}

function generarDocx() {

	let idsNM = nodesMarked.map((obj)=>{
		return obj._id;
	})

	var str = JSON.stringify(idsNM);
	document.getElementById("idDocx").value = str;
	$( "#generacion").submit();
}