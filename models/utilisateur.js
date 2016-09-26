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

static findUsers3(username, callback){

		let mongo = require('mongodb').MongoClient;

		mongo.connect("mongodb://localhost/matcha", (err, db)=>{
			let error;
			if (err){
				throw err
			}
			else{
				console.log("connecte a la base de donne matcha")
				db.collection('users').find({name: username}).toArray(function (err, result) {
     		 	if (err) {
     		   		callback (err);
     		 	} else if (result.length) {
       		 		console.log('Found:', result);
    		  	} else {
      		  		console.log('No document(s) found with defined "find" criteria!');
      		  		result = undefined
     		 	}
     		 	callback(result)
   		 		});
			}
		})
	}


	static insertUser(db, user, callback){
		db.collection("users").insert(user, null, (err, res)=>{
			if (err) throw err
			else{
				console.log("l'utilisateur a bien ete enregistre")
				callback(res)
			}
			
		})
	}

	static modifUser(request, callback){
		let mongo = require('mongodb').MongoClient;

		mongo.connect("mongodb://localhost/matcha", (err, db)=>{
			console.log("MODIF INFORMATION USER-----")
			if (err){
				throw err
			} else{
				//console.log("REQUEST: ", request)
				console.log(request.body.pseudo)
				console.log("connecte a la bdd")
				var user ={name: request.body.pseudo, email: request.body.email, pwd: request.body.pwd,
							nom: request.body.nom, prenom: request.body.prenom}

				console.log("USER: ", user)
				callback()
			}
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

				this.findUsers(db, request.body.name, (doc)=>{
					console.log(doc , '  blbla')
					if (doc){
						console.log("le nom n\'est pas disponible")
						db.close
						request.flash('error', "Un Utilisateur utilise deja ce pseudo")

					} else {
						console.log('Le nom est disponible')
						this.insertUser(db, user, (res)=>{
							return callback(res)
						})
					}
					db.close;
				})
			}
		})
	}
}

module.exports= Utilisateur