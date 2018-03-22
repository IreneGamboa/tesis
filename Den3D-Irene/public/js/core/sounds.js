/* Con estas funciones se permiten reproducir los sonidos de la herramiento. */
function playSound (url) {
	var snd = new Audio(url);
	snd.play();
}

function playError(){
	playSound("/sounds/error.aiff");
}

function playMark(){
	playSound("/sounds/mark.mp3");
}

function playSelect(){
	playSound("/sounds/select.mp3");
}

function playBaseBall(){
	playSound("/sounds/baseCard.mp3");
}