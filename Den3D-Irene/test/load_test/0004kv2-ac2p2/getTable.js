const args = process.argv;
const fs = require('fs');
const testFolder = './';

fs.readdirSync(testFolder).forEach(file => {
	var result = file.match(new RegExp('.*\.stat\.clnt\.json$'));
	if(result != null){
		let fileName = result[0]
		let json = require('./'+fileName);
		
		let A = json.A.A;
		let B = json.B.B;
		let C = json.C.C;
		let D = json.D.D;
		let E = json.E.E;

		let A1 = json.A.A1;
		let A2 = json.A.A2;
		let A3 = json.A.A3;

		let B1 = json.B.B1;
		let B2 = json.B.B2;
		let B3 = json.B.B3;

		let C1 = json.C.C1;
		let C2 = json.C.C2;
		let C3 = json.C.C3;

		let D1 = json.D.D1;
		let D2 = json.D.D2;
		let D3 = json.D.D3;

		let E1 = json.E.E1;
		let E2 = json.E.E2;
		let E3 = json.E.E3;


		console.log(A1.minTimeResMs+'\t'+A1.avgTimeResMs+'\t'+A1.maxTimeResMs+'\t'+A.minTimeResMs+'\t'+A.avgTimeResMs+'\t'+'\t'+A.maxTimeResMs)
		console.log(A2.minTimeResMs+'\t'+A2.avgTimeResMs+'\t'+A2.maxTimeResMs+'\t'+A.minTimeResMs+'\t'+A.avgTimeResMs+'\t'+'\t'+A.maxTimeResMs)
		console.log(A3.minTimeResMs+'\t'+A3.avgTimeResMs+'\t'+A3.maxTimeResMs+'\t'+A.minTimeResMs+'\t'+A.avgTimeResMs+'\t'+'\t'+A.maxTimeResMs)

		console.log('\n\n');

		console.log(B1.minTimeResMs+'\t'+B1.avgTimeResMs+'\t'+B1.maxTimeResMs+'\t'+B.minTimeResMs+'\t'+B.avgTimeResMs+'\t'+'\t'+B.maxTimeResMs)
		console.log(B2.minTimeResMs+'\t'+B2.avgTimeResMs+'\t'+B2.maxTimeResMs+'\t'+B.minTimeResMs+'\t'+B.avgTimeResMs+'\t'+'\t'+B.maxTimeResMs)
		console.log(B3.minTimeResMs+'\t'+B3.avgTimeResMs+'\t'+B3.maxTimeResMs+'\t'+B.minTimeResMs+'\t'+B.avgTimeResMs+'\t'+'\t'+B.maxTimeResMs)

		console.log('\n\n');

		console.log(C1.minTimeResMs+'\t'+C1.avgTimeResMs+'\t'+C1.maxTimeResMs+'\t'+C.minTimeResMs+'\t'+C.avgTimeResMs+'\t'+'\t'+C.maxTimeResMs)
		console.log(C2.minTimeResMs+'\t'+C2.avgTimeResMs+'\t'+C2.maxTimeResMs+'\t'+C.minTimeResMs+'\t'+C.avgTimeResMs+'\t'+'\t'+C.maxTimeResMs)
		console.log(C3.minTimeResMs+'\t'+C3.avgTimeResMs+'\t'+C3.maxTimeResMs+'\t'+C.minTimeResMs+'\t'+C.avgTimeResMs+'\t'+'\t'+C.maxTimeResMs)

		console.log('\n\n');

		console.log(D1.minTimeResMs+'\t'+D1.avgTimeResMs+'\t'+D1.maxTimeResMs+'\t'+D.minTimeResMs+'\t'+D.avgTimeResMs+'\t'+'\t'+D.maxTimeResMs)
		console.log(D2.minTimeResMs+'\t'+D2.avgTimeResMs+'\t'+D2.maxTimeResMs+'\t'+D.minTimeResMs+'\t'+D.avgTimeResMs+'\t'+'\t'+D.maxTimeResMs)
		console.log(D3.minTimeResMs+'\t'+D3.avgTimeResMs+'\t'+D3.maxTimeResMs+'\t'+D.minTimeResMs+'\t'+D.avgTimeResMs+'\t'+'\t'+D.maxTimeResMs)

		console.log('\n\n');

		console.log(E1.minTimeResMs+'\t'+E1.avgTimeResMs+'\t'+E1.maxTimeResMs+'\t'+E.minTimeResMs+'\t'+E.avgTimeResMs+'\t'+'\t'+E.maxTimeResMs)
		console.log(E2.minTimeResMs+'\t'+E2.avgTimeResMs+'\t'+E2.maxTimeResMs+'\t'+E.minTimeResMs+'\t'+E.avgTimeResMs+'\t'+'\t'+E.maxTimeResMs)
		console.log(E3.minTimeResMs+'\t'+E3.avgTimeResMs+'\t'+E3.maxTimeResMs+'\t'+E.minTimeResMs+'\t'+E.avgTimeResMs+'\t'+'\t'+E.maxTimeResMs)

		console.log('\n\n');

	}
})
