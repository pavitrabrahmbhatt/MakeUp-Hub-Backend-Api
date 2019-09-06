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
				userUploadedVegan = await Product.find({category:'vegan'}) // add productId == 0
				
				console.log(userUploadedVegan);
				veganProducts.push(userUploadedVegan)

				userUploadedDrugstore = Product.find({category:'drugstore'}) // add productId == 0
				drugstoreProducts.push(userUploadedDrugstore)
				console.log(userUploadedVegan);

				userUploadedLuxury = Product.find({category:'luxury'}) // add productId == 0
				luxuryProducts.push(userUploadedLuxury)
				console.log(userUploadedVegan);

				
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

router.get('/vegan', (req, res, next) => {
  	console.log("hitting the vegan route");
	const url = 'https://makeup-api.herokuapp.com/api/v1/products.json?product_tags=Vegan'
	// console.log(url);
	//use superagent to request api data


	// also get vegan user-added products from db
// add productId == 0
	// userUploadedVegan = Product.find({}).select({category:'vegan'})
	// veganProducts.push(userUploadedVegan)

	superagent
	.get(url)
	.end((error, response) => {
		const products = response.body.map(product => ({
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
		res.send(products)
  	})
})
 

router.get('/drugstore', (req, res, next) => {
  
	const url = 'http://makeup-api.herokuapp.com/api/v1/products.json?price_less_than=10'
	// console.log(url);
	//use superagent to request api data

	// also get user-added drugstore products from db
	// userUploadedDrugstore = Product.find({category:drugstore})
// add productId == 0
	// drugstoreProducts.push(userUploadedDrugstore)

	superagent
	.get(url)
	.end((error, response) => {
		const products = response.body.map(product => ({
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
		const products = response.body.map(product => ({
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
		res.send(products) //-- include user-added here
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
			productId:req.body.productId,
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


// product info route ("show")
router.get('/:productId', async (req,res,next) => {

	const product = await Product.findOne({productId: req.params.productId})

	// STEP 2: use req.query so that if you need to use the API data instead of db, you know which category it came from (i.e. where user clicked in react)

	if(product){

		// if it's on my db --
		// const product = await Product.findById(req.params.productId)
		res.send({
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
			res.send({
				brand:response.body.brand,
			  	name: response.body.name,
			  	// category: response.body.category, req.query.category
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


// favoriting/unfavoriting
router.post('/fav/:productId', async (req, res, next) => {
	console.log("hitting fav route");

	// STEP 2: use req.query here to get category -- react will know it

	const product = await Product.findOne({productId: req.params.productId})

	// get current user from session
	const currentUser = await User.findById(req.session.userId)


	//if product doesnt exist in database
	if(!product) {
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
			  	category: response.body.category,
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

// product delete -- only user-added products, only let owner of that product delete
// STEP 5 if user created it they can delete it, 



// product update
router.put('/:id', async (req, res) => {

	try {
		// STEP 4 -- add code to make sure it's correct user updating


		const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true});

		res.status(200).json({
			success: true,
			code: 200,
			message: "Resource updated successfully",
			data: updatedProduct
		});
	} catch(err){
		next(err)
	}
	
});

// STEP 3 -- update get routes to integrate data correctly


module.exports = router;





