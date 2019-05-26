var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var loopingcount = 1;
var databaseinfo = [];

//Set Base For Database
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  dbo.collection("customers").find({}).toArray(function(err, result) {
databaseinfo = result;
db.close();
});
});


function myFunction() {
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  dbo.collection("customers").find({}).toArray(function(err, result) {
    if (err) throw err;
	
	console.log("old");
	console.log(databaseinfo);
	console.log("new"); 
	console.log(result);

	
	
	if (JSON.stringify(databaseinfo) == JSON.stringify(result)){
		console.log("no change")
	}
	
	if (JSON.stringify(databaseinfo) != JSON.stringify(result))
	{
	console.log("Change Was Found ")
	databaseinfo = result;

	//code to send info to team desk
	}
	

	db.close();
	
	
	setTimeout(function (){
	loopingcount++;
	console.log("CheckNumber " + loopingcount)
	myFunction();
}, 5000);
  });
});
}


myFunction();
