
function clickRadioValidName(element) {
	this.checked = true;
	var buttonCommonName = document.getElementById("radioCommonName");
	var buttonDescription = document.getElementById("radioDescription");
	buttonCommonName.checked = false;
	buttonDescription.checked = false;
}

function clickRadioCommonName(element) {
	this.checked = true;
	var buttonValidName = document.getElementById("radioValidName");
	var buttonDescription = document.getElementById("radioDescription");
	buttonValidName.checked = false;
	buttonDescription.checked = false;
}

function clickRadioDescription(element) {
	this.checked = true;
	var buttonValidName = document.getElementById("radioValidName");
	var buttonCommonName = document.getElementById("radioCommonName");
	buttonValidName.checked = false;
	buttonCommonName.checked = false;
}

function searchName(value){
	if (document.getElementById("radioValidName").checked){
		API
			.searchValidName(value, user._id)
			.then((data)=>{
				loadSearchResults(data);
			});
	} else if (document.getElementById("radioCommonName").checked) {
		API
			.searchCommonName(value, user._id)
			.then((data)=>{
				loadSearchResults(data);
			});
	} else {
		API
			.searchDescription(value, user._id)
			.then((data)=>{
				loadSearchResults(data);
			});
	}
}

function loadSearchResults (list){
	var div = document.getElementById("itemsSearch");
	var str = "";
	for (var i = 0; i < list.length; i++) {
		str += '<li value="'+list[i]._id+'" validName="'+list[i].validName+'" img_src="'+list[i].img_src+'" description="'+list[i].description+'" url="'+list[i].url+'" isMarked="'+list[i].graphicInformation.isMarked+'" >'+list[i].validName+"</li>"
	};
	if (list.length == 0){
		str += "<li>No hay resultados</li>"
	}
	div.innerHTML = str;
	$("ul[id=itemsSearch] li").click(function () {
		$that = $(this);
		if ($that.hasClass('selectedItem')) {
			$that.parent().find('li').removeClass('selectedItem');
		} else{
			$that.parent().find('li').removeClass('selectedItem');
			$that.addClass('selectedItem'); 
			playSelect();
		};
	});
	$('#searchModal').show();

};