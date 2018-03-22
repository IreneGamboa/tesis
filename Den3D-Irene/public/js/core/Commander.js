'use strict'

class Commander{

	constructor(){}

	static bringTree(){
		if(user.forestSelected != null ){
			user.treeSelected = user.forestSelected;

			API
				.setTreeSelected(user._id,user.treeSelected)
				.then((result)=>{});

			Graphic.deleteElements();

			// Move main tree to the forest
			TM.forest.push(TM.mainTree);

			// Clean null in the forest
			TM.forest.clean(null);

			// Allocate the forest selected tree
			TM.mainTree = TreeManager.searchTree(TM.forest, user.treeSelected);

			// Remove the forest selected tree from the forest
			TM.forest.splice( TM.forest.indexOf(TM.mainTree),1);

			// Draw the forest selected tree
			TM.mainTree.show();

			setDisable();
			loadForest(TM.forest);

		}
	}

	static delete(){
		if(Object.keys(controler.select).length != 0){
				
			API
				.delete(controler.select._id)
				.then((result)=>{});

			if(controler.select.parent === null){

				controler.select = {};
				TM.mainTree = null;

			}else{
				controler.select.delete();
			}

			Graphic.deleteElements();
			if(TM.mainTree != null){
				TM.mainTree.clean();
				TM.mainTree.show();
			}

			setDisable();
		}
	}

	static prune(){
		if(Object.keys(controler.select).length != 0){

			let r = controler.select.prune();

			if(r != null){

				API
					.cut(controler.select._id)
					.then((result)=>{});

				Graphic.deleteElements();
				TM.mainTree.clean();
				TM.mainTree.show();
				
				// Is required clean the tree before to add to the forest
				r.clean();
				TM.forest.push(r);

				setDisable();
				loadForest(TM.forest);
			}
		}
	}

	static snip(){
		if(Object.keys(controler.select).length != 0){
				
			let r = controler.select.snip();
			if( r != null){
				
				// Is required clean the tree before to add to the forest
				TM.mainTree.clean();
				TM.forest.push(TM.mainTree);

				// Difference to prune
				TM.mainTree = r;

				// Request cut
				API
					.cut(controler.select._id)
					.then((result)=>{

						// Set tree selected
						return API
							.setTreeSelected(
								user._id,
								controler.select._id
								);

					})
					.then((result)=>{});

				Graphic.deleteElements();
				if(TM.mainTree != null){
					TM.mainTree.clean();
					TM.mainTree.show();

					setDisable();
					loadForest(TM.forest);

				}
			}
		}
	}

	static expand(){
		if(Object.keys(controler.select).length != 0){

			API
				.expand(controler.select._id)
				.then((result)=>{});

			controler.select.expand();
			Graphic.deleteElements();
			TM.mainTree.clean();
			TM.mainTree.show();
		}
	}

	static compress(){
		if(Object.keys(controler.select).length != 0){
			
			API
				.compress(controler.select._id)
				.then((result)=>{});

			controler.select.compress();
			Graphic.deleteElements();
			TM.mainTree.clean();
			TM.mainTree.show();
		}
	}

	static link(){
		if(Object.keys(controler.select).length != 0 && user.forestSelected != null){

			API
				.link(user.forestSelected, controler.select._id)
				.then((result)=>{

					console.log(result)

					if ('Status' in result && result['Status'] == 'Fail') {
						console.log("Ha ocurrido un error");
					}
					else{

						Graphic.deleteElements();
			
						// Search the tree selected
						let treeSelected = TreeManager.searchTree(TM.forest, user.forestSelected);

						// Remove the forest selected tree from the forest
						TM.forest.splice( TM.forest.indexOf(treeSelected),1);

						// Make link
						controler.select.link(treeSelected);

						// Draw the forest selected tree
						TM.mainTree.clean();
						TM.mainTree.show();

						setDisable();
						loadForest(TM.forest);

					}

				});
		}
	}


	static linkRightTo(){
		if(Object.keys(controler.select).length != 0 && user.forestSelected != null && controler.select.parent != null){

			API
				.linkRightTo(user.forestSelected, controler.select._id)
				.then((result)=>{

					if ('Status' in result && result['Status'] == 'Fail') {
						console.log("Ha ocurrido un error");
					}
					else{
						Graphic.deleteElements();
			
						// Search the tree selected
						let treeSelected = TreeManager.searchTree(TM.forest, user.forestSelected);

						// Remove the forest selected tree from the forest
						TM.forest.splice( TM.forest.indexOf(treeSelected),1);

						// Make link
						controler.select.linkRight(treeSelected);

						// Draw the forest selected tree
						TM.mainTree.clean();
						TM.mainTree.show();

						setDisable();
						loadForest(TM.forest);
					}

				});
		}
	}

	static swap(){

		if(controler.select.parent == null){
			Commander.bringTree();
		}
		else{
			
			API
				.swap(user.forestSelected, controler.select._id)
				.then((result)=>{

					if ('Status' in result && result['Status'] == 'Fail') {
						console.log("Ha ocurrido un error");
					}
					else{
						// Search the tree selected
						let treeSelected = TreeManager.searchTree(TM.forest, user.forestSelected);

						let backUpSubTree = controler.select;
						backUpSubTree.clean();
						TM.forest.push(backUpSubTree);

						// Remove the forest selected tree from the forest
						TM.forest.splice( TM.forest.indexOf(treeSelected),1);

						// Get Parent
						let parent = controler.select.parent;

						// Add new child
						parent.add(treeSelected);
						// Remove the child
						parent.children.splice( parent.children.indexOf(backUpSubTree),1);

						Graphic.deleteElements();
						// Draw the forest selected tree
						TM.mainTree.clean();
						TM.mainTree.show();

						setDisable();
						loadForest(TM.forest);
					}
				});

		}

	}
}