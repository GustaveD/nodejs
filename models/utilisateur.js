class Utilisateur {

	static findUsers(db, username, callback){

		let assert = require('assert')
		var cursor = db.collection('users').find({name: username})
		cursor.each((err, doc)=>{
			assert.equal(err, null)
			if (doc){
				callback(doc)
			} else{
				callback()
			}
		})
	}

	static insertUser(db, user, callback){
		db.collection("users").insert(user, null, (err, res)=>{
			if (err) throw err
			else
			console.log("l'utilisateur a bien ete enregistre")
			callback(res)
		})
	}

	static create (content, callback){
		let mongo = require('mongodb').MongoClient
		let bcrypt = require('bcryptjs')
		

		mongo.connect("mongodb://localhost/matcha", (err, db)=>{
			let error;
			if (err) throw err
			else{
				console.log("connecte a la base de donne matcha")
				var user = {name: content.name, email: content.email, pwd: content.pwd}
				
				this.findUsers(db, content.name, (doc)=>{
					if (doc){
						console.log("le nom n\'est pas disponible")
						return ;

					} else {
						console.log('Le nom est disponible')
						this.insertUser(db, user, (res)=>{
							return callback(res)
						})
					}
					db.close
				})
			}
		})
	}
}

module.exports= Utilisateur