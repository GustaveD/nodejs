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
				console.log("-----FIND USER MONGO")
				db.collection('users').find({name: username}).toArray(function (err, result) {
     		 	if (err) {
     		   		callback (err);
     		 	} else if (result.length) {
    		  	} else {
      		  		console.log('No document(s) found with defined "find" criteria!');
      		  		result = undefined
     		 	}
     		 	callback(result)
   		 		});
			}
		})
	}

	static updateUser(user, db, username, callback){
		console.log('-----UPDATE USER: ', username)
		db.collection("users").updateOne({"name": username}, {$set: {"email": user.email, "pwd": user.pwd,
											"nom": user.nom, "prenom": user.prenom, "like": user.like,
											"popularite": user.popularite}}, (err, res)=>{
			if (err) console.log("----/!/----ERROR UPDATE",err)
			console.log("fin update")
			callback()
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
		var geoip = require('geoip-lite')
		var get_ip = require('ipware')().get_ip;



		var ip_info = get_ip(request)

		console.log("----IPPP INFOOO", ip_info.clientIP)

		var geo= geoip.lookup(ip_info)

		console.log("---GEOOOO", geo)

		mongo.connect("mongodb://localhost/matcha", (err, db)=>{
			console.log("MODIF INFORMATION USER-----")
			if (err){
				throw err
			} else{
				console.log('-----MODIF USER: ')
				var user = {email: request.body.email, pwd: request.body.pwd, nom: request.body.nom,
								prenom: request.body.prenom, like: 0, popularite: 0}
				console.log('---New User: ', user)
				this.updateUser(user, db, request.user.name, (res)=>{
					console.log('-----FIN MODIF USER')
				})

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