var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


var timerCheck = 10000;

var loopingcount = 1;
var databaseinfo = [];
var sinceChange = 1;

var addedRecordCount;

var maxRecords;
var changeRecords = [];

var d;
var hour = "23";
var minuites = "59";
var displayMinuites = "59";

var targetTime = "23:59";

//Set Base For Database
MongoClient.connect(url, function (err, db) {
	if (err) {
		console.log('\x1b[41m', 'Error');
		console.log("\x1b[0m", "No Database Info Found");
		throw err;
	}
	
	var dbo = db.db("mydb");
	dbo.collection("customers").find({}).toArray(function (err, result) {
		databaseinfo = result;
		db.close();
	});
});

function myFunction() {
	// d = new Date();
	// hour = d.getHours();
	// minuites = d.getMinutes();
	if (minuites < 10) {
		displayMinuites = "0" + minuites;
	}
	else {
		displayMinuites = minuites;
	}
	console.log("It is currently : " + hour + ":" + displayMinuites);

	if (targetTime == hour + ":" + displayMinuites) {
		console.log("Start Time Found ,Checking For Changes")

		MongoClient.connect(url, function (err, db) {
			if (err) throw err;
			var dbo = db.db("mydb");
			dbo.collection("customers").find({}).toArray(function (err, result) {
				if (err) throw err;
				if (JSON.stringify(result) == "[]") {
					console.log('\x1b[41m', 'Error');
					console.log("\x1b[0m", "No Database Info Found");
				}
				else {
					if (JSON.stringify(databaseinfo) == JSON.stringify(result)) {
						console.log("No Change")
						sinceChange++;
						console.log("Checks Since Last Change " + sinceChange)
					}
					if (JSON.stringify(databaseinfo) != JSON.stringify(result)) {
						maxRecords = Math.max(result.length, databaseinfo.length)
						console.log(maxRecords);
						for (i = 0; i < maxRecords; i++) {
							if (JSON.stringify(databaseinfo[i]) == JSON.stringify(result[i])) {
								console.log("Record " + i + " Are The Same")
							}
							else if (JSON.stringify(databaseinfo[i]) != JSON.stringify(result[i])) {
								console.log("Record " + i + " Are Not The Same")
								changeRecords.push(i);
								console.log("Record Change From ")
								console.log(databaseinfo[i]);
								console.log("To ");
								console.log(result[i]);
							}
						}
						console.log("Change Rows " + changeRecords);
						console.log("A Change Was Found ");
						

						console.log(databaseinfo.length + " Records Found In Old Version");
						console.log(result.length + " Records Found In New Version");
						addedRecordCount = result.length - databaseinfo.length;
						console.log("The Difference Is ");
						console.log(addedRecordCount);
						console.log(" New Records");
						
						
						
						
						databaseinfo = result;
						
					}
				}
				changeRecords = [];
				db.close();
			})
	});
}
else
{
	console.log("Start Time Not Found ,Will Wait For " + targetTime)
}
setTimeout(function () {
		myFunction();
	}, timerCheck);
	
};

myFunction();
