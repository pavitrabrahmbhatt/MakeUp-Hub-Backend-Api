const Product = require("./product")

const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
	username: String,
	password: String,
	userId: String,
	favorites: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Product' // use mongoose refs here https://mongoosejs.com/docs/populate.html
	}],
	admin: Boolean
});



const User = mongoose.model('User', UserSchema);
module.exports = User;