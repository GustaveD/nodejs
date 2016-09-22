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

app.use(function (req, res, next) {
  console.log('Time:', Date.now());
  next();
});

app.use(function(req, res, next){
  if (req.session && req.session.user){
    let Utilisateur = require('./models/utilisateur')
    Utilisateur.findUsers3(req.session.user.name, (result, err)=>{
      console.log('dashhhboard', result)
      if (err){
        console.log(err)
      }else{
        if (result[0])
        {
          req.user = result[0];
          console.log(req.user)
          delete req.user.pwd;
          req.session.user = result[0];
          res.locals.user = result[0];

        } else{

        }
        next();
      }
    })
  } else{
    console.log('non log')
    next();
  }
})

function requireLogin (req, res, next) {
  if (!req.user) {
    res.redirect('/login');
  } else {
    next();
  }
};



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

app.get('/login', (request, response)=>{
  response.render('pages/login')
})

app.get('/compte', (request, response)=>{
  response.render('pages/compte')
})

app.get('/dashboard', requireLogin, (request, response)=>{
//  if (request.session && request.session.user){
//    //Check if session exists
//    //lookup the user in the db by pullin their email from the sesssion
//    let Utilisateur = require('./models/utilisateur')
//    Utilisateur.findUsers3(request.session.user.name, (result, err)=>{
//      console.log('dashhhboard', result)
//      if (err){
//        console.log(err)
//      }else{
//        if (result[0] === undefined){
//          request.session.reset();
//          response.redirect('/login');
//        } else{
//          response.locals.user = result[0];
//          response.render('pages/dashboard')
//        }
//      }
//    })
//  } else{
//    response.redirect('/login')
//  }
  response.render('pages/dashboard')

})

app.get('/logout', (request, response)=>{
  request.session.reset()
  console.log('log out ok')
  response.redirect('/')
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

  /*  mongo.connect("mongodb://localhost/matcha", (err, db)=>{
      if (err) throw err
      else{
       db.collection('users').find({name: request.body.name}).toArray(function (err, result) {
          if (err) throw err
           else if (result.length) {
           console.log('pseudo deja utilise');
           request.flash('error', "Quelqu'un utilise deja ce nom")
           response.redirect('/inscription')
          } else {
            var user = {name: request.body.name, email: request.body.email, pwd: request.body.pwd};
            db.collection("users").insertOne(user, null, (err, res)=>{
              if (err) throw err
              else{
                console.log("l'utilisateur a bien ete enregistre")
                console.log(res.name)
              }
            })

         }
      })
    }
	})*/
  }
})

			///LOGIN
app.post('/login', (request, response)=>{
    let Utilisateur = require('./models/utilisateur')
  Utilisateur.findUsers3(request.body.name, (result, err)=>{
    if (err){
      console.log('error: ', err)
    } 
    else{
      if (result === undefined){
        request.flash('error', "Pseudo inconnu")
      }else{
          console.log('REQUEST', request.body.password)
          console.log('PASS', result[0].pwd)
        if (request.body.password === result[0].pwd){
          //set info cookie
          request.flash('success', "bien enregistre")
          request.session.user = result[0];
          console.log('SESSION USER', request.session.user)
        }
        else{
          request.flash('error', "mauvais mdp")
        }
      }
    }
    response.redirect('/');
  })
})









app.listen(3000)