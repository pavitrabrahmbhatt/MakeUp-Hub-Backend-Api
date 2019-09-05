const User = require("./user")
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
	brand: {
		type: String,
	},
	category: {
		type: String,
		// enum: ['Vegan','Drugstore','Luxury']
	},
	name: String,
	price: String,
	imageLink: String,
	description: String,
	productId: String, // from api
	createdAt: String,
	productColors: [],
	favorites:[{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User' // use mongoose refs here https://mongoosejs.com/docs/populate.html
	}]
  	// added: ref User if added by user, null otherwise 

  	// category: enum https://mongoosejs.com/docs/schematypes.html#string-validators

})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;