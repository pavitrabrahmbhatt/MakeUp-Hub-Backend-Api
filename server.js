require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser');
const router  = express.Router();
const User = require('./models/user');
const Product = require('./models/product')
const bcrypt  = require('bcrypt');
const methodOverride = require('method-override');
const app = express()
//app.use(express.static('public'))
const cors = require('cors');
const session = require('express-session')

require('./db/db');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false
}))

app.use((req, res, next) => {
	try {
		if(req.session.loggedIn) {
			res.locals.user = req.session.user
		} else {
			res.locals.user = undefined
		}
		next()// 
	} catch(err) {
		next(err)
	}
})

const corsOptions = {
	origin: 'http://localhost:3000/', // when deploy react app, this is where you put the address
	credentials: true, 
	optionsSuccessStatus: 200 
}

//app.use(cors(corsOptions));


app.get('/', (req,res,next) => {
	console.log(req.query);
	console.log("GET Request");
	res.json({
		message: "You hit the GET / ROUTE"
	})
})

app.post('/demo-postman', (req, res, next) => {
	res.status(201).json({
		status: 201,
		message: "request received",
		dataRecieved: req.body
	})
})

// app.get('*', (req, res) => {
// 	
// })


const authController  = require('./controllers/authController');

app.use('/auth', authController);

const productController  = require('./controllers/productController');

app.use('/products', productController);


const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.info(`Server has started on ${PORT}`))


