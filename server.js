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


  var get_ip = require('ipware')().get_ip;
    app.use(function(req, res, next) {
        var ip_info = get_ip(req);
        console.log("=-----IP_INFOO SERVERJS", ip_info);
        // { clientIp: '127.0.0.1', clientIpRoutable: false }
        next();
    });


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
      console.log('BIEN CONNECTE')
      if (err){
        console.log(err)
      }else{
        if (result[0])
        {
          req.user = result[0];
          console.log("-----REQUEST-USER:", req.user)
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
    req.flash('error', "il faut s'autentifier")
    res.redirect('/login');
  } else {
    next();
  }
};


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

app.get('/compte', requireLogin, (request, response)=>{
  response.render('pages/compte')
})

app.get('/dashboard', requireLogin, (request, response)=>{
  response.render('pages/dashboard')
})

app.get('/logout', (request, response)=>{
  request.session.destroy()
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
		let Utilisateur = require('./models/utilisateur')

		Utilisateur.create(request, response, function(res){
      console.log('coucou')
			request.flash('sucess', "merci") //  /!\ ne s'affiche pas
			response.redirect('/')
		})
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
          request.flash('success', "bien Connecte")
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


      ////COMPTE
app.post('/compte', (request, response)=>{

  let Utilisateur = require('./models/utilisateur')
  Utilisateur.modifUser(request, (res, err)=>{
    if (err){
      console.log('error: ', err)
    } else {
      request.flash('success', "informations bien enregistrées")
    }
  })
  response.redirect('/')
})

app.listen(3000)