const express = require("express")
const router = express.Router()
const superagent = require('superagent')
const Product = require("../models/product")
const User = require("../models/user")

router.get('/home', async (req, res, next) => {
  
	const url1 = 'https://makeup-api.herokuapp.com/api/v1/products.json?product_tags=Vegan'
	const url2 = 'http://makeup-api.herokuapp.com/api/v1/products.json?price_less_than=10'
	const url3 = 'http://makeup-api.herokuapp.com/api/v1/products.json?price_greater_than=20'
	
	//use superagent to request api data

	// also get products from db that user has added


	superagent
	.get(url1)
	.end((error, response) => {
		const veganProducts = response.body.map(product => ({
			brand:product.brand,
		  	name: product.name,
		  	category: 'vegan',
		  	price: product.price,
		  	imageLink: product.image_link,
		  	description: product.description,
		  	productId: product.id,
		  	createdAt: product.created_at,
		  	productColors: product.product_colors	  	
		}))

		superagent
		.get(url2)
		.end((error, response) => {
			const drugstoreProducts = response.body.map(product => ({
				brand:product.brand,
			  	name: product.name,
			  	category: 'drugstore',
			  	price: product.price,
			  	imageLink: product.image_link,
			  	description: product.description,
			  	productId: product.id,
			  	createdAt: product.created_at,
			  	productColors: product.product_colors	  	
			}))
			superagent
			.get(url3)
			.end(async (error, response) => {
				const luxuryProducts = response.body.map(product => ({
					brand:product.brand,
				  	name: product.name,
				  	category: 'luxury',
				  	price: product.price,
				  	imageLink: product.image_link,
				  	description: product.description,
				  	productId: product.id,
				  	createdAt: product.created_at,
				  	productColors: product.product_colors	  	
				}))
				


				// get user-added products from db
				userUploadedVegan = await Product.find({category:'vegan'})
				veganProducts.push(userUploadedVegan)

				userUploadedDrugstore = Product.find({category:'drugstore'}) 
				drugstoreProducts.push(userUploadedDrugstore)
				
				userUploadedLuxury = Product.find({category:'luxury'}) 
				luxuryProducts.push(userUploadedLuxury)
			

				
				console.log("check terminal");
				// res.send('check terminal')
				res.json([veganProducts, drugstoreProducts, luxuryProducts])
				// {
				// 	veganProducts: veganProducts, etc,
					// drugstore
					// luxuryProducts
					// user
				// }
			})
		})

	})


})

router.get('/vegan', async (req, res, next) => {
  	console.log("hitting the vegan route");
	const url = 'https://makeup-api.herokuapp.com/api/v1/products.json?product_tags=Vegan'
	// console.log(url);
	//use superagent to request api data
	// also get vegan user-added products from db
	


	superagent
	.get(url)
	.end(async (error, response) => {
		let products = response.body.map(product => ({
			brand:product.brand,
		  	name: product.name,
		  	category: 'vegan',
		  	price: product.price,
		  	imageLink: product.image_link,
		  	description: product.description,
		  	productId: product.id,
		  	createdAt: product.created_at,
		  	productColors: product.product_colors	  	
		}))
		userUploadedVegan = await Product.find({category:'vegan',productId:'0'}) 
		// add productId == 0
		console.log(userUploadedVegan);
		console.log(products.length);
		products = products.concat(userUploadedVegan)
		console.log(products.length)
		res.send(products)
  	})
})
 

router.get('/drugstore', (req, res, next) => {
  
	const url = 'http://makeup-api.herokuapp.com/api/v1/products.json?price_less_than=10'
	

	superagent
	.get(url)
	.end(async (error, response) => {
		let products = response.body.map(product => ({
			brand:product.brand,
		  	name: product.name,
		  	category: 'drugstore',
		  	price: product.price,
		  	imageLink: product.image_link,
		  	description: product.description,
		  	productId: product.id,
		  	createdAt: product.created_at,
		  	productColors: product.product_colors	  	
		}))
		userUploadedDrugstore = await Product.find({category:'drugstore', productId:'0'})
		products = products.concat(userUploadedDrugstore)
		res.send(products)
  	})
})

router.get('/luxury', (req, res, next) => {
  
	const url = 'http://makeup-api.herokuapp.com/api/v1/products.json?price_greater_than=20'
	// console.log(url);
	//use superagent to request api data


	// also get user-added luxury products from db
	
// add productId == 0
	// userUploadedLuxury = Product.find({category:luxury})
	// luxuryProducts.push(userUploadedLuxury)

	superagent
	.get(url)
	.end((error, response) => {
		let products = response.body.map(product => ({
			brand:product.brand,
		  	name: product.name,
		  	category: 'luxury',
		  	price: product.price,
		  	imageLink: product.image_link,
		  	description: product.description,
		  	productId: product.id,
		  	createdAt: product.created_at,
		  	productColors: product.product_colors	  	
		}))
		userUploadedLuxury = Product.find({category:'luxury',productId:'0'}) // add productId == 0
		products = products.concat(userUploadedLuxury) //-- include user-added here
		res.send(products)
  	})
})


// product create route
router.post('/upload', async (req, res) => {

	//try {

		console.log(req.body, ' this is req.body');
		console.log(req.session, ' req.session in post route')

		const createdProduct = new Product ({

			brand:req.body.brand,
			name:req.body.name,
			price:req.body.price,
			imageLink:req.body.imageLink,
			description:req.body.description,
			productId:'0',
			category:req.body.category,
			owner: req.session.userId

		}) 

		await createdProduct.save()


		// const createdProduct = await Product.create(req.body);
		// // console.log(req.body.owner)
		// // console.log(req.body.favorites);;
		

		// // STEP 1 set owner based on logged in user
		// owner = 
		// make productId 0 -- indicate that it is user-created

		res.status(201).json({
			success: true,
			code: 201,
			message: "Successfully created product",
			data: createdProduct
		});
});
	//} catch(err) {
	    // res.status(500).json(
			//next(err)
	    // )
	//}
//});



// favoriting/unfavoriting
router.post('/fav/:productId/:id', async (req, res, next) => {
	console.log("hitting fav route");

	// STEP 2: use req.query here to get category -- react will know it


	let product;

	if (req.params.productId == 0){
		// findById
		product = await Product.findById(req.params.id)
	} else {

	// else
		product = await Product.findOne({productId: req.params.productId})

	}

		// get current user from session
		const currentUser = await User.findById(req.session.userId)


		//if product doesnt exist in database
		if(!product) {
			console.log("product is not in db");
			// create it
				// get info from API
			const url = `https://makeup-api.herokuapp.com/api/v1/products/${req.params.productId}.json`
				// add to db	
			superagent
			.get(url)
			.end( async (error, response) => {
				// console.log(response.body);
				const product = {
					brand:response.body.brand,
				  	name: response.body.name,
				  	category:  req.query.category,
				  	price: response.body.price,
				  	imageLink: response.body.image_link,
				  	description: response.body.description,
				  	productId: response.body.id,
				  	createdAt: response.body.created_at,
				  	productColors: response.body.product_colors	  	
				}
				const createdProduct = await Product.create(product)
				// push prod into user favs
				// push user into prod favs
				currentUser.favorites.push(createdProduct)
				createdProduct.favorites.push(currentUser)
				// save user, save product -- db -- async, so must await or use callbacks
				let saveUser = await currentUser.save()
				let saveProduct = await createdProduct.save()
				// respond
				// res.json()
				res.json({
					product: createdProduct,
					currentUser: currentUser,
					// message: created and favorited
				});
			})

		}
		else {
			// push prod into user favs
			// push user into prod favs
			currentUser.favorites.push(product)
			product.favorites.push(currentUser)
			// save user, save product -- db -- async, so must await or use callbacks
			let saveUser = await currentUser.save()
			let saveProduct = await product.save()
			res.json({
				product: product,
				currentUser: currentUser,
				// message: favorited
			});
		}
	

})

// stretch -- unfavoriting
// if there are no more favs for this prod it can be deleted from DB?



// product info route ("show")
router.get('/:productId/:id', async (req,res,next) => {

	let product;

	if (req.params.productId == 0){
		// findById
		product = await Product.findById(req.params.id)
	} else {

	// else
		product = await Product.findOne({productId: req.params.productId})

	}

	

	
	// req.query = /:productId/?category=vegan

	// STEP 2: use req.query so that if you need to use the API data instead of db, you know which category it came from (i.e. where user clicked in react)

	if(product){

		// if it's on my db --
		// const product = await Product.findById(req.params.productId)
		res.json({
			brand:product.brand,
		  	name: product.name,
		  	category: product.category,
		  	price: product.price,
		  	imageLink: product.image_link,
		  	description: product.description,
		  	productId: product.id,
		  	createdAt: product.created_at,
		  	productColors: product.product_colors,
		  	favorites: product.favorites
		})
	} else {
		const url = `https://makeup-api.herokuapp.com/api/v1/products/${req.params.productId}.json`
			// add to db	
		superagent
		.get(url)
		.end( async (error, response) => {
			// console.log(response.body);
			res.json({
				brand:response.body.brand,
			  	name: response.body.name,
			  	category: req.query.category,
			  	price: response.body.price,
			  	imageLink: response.body.image_link,
			  	description: response.body.description,
			  	productId: response.body.id,
			  	createdAt: response.body.created_at,
			  	productColors: response.body.product_colors	  	
			})
		})
	// get info from API and return it

	}
})


// product delete -- only user-added products, only let owner of that product delete

// STEP 5 if user created it they can delete it





// product update
router.put('/:id', async (req, res) => {
console.log("yo update");
	try {
		// STEP 4 -- add code to make sure it's correct user updating
		const product = await Product.findById(req.params.id)
		if(req.session.userId === product.owner) {
			const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true});

			res.status(200).json({
				success: true,
				code: 200,
				message: "Resource updated successfully",
				data: updatedProduct	
			})
		} else {
			res.status(500).json({
				success:false,
				code:500,
				message: "Not your product",

			})
		}
		
	} catch(err){
		next(err)
	}
	
});

router.delete("/:id", async (req, res, next) => {
	const product = await Product.findById(req.params.id)
	if(req.session.userId === product.owner) {
		try {
			console.log("hitting delete route");
			const product = await Product.findByIdAndDelete(req.params.id)
			res.status(200).json({
				success:true,
				code:200,
				meessage:"Product successfully deleted"
			})
		} catch(err) {
			next(err)
		}
	} else {
		res.status(500).json({
			success:false,
			code:500,
			message: "Not your product",

		})
	}
})

// STEP 3 -- update get routes to integrate data correctly


module.exports = router;





