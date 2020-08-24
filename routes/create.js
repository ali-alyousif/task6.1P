var express = require('express');
var router = express.Router();
var cors = require('cors')
var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt')
var nodemailer = require('nodemailer');

const User = require('../models/users')
router.use(cors())

/* GET home page. */
/*
router.get('/', function(req, res, next) {
  res.render('signup', { title: 'Express' });
});
*/

router.post('/', (req, res) => {
	const today = new Date()
	const UserData = {
		first_name : req.body.firstname,
		last_name : req.body.lastname,
		email : req.body.email,
		password : req.body.password,
		created : today
	}
	
	//console.log(UserData);
	
	User.findOne({
		email: req.body.email
	})
	.then ( user => {
	    if(!user){
			bcrypt.hash(req.body.password, 10, (err, hash) => {
				UserData.password = hash
				
				User.create(UserData)
				   .then(user => {
					   //res.json({status:user.email + 'Registered'})
					   console.log('Success');
                       
                       
                       //Send Email
                       var transporter = nodemailer.createTransport({
                          service: 'gmail',
                          auth: {
                            user: 'work.task90@gmailcom',
                            pass: 'PASSWORD'
                          }
                        });
                        
                        var mailOptions = {
                          from: 'youremail@gmail.com',
                          to: req.body.email,
                          subject: 'Registration Complete',
                          text: 'Welcome, your registration has been complete successfully!'
                        };

                        transporter.sendMail(mailOptions, function(error, info){
                          if (error) {
                            console.log(error);
                          } else {
                            console.log('Email sent: ' + info.response);
                          }
                        });

                       
				   })
				   .catch(err => {
					   //res.send('error: '+ err)
					   console.log('Error')
				   })
			})
		}
		else {
			//res.json({error: 'User already exists'})
			console.log('User already exists');
		}
	})
	
	res.render('signup', { title: 'Express' });
})

module.exports = router;
