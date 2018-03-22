'use strict'

module.exports = class Generator{
	
	constructor(){
	}

	static getIdImage(){
		return Generator.s4() + Generator.s4() + '-' + Generator.s4() + '-' + Generator.s4() + '-' +
			Generator.s4() + '-' + Generator.s4() + Generator.s4() + Generator.s4();
	}

	static s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	}

}