let mongo      = require('mongodb').MongoClient;

mongo.connect("mongodb://localhost/matcha", function(error, db){
	if (err) throw err
	else
		console.log("connecté a la base de donne 'matcha'")
})

module.exports = mongo