const express = require('express');
const router = express.Router();
const {check,validationResult} = require("express-validator");
const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

//@route  GET        api/users
//@desc   Test Route
//@access Public
router.get('/',(req,res)=>{
    res.send("User route");
})


//@route  POST        api/users
//@desc   Register user
//@access Public
router.post('/',[
    check("name","Name is required").notEmpty(), //checks if "name" property in any of req.body or
                                                //req.params or req.query or req.headers is not empty if any "name" property found empty then generates eror with 
                                                //msg - "Name is required"
    check("email","Valid Email required").isEmail(),
    check(
        'password',
        'Please enter a password with 6 or more characters'
      ).isLength({ min: 6 })
],
async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).send(errors);
    }
    const {name,email,password} = req.body;

    try {
        //Check if user already exists
        let user = await User.findOne({email});

        if(user) { //user already exists
            return res.status(400).json({errors:[{msg:"User already exists"}]});
        }
        //Get users gravatar
        const avatar = gravatar.url(email,{
            s:'200',
            r:'pg',
            d:"mm"
        })

        user = new User ({
            name,
            email,
            avatar,
            password
        })

        //Encrypt password using bcrypt
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        const payload = {
            user: {
              id: user._id
            }
          };

          jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err;
              res.json({ token });
            }
          );

        //Return json web token
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
})

module.exports = router;