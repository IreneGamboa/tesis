'use strict'

class API {
	constructor (){}

	static request(URL, data){
		return new Promise((resolve, reject) => {
			$.ajax({
				type: "POST",
				url : URL,
				data: data,
				success: function(data){
					resolve(data);
				},
				error:function(jqXHR,textStatus,errorThrown)
				{
					alert(errorThrown);
					reject(errorThrown);
				}
			});
		});
	}

	static requestMP(URL, data){
		return new Promise((resolve, reject) => {
			$.ajax({
				type: "POST",
				url : URL,
				data: data,
				processData: false,
				contentType: false,
				success: function(data){
					resolve(data);
				},
				error:function(jqXHR,textStatus,errorThrown)
				{
					alert(errorThrown);
					reject(errorThrown);
				}
			});
		});
	}

	// USER ENDPOINT

	static login(email, password){

		let data = {
				email:email,
				password:password
			};

		return API.request("/users/login",data);

	}

	static signup(email, password, name, lastName){
		
		let data = {
			email:email,
			password:password,
			name:name,
			lastName:lastName
		};

		return API.request("/users/signup",data);
	}

	static user(email){
	
		let data = {
			email:email
		};

		return API.request("/users/user",data);
	}

	// CORE ENDPOINT

	static newTree(data){
		return API.requestMP("/core/newTree",data);
	}

	static updateNode(data){
		return API.requestMP("/core/UpdateNode",data);
	}

	static addRightTo(data){
		return API.requestMP("/core/addRightTo",data);
	}

	static getTaxon(idTaxon){
	
		let data = {
			idTaxon:idTaxon
		};

		return API.request("/core/getTaxon",data);
	}

	static makeSumary(idElement){
	
		let data = {
			idElement:idElement
		};

		return API.request("/core/makeSumary",data);
	}

	static openWorkbench(idUser,idTree){
	
		let data = {
			idUser:idUser,
			idTree:idTree
		};

		return API.request("/core/openWorkbench",data);
	}

	static compress(idTaxon){
	
		let data = {
			idTaxon:idTaxon
		};

		return API.request("/core/compress",data);
	}

	static expand(idTaxon){
	
		let data = {
			idTaxon:idTaxon
		};

		return API.request("/core/expand",data);
	}

	static marksList(idUser){
	
		let data = {
			idUser:idUser
		};

		return API.request("/core/marksList",data);
	}

	static mark(idTaxon){
	
		let data = {
			idTaxon:idTaxon
		};

		return API.request("/core/mark",data);
	}

	static cut(idTaxon){
	
		let data = {
			idTaxon:idTaxon
		};

		return API.request("/core/cut",data);
	}

	static link(idChild,idParent){
	
		let data = {
			idChild:idChild,
			idParent:idParent
		};

		return API.request("/core/link",data);
	}

	static linkRightTo(tree,idNode){
	
		let data = {
			tree:tree,
			idNode:idNode
		};

		return API.request("/core/linkRightTo",data);
	}

	static swap(idChild,idParent){
	
		let data = {
			idChild:idChild,
			idParent:idParent
		};

		return API.request("/core/swap",data);
	}

	static delete(idTaxon){
	
		let data = {
			idTaxon:idTaxon
		};

		return API.request("/core/delete",data);
	}

	static searchValidName(validName, idUser){
	
		let data = {
			validName:validName,
			idUser:idUser
		};

		return API.request("/core/searchValidName",data);
	}

	static searchDescription(description, idUser){
	
		let data = {
			description:description,
			idUser:idUser
		};

		return API.request("/core/searchDescription",data);
	}

	static searchCommonName(commonName, idUser){
	
		let data = {
			commonName:commonName,
			idUser:idUser
		};

		return API.request("/core/searchCommonName",data);
	}

	static setTreeSelected(idUser, idTree){

		let data = {
			idUser: idUser,
			idTree: idTree
		}

		return API.request("/core/setTreeSelected", data);
	}

}