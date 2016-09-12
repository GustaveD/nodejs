class Utilisateur {

	static findUsers(db, username, callback){

		let assert = require('assert')
		var cursor = db.collection('users').find({name: username})
		cursor.each((err, doc)=>{
			assert.equal(err, null)
			if (doc){
				return true;
			} else{
				return false;
			}
		})
	}

	static create (content, callback){
		let mongo = require('mongodb').MongoClient
		let bcrypt = require('bcryptjs')
		

		mongo.connect("mongodb://localhost/matcha", (err, db)=>{
			if (err) throw err
			else{
				console.log("connecte a la base de donne matcha")
				var user = {name: content.name, email: content.email, pwd: content.pwd}
				
				if (this.findUsers(db, content.name, function(){
					db.close
				}) === true){
					console.log('DEJA PRIS')
				} else{
					console.log('okoook')
				}
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