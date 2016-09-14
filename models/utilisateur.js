class Utilisateur {

	static findUsers(db, username, callback){

		let assert = require('assert')
		var cursor = db.collection('users').find({name: username})
		cursor.each((err, doc)=>{
			assert.equal(err, null)
			console.log(doc)
			if (doc){
				callback(doc)
			} else{
				callback()
			}
		})
	}

	static findUsers2(db, username){
		let assert = require('assert')
		var cursor = db.collection('users').find({name: username})
		cursor.each((err, doc)=>{
			assert.equal(err, null)
			console.log(doc)
			if (doc){
				
			}else{
				return false;
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

	static create (request, response, callback){
		let mongo = require('mongodb').MongoClient
		let bcrypt = require('bcryptjs')
		

		mongo.connect("mongodb://localhost/matcha", (err, db)=>{
			let error;
			if (err) throw err
			else{
				console.log("connecte a la base de donne matcha")
				var user = {name: request.body.name, email: request.body.email, pwd: request.body.pwd}

				if ((this.findUsers2(db, request.body.name)) == true){
					console.log('Le nom n\'est pas disponible')
				}
				else{
					this.insertUser(db, user, (res)=>{
						callback(res)
					})
				}
				
				/*this.findUsers(db, request.body.name, (doc)=>{
					console.log(doc , '  blbla')
					if (doc){
						console.log("le nom n\'est pas disponible")
						db.close
						request.flash('error', "Un Utilisateur utilise deja ce pseudo")
						done(null, err)
						//response.redirect('/inscription')

					} else {
						console.log('Le nom est disponible')
						this.insertUser(db, user, (res)=>{
							return callback(res)
						})
					}
					db.close;
				})*/
			}
		})
	}
}

module.exports= Utilisateur