'use strict'
//import Graphic from 'Graphic';
class Taxon{
	constructor (validName, parent, _id, img_src, description, url, isCompress, isMarked, selected, isInsideBar) {
		this._id = _id;
		this.parent = parent;
		this.validName = validName;
		this.description = description;
		this.img_src = img_src;
		this.url = url;

		this.radiusBottom = 10.185916357881302;
		this.rotation = 0;
		this.x = 0;
		this.y = 0;
		this.z = 0;
		this.diameter = 64;

		this.isCompress = isCompress;
		this.isMarked = isMarked;

		this.selected = selected;
		this.isInsideBar = isInsideBar; //Puede que esto no se utilize

		//Referencias para los objetos gráficos de Threejs
		this.refSphere = null;
		this.refSquare = null;
		this.refMark = null;
		this.refCone = null;

		this.children = [];
		this.numberSpecies = 0;
	}
	clean(){
		this.radiusBottom = 10.185916357881302;
		this.rotation = 0;
		this.x = 0;
		this.y = 0;
		this.z = 0;
		this.diameter = 64;
		this.numberSpecies = 0;
		this.rotation = 0;
		this.refSphere = null;
		this.refSquare = null;
		this.refMark = null;
		this.refCone = null;
		if(this.children.length != 0){
			for (var i = 0; i < this.children.length; i++) {
				this.children[i].clean();
			}
		}
	}

	//Esta funcion sirve para el link tambien
	add(taxon){
		taxon.parent = this;
		this.children.push(taxon);
	}
	//Snip casi que son el mismo
	prune(){

		if(this.parent != null){
			// The parent
			let temParent = this.parent;
			// Find the element on the list of childre
			let index = temParent.children.indexOf(this);
			temParent.children.splice(index,1);
			this.parent = null;
			return this;
		}
		return null;
	}
	snip(){

		return this.prune();

	}
	compress(){
		this.isCompress = true;
	}
	expand(){
		this.isCompress = false;
	}
	mark(){
		this.isMarked = !this.isMarked;
		if(this.refMark === null && this.isMarked === true){
			this.refMark = Graphic.createMark(this.x, this.y,this.z);
		}else if(this.refMark !== null && this.isMarked === false){
			scene.remove(this.refMark);
			group.remove(this.refMark);
			subGroup.remove(this.refMark);
			this.refMark.geometry.dispose();
			this.refMark.material.dispose();
			this.refMark = null;
		}
	}
	link(taxon){
		this.add(taxon);
	}
	linkRight(taxon){
		this.parent.add(taxon);
	}
	delete(){
		this.prune();
		// Delete in local memory
		this.deleteAux();
	}
	deleteAux(){
		this.children.forEach((child)=>{
			child.deleteAux();
		});
		delete this;
	}
	getTaxonomic(){
    if (this.parent === null) {
      return this.validName;
    } else {
      return this.parent.getTaxonomixc() + ' '+ this.validName;
    }
  }
	getInformation(){
		let information = {
												"validName":this.validName,
												"description":this.description,
												"img_src":this.img_src,
												"taxonomic":this.getTaxonomic(),
												"url": this.url
											};
		return information;
	}
	//open Tooltip
	toolTipInformation(){
		let information = {
												"validName":this.validName,
												"img_src":this.img_src,
												"numberSpecies":this.getNumberSpecies()
											};
		return information;
	}
	getNumberSpecies(){
		if(this.children.length === 0){
			return 1;
		}
		else{
			let numberSpecies = 0;
			for (var i = 0; i < this.children.length; i++) {
				numberSpecies += this.children[i].getNumberSpecies();
			}
			return numberSpecies;
		}
	}
	//swap ()
	//getters & setters
	draw(){
		if (this.isCompress) {
			//Solo ocupamos dibujar la esfera
			let opacity = 1;
			this.refSphere = Graphic.createSphere(this.x, this.y,this.z, this.radiusBottom, opacity);
		} else {
				this.refSquare = Graphic.createImage(this.x, this.y,this.z, this.rotation,this.img_src);
				if (this.isMarked) {
					this.refMark = Graphic.createMark(this.x, this.y,this.z);
				}
				if (this.children.length > 0) {
					let opacity = 1;
					this.refCone = Graphic.createCone(this.x, this.y,this.z, this.radiusBottom, opacity);
					for (var i = 0; i < this.children.length; i++) {
						this.children[i].draw();
					}
				}
		}
		/*
		let geometry = new THREE.CylinderGeometry(  0, this.radiusBottom, 100, 50, 50, false);
		//Color azul 0xFF9757
		let material = new THREE.MeshLambertMaterial({color:0xFF9757, transparent:true, opacity:1});
		let cylinder = new THREE.Mesh( geometry, material );
		cylinder.position.x = this.x;
		cylinder.position.y = this.y;
		cylinder.position.z = this.z;
		scene.add(cylinder);
		group.add(cylinder);
		objects.push(cylinder);

		for (var i = 0; i < this.children.length; i++) {
			this.children[i].draw();
		}*/
	}
	updatePosition(){
		let parent = this.parent;
		this.calculateCircumference();
		while (parent !== null) {
			let sumDiametros = 0;
			let maxRadios = 0;
			for (var i = 0; i < parent.children.length; i++) {
				sumDiametros += parent.childre[i].diameter;
			}
			let radioAux = (1/(2*Math.PI))*sumDiametros;
			let radioMax = parent.maxRadiosSyn();
			parent.radiusBottom = radioAux < radioMax ? radioMax : radioAux;
			let aux = (parent.radiusBottom + 2*radioMax);
			parent.diameter = 2 * aux;
			if (parent.parent === null) {
				break;
			}
			parent = parent.parent;
		}
		parent.pinUp();
	}
	calculateCircumference (){
		return new Promise((resolve, reject) => {
			if(this.children.length === 0 || this.isCompress){
				this.diameter = 64;
				this.radiusBottom = 10.185916357881302;
				resolve(this.diameter);
			}
			else{
				let sumDiametros = 0;
				let numberSpecies = 0;

				let testList = 0;

				for (let i = this.children.length - 1; i >= 0; i--) {
					this.children[i].calculateCircumference()
					.then((countCalcs)=>{

						testList += 1;

						sumDiametros += countCalcs;
						if (this.children[i].numberSpecies === 0) {
							numberSpecies += 1;
						} else{
							numberSpecies += this.children[i].numberSpecies;
						};


						if(testList == this.children.length){
							this.numberSpecies = numberSpecies;
							let radioAux = (1/(2*Math.PI))*sumDiametros;

							this.maxRadios()
							.then((radioMax)=>{
								if(radioAux < radioMax){
									this.radiusBottom = radioMax;
								}else{
									this.radiusBottom = radioAux;
								};
								var aux = (this.radiusBottom + 2*radioMax);
								this.diameter = 2 * aux;
								resolve(this.diameter);
							});

						}
					});
				};
			};
		});
	};
	/* Obtiene el radio máximo de todos los hijos de un cono */
	maxRadios(){
		return new Promise((resolve, reject) => {
			var max = 0;
			for (var i = this.children.length - 1; i >= 0; i--) {
				if (this.children[i].radiusBottom > max) {
					max = this.children[i].radiusBottom;
				};
			};
			resolve(max);
		});
	};
	maxRadiosSyn(){
			let max = 0;
			for (let i = this.children.length - 1; i >= 0; i--) {
				if (this.children[i].radiusBottom > max) {
					max = this.children[i].radiusBottom;
				};
			};
			return max;
	};
	pinUp (level){
		let omegaAcom = 0;
		let constant = 2 * this.radiusBottom * Math.PI;

		for (let i = 0; i < this.children.length; i++) {
			let alfa =  (this.children[i].diameter/constant) * 360;
			let beta = alfa / 2;
			let omega = omegaAcom === 0 ? 0 : omegaAcom;
			omegaAcom += alfa;
			let delta = omega + beta;
			if(this.children.length === 1 && this.children[i].children.length ===  0){
				this.children[i].x =  this.x;

				this.children[i].z =  this.z;

				this.children[i].y = -150*level;

				this.children[i].rotation = (180 - delta)*Math.PI/180;
			}
			else{
				this.children[i].x = (this.radiusBottom * Math.cos(delta  * Math.PI/180)) + this.x;

				this.children[i].z = (this.radiusBottom * Math.sin(delta * Math.PI/180)) + this.z;

				this.children[i].y = -150*level;

				this.children[i].rotation = (90 - delta)*Math.PI/180;
			}
			this.children[i].pinUp(level + 1);
		};
	};

	show(){
		this.calculateCircumference()
		.then(()=>{
			this.pinUp(1);
			this.draw();
		});
	}
}

/*
let pos = 0;


function myMove() {
  var pos = 0;
  var id = setInterval(frame, 10);
  function frame() {
      if (pos == 350) {
        clearInterval(id);
      } else {
        pos++;
        let data = {
          radiusTop : 0,
          radiusBottom : pos,
          height : 10,
          radiusSegments : 8,
          heightSegments : 1,
          openEnded : false,
          thetaStart : 0,
          thetaLength : twoPi
        };
        updateGroupGeometry( mesh,
  				new THREE.CylinderGeometry(
  					data.radiusTop,
  					data.radiusBottom,
  					data.height,
  					data.radiusSegments,
  					data.heightSegments,
  					data.openEnded,
  					data.thetaStart,
  					data.thetaLength
  				)
  			);
      }
    }
}

*/
