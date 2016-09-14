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

////////////// PASSPORT
app.use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())


/*
//===============PASSPORT=================

// Passport session setup.
passport.serializeUser(function(user, done) {
  console.log("serializing " + user.username);
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  console.log("deserializing " + obj);
  done(null, obj);
});

// Use the LocalStrategy within Passport to login users.
passport.use('local-signin', new LocalStrategy(
  {passReqToCallback : true}, //allows us to pass back the request to the callback
  function(req, username, password, done) {
    funct.localAuth(username, password)
    .then(function (user) {
      if (user) {
        console.log("LOGGED IN AS: " + user.username);
        req.session.success = 'You are successfully logged in ' + user.username + '!';
        done(null, user);
      }
      if (!user) {
        console.log("COULD NOT LOG IN");
        req.session.error = 'Could not log user in. Please try again.'; //inform user could not log them in
        done(null, user);
      }
    })
    .fail(function (err){
      console.log(err.body);
    });
  }
));

// Use the LocalStrategy within Passport to Register/"signup" users.
passport.use('local-signup', new LocalStrategy(
  {passReqToCallback : true}, //allows us to pass back the request to the callback
  function(req, username, password, done) {
    funct.localReg(username, password)
    .then(function (user) {
      if (user) {
        console.log("REGISTERED: " + user.username);
        req.session.success = 'You are successfully registered and logged in ' + user.username + '!';
        done(null, user);
      }
      if (!user) {
        console.log("COULD NOT REGISTER");
        req.session.error = 'That username is already in use, please try a different one.'; //inform user could not log them in
        done(null, user);
      }
    })
    .fail(function (err){
      console.log(err.body);
    });
  }
));

// Simple route middleware to ensure user is authenticated.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  req.session.error = 'Please sign in!';
  res.redirect('/inscription');
}


*/



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
    let mongo = require('mongodb').MongoClient
    let bcrypt = require('bcryptjs')
    //let Utilisateur = require('./models/utilisateur')
		let Utilisateur = require('./models/utilisateur')
		var deffered = Q.defer()

		Utilisateur.create(request, response, function(){
			request.flash('sucess', "Merci!")
			response.redirect('/')
		})
    /*mongo.connect("mongodb://localhost/matcha", (err, db)=>{
      if (err) throw err
      else{
        Utilisateur.findUsers(db, request.body.name, (doc)=>{
          if (doc){
            console.log('dans doc')
            request.flash('error', "Un Utilisateur utilise deja ce pseudo")
           // response.redirect('/inscription')
          } else{
            var user = {name: request.body.name, email: request.body.email, pwd: request.body.pwd}
            console.log(user)
          }
        })

      }
    })*/
	}
})

			///LOGIN
app.post('/login', passport.authenticate('local', {successRedirect: '/', 
													failureRedirect: '/login',
														failureFlash: true})

)










app.listen(3000)