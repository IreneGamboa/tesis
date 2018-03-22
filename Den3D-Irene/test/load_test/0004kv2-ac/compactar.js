const args = process.argv;
// args[0]: 0001-1
// args[1]: A1
const testFolder = './';
const fs = require('fs');

var output = ""

fs.readdirSync(testFolder).forEach(file => {
	var result = file.match(new RegExp(args[2]+'\.'+args[3]+'\..*\.txt'));
	if(result != null){
		let fileName = result[0]
		let f = fs.statSync(result[0])
		let timeStamp = f.mtime/1000
		let fileData = parseFloat(fs.readFileSync(result[0]).toString())*1000;
		output += fileName + "\t" + fileData + " ms\t" + timeStamp + "\n";
	}
})

fs.writeFile(args[2]+'.'+args[3]+'.clnt.log', output, function(err) {
	console.log("The file was saved!");
});
