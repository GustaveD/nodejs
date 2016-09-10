class Utilisateur {


	static create (content, callback){
		let mongo = require('mongodb').MongoClient;

		mongo.connect("mongodb://localhost/matcha", (err, db)=>{
			if (err) throw err
			else{
				console.log("connecte a la base de donne matcha")

				var user = {name: content.name, email: content.email, pwd: content.pwd}
				db.collection("users").insert(user, null, (err, res)=>{
					if (err) throw err
					else
						console.log("l'utilisateur a bien ete enregistre")
					callback(res)
				})
			}
		})
	}

}

module.exports= Utilisateur