let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let session = require('express-session')



////////////////VIEW

app.set('view engine', 'ejs')




////////////////MIDDLEWARE

app.use('/assets', express.static('public'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

// pour creer une session 
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

//	creation d'un middleware pour les messages flash
app.use(require('./middlewares/flash'))





///////////////////ROUTAGE 

app.get('/', (request, response)=> {


	//console.log(request.session)
//	retourne une vue HTML
	response.render('pages/header2')
})

app.get('/header2', (request, response)=>{
	response.render('pages/header2')
})

app.get('/inscription', (request, response)=>{
	response.render('pages/inscription')
})

//	recuperer les valeurs du formulaire post
app.post('/', (request, response)=>{

	console.log(request.body)
	if (request.body.message === undefined || request.body.message == ''){
		request.flash('error', "Vous n'avez pas poste de message")
		response.redirect('/')
	}
	else{
		let Message = require('./models/message')
		Message.create(request.body.message, function(){
			request.flash('success', "Merci !")
			response.redirect('/')
		})
	}
	
})

app.post('/inscription', (request, response)=>{
	

})

app.listen(3000)