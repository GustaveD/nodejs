let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let cookieParser = require('cookie-parser')
let session = require('express-session')
let passport = require('passport')
let passportLocal = require('passport-local')
let Q = require('q')


////////////////VIEW

app.set('view engine', 'ejs')




////////////////MIDDLEWARE

app.use('/assets', express.static('public'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// pour creer une session 
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

//	creation d'un middleware pour les messages flash
app.use(require('./middlewares/flash'))

// PASSPORT
app.use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new passportLocal.Strategy((username, pwd, done)=>{
	//MONGOOOMACHIN

	if (username === pwd){
		done(null, {id: 123, name: username})
	}

}))



///////////////////ROUTAGE 

app.get('/', (request, response)=> {
//	retourne une vue HTML
	response.render('pages/index2')
})

app.get('/inscription', (request, response)=>{
	response.render('pages/inscription')
})

app.get('/login', (request, response, next)=>{
	passport.authenticate('local', function(err, user, info) {
    	if (err) { return next(err); }
    	if (!user) { return response.redirect('/login'); }
    	request.logIn(user, function(err) {
    	  if (err) { return next(err); }
    	  return response.redirect('/users/' + user.username);
    	});
  	})(req, response, next);
})

			///INSCRIPTION
app.post('/inscription', (request, response)=>{
	console.log(request.body)
	if (request.body.email === undefined || request.body.email == ''){
		request.flash('error', "Mettez une adresse email svp")
		response.redirect('/inscription')
	}
	else if (request.body.name === undefined || request.body.name == ''){
		request.flash('error', "Mettez un nom svp")
		response.redirect('/inscription')
	}
	else if (request.body.pwd === undefined || request.body.pwd == ''){
		request.flash('error', "Mettez un password svp")
		response.redirect('/inscription')
	}
	else{
		let Utilisateur = require('./models/utilisateur')
		var deffered = Q.defer()

		Utilisateur.create(request.body, function(){
			request.flash('sucess', "Merci!")
			response.redirect('/')
		})
	}
})

			///LOGIN
app.post('/login', passport.authenticate('local', {successRedirect: '/', 
													failureRedirect: '/login',
														failureFlash: true})

)









app.listen(3000)