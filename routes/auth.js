const express = require('express')
const router = express.Router()
const passport = require('passport')


// description = Auth with google
// route  = GET /auth/google

router.get('/google',passport.authenticate('google',{scope:['profile']}))

// description = Google auth callback
// route  = GET /auth/google/callback

router.get('/google/callback',
        passport.authenticate('google',
            {
                failureRedirect:'/',
                    failureFlash: 'Invalid username or password.' 
            }),
            (req,res) =>{
                res.redirect('/dashboard')
            }

)

// description = Auth with google
// route  = GET /auth/google

router.get('/logout',(req,res)=>{
    req.logout()
    res.redirect('/')
})


module.exports = router