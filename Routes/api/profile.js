const express = require('express');
const router = express.Router();
const Profile = require("../../models/Profile");
const Post = require("../../models/Post");
const User = require("../../models/User");
const auth = require("../../middleware/auth");
const {check,validationResult} = require("express-validator");
const normalize = require('normalize-url');
const request = require("request");
const config = require('config');

//@route  GET        api/profile/me
//@desc   Get current users profile
//@access Private (SInce you can get profile only if you have provided the unique token i.e JSON Web Token)

router.get('/me',auth,async (req,res)=>{
     try{
        const profile = await Profile.findOne({
            user:req.user.id, //req has "user" property after verification of JWT
                            //Here we are finding bu usr id since that is what we have in profileSchema
        }).populate('user',['name','avatar']);

        if(!profile)
        {
            return res.status(400).json({msg:"There is no profile for this user"});
        }
        res.json(profile);

     }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
     }
})

//@route  POST        api/profile
//@desc   Crate or update a user profile (here experienc and education arent added they are added from another route)
//@access Private
router.post("/",[
    auth,
    check("status","Status is required").notEmpty(),
    check("skills","Skills required").notEmpty()
],async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors:errors.array()});
    }

    // destructure the request
    const {
        website,
        skills,
        youtube,
        twitter,
        instagram,
        linkedin,
        facebook,
        // spread the rest of the fields we don't need to check
        ...rest
      } = req.body;
  
      // build a profile
      const profileFields = {
        user: req.user.id,
        website:
          website && website !== ''
            ? normalize(website, { forceHttps: true })
            : '',
        skills: Array.isArray(skills)
          ? skills
          : skills.split(',').map((skill) => ' ' + skill.trim()),
        ...rest
      };
  
      // Build socialFields object
      const socialFields = { youtube, twitter, instagram, linkedin, facebook };
  
      // normalize social fields to ensure valid url
      for (const [key, value] of Object.entries(socialFields)) {
        if (value && value.length > 0)
          socialFields[key] = normalize(value, { forceHttps: true });
      }
      // add to profileFields
      profileFields.social = socialFields;

      try {
        // Using upsert option (creates new doc if no match is found):
        let profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        return res.json(profile);
      } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
      }
  
      
})

// @route    GET api/profile
// @desc     Get all profiles
// @access   Public
router.get("/",async (req,res)=>{
    try {
        const profiles = await Profile.find({}).populate("user",["name","avatar"]);
        res.json(profiles);
    }catch(err){
        console.log(err.message);
        res.status(500).send('Server Error');
    }
})

// @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public
router.get("/user/:user_id",async (req,res)=>{
    const {user_id} = req.params;
    try {
        const profile = await Profile.findOne({user:user_id}).populate("user",["name","avatar"]);
        if(!profile)
        {
            return res.status(400).json({msg:"Profile not found"});
        }

        res.json(profile);
    }catch(err){
        console.log(err.message);
        if(err.kind=="ObjectId")
        {
            return res.status(400).json({msg:"Profile not found"});
        }
        res.status(500).send('Server Error');
    }
})

// @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private
router.delete("/",auth,async (req,res)=>{
    try {
        //Delete user's posts
        await Post.deleteMany({user:req.user.id});
        //Delete profile
        await Profile.findOneAndRemove({user:req.user.id}).populate("user",["name","avatar"]);
        //Delete User
        await User.findOneAndRemove({_id:req.user.id})
        res.json({msg:"User deleted"});
    }catch(err){
        console.log(err.message);
        res.status(500).send('Server Error');
    }
})


// @route    PUT api/profile/experience
// @desc     Add profile experience
// @access   Private
router.put("/experience",
[
    auth,
    check("title","Title is required").notEmpty(),
    check("company","Company is required").notEmpty(),
    check("from","From date is required").notEmpty(),
],async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors:errors.array()});
    }
    const {
        title,
        company,
        description,
        from,
        to,
        current,
        location
    } = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }

    try {
        const profile = await Profile.findOne({ user: req.user.id });
        profile.experience.unshift(req.body); //unshift pushes to the beginning of the array
        await profile.save();
        res.json(profile);
    }catch(err){
        console.log(err.message);
        res.status(500).send("Server error");
    }
})

// @route    DELETE api/profile/experience/:exp_id
// @desc     Delete experience from profile
// @access   Private

router.delete("/experience/:exp_id",auth,async (req,res)=>{
    try {
        const foundProfile = await Profile.findOne({ user: req.user.id });

        foundProfile.experience = foundProfile.experience.filter(
        (exp) => exp._id.toString() !== req.params.exp_id
        );

        await foundProfile.save();
        return res.status(200).json(foundProfile);

    } catch (err) {
        console.error(error);
        return res.status(500).json({ msg: 'Server error' });
    }
})

// @route    PUT api/profile/education
// @desc     Add profile education
// @access   Private
router.put(
    '/education',
    [
        auth,
    check('school', 'School is required').notEmpty(),
    check('degree', 'Degree is required').notEmpty(),
    check('fieldofstudy', 'Field of study is required').notEmpty(),
    check('from', 'From date is required and needs to be from the past')
      .notEmpty()
      .custom((value, { req }) => (req.body.to ? value < req.body.to : true))
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        const profile = await Profile.findOne({ user: req.user.id });
  
        profile.education.unshift(req.body); //unshift adds to beginning of array
  
        await profile.save();
  
        res.json(profile);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
  );
  
  // @route    DELETE api/profile/education/:edu_id
  // @desc     Delete education from profile
  // @access   Private
  
  router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
      const foundProfile = await Profile.findOne({ user: req.user.id });
      foundProfile.education = foundProfile.education.filter(
        (edu) => edu._id.toString() !== req.params.edu_id
      );
      await foundProfile.save();
      return res.status(200).json(foundProfile);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: 'Server error' });
    }
  });
  
// @route    GET api/profile/github/:username
// @desc     Get user repos from Github
// @access   Public (Since anyone should be able ot view the repos of others we dont need to be authorised)
router.get("/github/:username",async (req,res)=>{
    try {
        const options = {
            uri:`https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
            method:"GET",
            headers:{
                "user-agent":"node.js"
            }
        };
        request(options,(error,response,body)=>{
            if(error) console.log(error);

            if(response.statusCode!==200){
                return res.status(404).json({msg:"No Github profile found"});
            }
            res.json(JSON.parse(body));
        })
    } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
    }
})


module.exports = router;