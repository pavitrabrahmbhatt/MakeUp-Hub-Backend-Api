const express = require('express');
const router  = express.Router();
const User    = require('../models/user');
const bcrypt  = require('bcrypt');


router.post('/login', async (req, res) => {
	console.log("login");
  // First query the database to see if the user exists
	try {

	    const foundUser = await User.findOne({username: req.body.username});
	    console.log(foundUser, ' foundUser');

	    if(foundUser) {

	      // bcrypt compare returns true or false
	    if(bcrypt.compareSync(req.body.password, foundUser.password)){
	        req.session.userId = foundUser._id;
	        req.session.username = foundUser.username;
	        req.session.logged = true;

	        res.status(200).json({
				success: true,   
				code: 200,
				message: `User ${foundUser.username} logged in`
	        })

	    } else {
	        console.log("bad password")
	        res.status(200).json({
				success: false,     
				code: 200,
				message: 'Username or password incorrect'
	    	})
	    }

    	} else {
      	// user not found
		console.log("username not found")

			res.status(200).json({
				success: false,     
				code: 200,
				message: 'Username or password incorrect'
			})
		}
	} catch(err){
		res.status(500).json({
			success: false,
			code: 500,
			message: "Internal server error",
			error: err
		})
	}

});




router.post('/register', async (req, res, next) => {

  console.log("hitting register route")

  	// create our user
  	try {

	    const userExists = await User.findOne({username: req.body.username})
	    if(userExists) {
			res.status(200).json({
				success: false,
				code: 200,
				message: "Username already taken"
			})
	    }
	    // username not taken
	    else {

			const hashedPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

			const createdUser = await User.create({
				username: req.body.username,
				password: hashedPassword
			});

			// set info on the session
			req.session.userId = createdUser._id;
			req.session.username = createdUser.username;
			req.session.logged = true;

			res.status(200).json({
				success: true,
				code: 200,
				message: `User ${createdUser.username} successfully registered`
			})
		}

	} catch (err) {

		res.status(500).json({
			success: false,
			code: 500,
			message: "Internal server error",
			error: err
		})
	}

});

router.get('/:id', async (req, res, next) => {
	console.log("hitting get info about user -- profile route");
     try  {
		const foundUser = await User.findById(req.params.id);
		res.status(200).json({
			success: true,
			code: 200,
			message: "Success",
			data: foundUser
		});

      } catch (err){
      	next(err)
		// res.status(500).json({
		// 	success: false,
		// 	code: 500,
		// 	message: "Internal server error",
		// 	error: err
		// })
      }

});

router.put('/:id', async (req, res) => {

	try {
		const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
		res.status(200).json({
			success: true,
			code: 200,
			message: "Resource updated successfully",
			data: updatedUser
		});
	} catch(err){
		res.status(500).json({
			success: false,
			code: 500,
			message: "Internal server error",
			error: err
		})
	}
});

 



module.exports = router;



