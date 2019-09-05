const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/makeup-hub', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false
});

mongoose.connection.on('connected', () => {
 	console.log('Mongoose is connected')
});

mongoose.connection.on('error', (err) => {
	console.log(err, ' mongoose failed to connect')
});

mongoose.connection.on('disconncted', () => {
	console.log('Mongoose is disconnected')
});