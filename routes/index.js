const express = require('express')
const router = express.Router()
const {ensureAuth,ensureGuest} =require('../middleware/auth')
const Story = require('../models/story')


// description = login/landing page
// route  = GET
router.get('/',ensureGuest,(req,res) => {
    res.render("login",{
        layout:'login'
    })
})





// description = Dashboard
// route  = GET /dashboard

router.get('/dashboard',ensureAuth, async(req,res) => {
    let userid=req.user.id
    try {
        const stories = await Story.find({user:userid}).lean()
       
        res.render("dashboard",{
            name:req.user.firstName,  
            stories
        })
    
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
  
})




module.exports = router