const args = process.argv;

const fs = require('fs'),
	jsonfile = require('jsonfile');

let processData = function(data){
	// Split new line
	var split1 = data.split('\n');
	split1 = split1.slice(0,split1.length-1);
	
	var count = 0;
	var timeRes = 0;
	var minTimeRes = 0;
	var maxTimeRes = 0;

	let flag = true;

	split1.forEach((log)=>{
		var split2 = log.split('\t');
		count += 1;
		var split3 = split2[1].split(" ");

		var time = parseFloat(split3[0]);

		if(flag){
			maxTimeRes = time;
			minTimeRes = time;
			flag = false;
		}

		timeRes += time; // Para tiempo promedio

		if(time > maxTimeRes){
			maxTimeRes = time;
		}
		if(time < minTimeRes){
			minTimeRes = time;
		}

	});

	let data_out = {
		count:count,
		avgTimeResMs:timeRes/count,
		minTimeResMs:minTimeRes,
		maxTimeResMs:maxTimeRes,
	}

	return data_out;
}


var fA1Content = processData(fs.readFileSync(args[2]+'.A1.clnt.log', 'utf8'));
var fA2Content = processData(fs.readFileSync(args[2]+'.A2.clnt.log', 'utf8'));
var fA3Content = processData(fs.readFileSync(args[2]+'.A3.clnt.log', 'utf8'));

let data_A = {
	
	A:{
		avgTimeResMs:(fA1Content.avgTimeResMs+fA2Content.avgTimeResMs+fA2Content.avgTimeResMs)/3,
		minTimeResMs: Math.min(fA1Content.minTimeResMs,fA2Content.minTimeResMs,fA3Content.minTimeResMs),
		maxTimeResMs: Math.max(fA1Content.maxTimeResMs,fA2Content.maxTimeResMs,fA3Content.maxTimeResMs)
	},
	A1: {
		count:fA1Content.count,
		avgTimeResMs:fA1Content.avgTimeResMs,
		minTimeResMs:fA1Content.minTimeResMs,
		maxTimeResMs:fA1Content.maxTimeResMs
	},
	A2: {
		count:fA2Content.count,
		avgTimeResMs:fA2Content.avgTimeResMs,
		minTimeResMs:fA2Content.minTimeResMs,
		maxTimeResMs:fA2Content.maxTimeResMs
	},
	A3: {
		count:fA3Content.count,
		avgTimeResMs:fA3Content.avgTimeResMs,
		minTimeResMs:fA3Content.minTimeResMs,
		maxTimeResMs:fA3Content.maxTimeResMs
	}
}

var fB1Content = processData(fs.readFileSync(args[2]+'.B1.clnt.log', 'utf8'));
var fB2Content = processData(fs.readFileSync(args[2]+'.B2.clnt.log', 'utf8'));
var fB3Content = processData(fs.readFileSync(args[2]+'.B3.clnt.log', 'utf8'));

let data_B = {
	
	B:{
		avgTimeResMs:(fB1Content.avgTimeResMs+fB2Content.avgTimeResMs+fB2Content.avgTimeResMs)/3,
		minTimeResMs: Math.min(fB1Content.minTimeResMs,fB2Content.minTimeResMs,fB3Content.minTimeResMs),
		maxTimeResMs: Math.max(fB1Content.maxTimeResMs,fB2Content.maxTimeResMs,fB3Content.maxTimeResMs)
	},
	B1: {
		count:fB1Content.count,
		avgTimeResMs:fB1Content.avgTimeResMs,
		minTimeResMs:fB1Content.minTimeResMs,
		maxTimeResMs:fB1Content.maxTimeResMs
	},
	B2: {
		count:fB2Content.count,
		avgTimeResMs:fB2Content.avgTimeResMs,
		minTimeResMs:fB2Content.minTimeResMs,
		maxTimeResMs:fB2Content.maxTimeResMs
	},
	B3: {
		count:fB3Content.count,
		avgTimeResMs:fB3Content.avgTimeResMs,
		minTimeResMs:fB3Content.minTimeResMs,
		maxTimeResMs:fB3Content.maxTimeResMs
	}
}

var fC1Content = processData(fs.readFileSync(args[2]+'.C1.clnt.log', 'utf8'));
var fC2Content = processData(fs.readFileSync(args[2]+'.C2.clnt.log', 'utf8'));
var fC3Content = processData(fs.readFileSync(args[2]+'.C3.clnt.log', 'utf8'));

let data_C = {
	
	C:{
		avgTimeResMs:(fC1Content.avgTimeResMs+fC2Content.avgTimeResMs+fC2Content.avgTimeResMs)/3,
		minTimeResMs: Math.min(fC1Content.minTimeResMs,fC2Content.minTimeResMs,fC3Content.minTimeResMs),
		maxTimeResMs: Math.max(fC1Content.maxTimeResMs,fC2Content.maxTimeResMs,fC3Content.maxTimeResMs)
	},
	C1: {
		count:fC1Content.count,
		avgTimeResMs:fC1Content.avgTimeResMs,
		minTimeResMs:fC1Content.minTimeResMs,
		maxTimeResMs:fC1Content.maxTimeResMs
	},
	C2: {
		count:fC2Content.count,
		avgTimeResMs:fC2Content.avgTimeResMs,
		minTimeResMs:fC2Content.minTimeResMs,
		maxTimeResMs:fC2Content.maxTimeResMs
	},
	C3: {
		count:fC3Content.count,
		avgTimeResMs:fC3Content.avgTimeResMs,
		minTimeResMs:fC3Content.minTimeResMs,
		maxTimeResMs:fC3Content.maxTimeResMs
	}
}

var fD1Content = processData(fs.readFileSync(args[2]+'.D1.clnt.log', 'utf8'));
var fD2Content = processData(fs.readFileSync(args[2]+'.D2.clnt.log', 'utf8'));
var fD3Content = processData(fs.readFileSync(args[2]+'.D3.clnt.log', 'utf8'));

let data_D = {
	
	D:{
		avgTimeResMs:(fD1Content.avgTimeResMs+fD2Content.avgTimeResMs+fD2Content.avgTimeResMs)/3,
		minTimeResMs: Math.min(fD1Content.minTimeResMs,fD2Content.minTimeResMs,fD3Content.minTimeResMs),
		maxTimeResMs: Math.max(fD1Content.maxTimeResMs,fD2Content.maxTimeResMs,fD3Content.maxTimeResMs)
	},
	D1: {
		count:fD1Content.count,
		avgTimeResMs:fD1Content.avgTimeResMs,
		minTimeResMs:fD1Content.minTimeResMs,
		maxTimeResMs:fD1Content.maxTimeResMs
	},
	D2: {
		count:fD2Content.count,
		avgTimeResMs:fD2Content.avgTimeResMs,
		minTimeResMs:fD2Content.minTimeResMs,
		maxTimeResMs:fD2Content.maxTimeResMs
	},
	D3: {
		count:fD3Content.count,
		avgTimeResMs:fD3Content.avgTimeResMs,
		minTimeResMs:fD3Content.minTimeResMs,
		maxTimeResMs:fD3Content.maxTimeResMs
	}
}

var fE1Content = processData(fs.readFileSync(args[2]+'.E1.clnt.log', 'utf8'));
var fE2Content = processData(fs.readFileSync(args[2]+'.E2.clnt.log', 'utf8'));
var fE3Content = processData(fs.readFileSync(args[2]+'.E3.clnt.log', 'utf8'));

let data_E = {
	
	E:{
		avgTimeResMs:(fE1Content.avgTimeResMs+fE2Content.avgTimeResMs+fE2Content.avgTimeResMs)/3,
		minTimeResMs: Math.min(fE1Content.minTimeResMs,fE2Content.minTimeResMs,fE3Content.minTimeResMs),
		maxTimeResMs: Math.max(fE1Content.maxTimeResMs,fE2Content.maxTimeResMs,fE3Content.maxTimeResMs)
	},
	E1: {
		count:fE1Content.count,
		avgTimeResMs:fE1Content.avgTimeResMs,
		minTimeResMs:fE1Content.minTimeResMs,
		maxTimeResMs:fE1Content.maxTimeResMs
	},
	E2: {
		count:fE2Content.count,
		avgTimeResMs:fE2Content.avgTimeResMs,
		minTimeResMs:fE2Content.minTimeResMs,
		maxTimeResMs:fE2Content.maxTimeResMs
	},
	E3: {
		count:fE3Content.count,
		avgTimeResMs:fE3Content.avgTimeResMs,
		minTimeResMs:fE3Content.minTimeResMs,
		maxTimeResMs:fE3Content.maxTimeResMs
	}
}

let data_out = {
	A:data_A,
	B:data_B,
	C:data_C,
	D:data_D,
	E:data_E
}

jsonfile.writeFile(args[2]+'.stat.clnt.json', data_out, {spaces: 4}, function (err) {
	if(err) console.error(err)
})
