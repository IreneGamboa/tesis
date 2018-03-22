'use strict'

// Imports
const
	fs = require("fs");

// Classes
const
	Generator = require('./Generator');

module.exports = class FileManager{
	
	constructor(){
	}

	static deleteImage(path){
		fs.unlink(path,(err)=>{
			console.log(err)
		});
	}

	static uploadImage(req){
		return new Promise(	(resolve, reject)=>{
			const 
				tmp_path = req.files[0].path,
				originalName = req.files[0].originalname,
				target = Generator.getIdImage() + originalName.substring(originalName.length-4,originalName.length),
				target_path = './public/images/' + target;

			const src = fs.createReadStream(tmp_path);
			const dest = fs.createWriteStream(target_path);
			src.pipe(dest);
			src.on('end', () =>
				{
					// Delete temporary file
					fs.exists(tmp_path, (exists)=> {
						if (exists) {
							fs.unlink(tmp_path,(err)=>{
								resolve("/images/"+target);
							});
						}
					});
				}
			);

			src.on('error', (err)=>
				{
					// Delete temporary file
					fs.exists(tmp_path, (exists)=> {
						if (exists) {
							fs.unlink(tmp_path,(err)=> {
								console.log("[FileManager]: UploadImage can't upload image.");
								reject(false);
							});
						}
					});
				}
			);
		});
	}
}