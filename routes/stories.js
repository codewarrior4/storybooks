const express = require('express')
const router = express.Router()
const {ensureAuth} =require('../middleware/auth')
const Story = require('../models/story')

// description = /show add pagec
// route  = GET
router.get('/add',ensureAuth,(req,res) => {
    
    res.render("stories/add")
})
// description = /show single story
// route  = GET
router.get('/:id',ensureAuth, async(req,res) => {
    try {
        let story = await Story.findById(req.params.id)
            .populate('user')
            .lean()
            console.log(story)

        if(!story)
        {
            return res.render('error/404')
        }
            console.log(story)
             res.render('stories/details',{story})
        
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
})

// description = /show user stories
// route  = GET
router.get('/user/:userId',ensureAuth, async(req,res) => {
    try {
        const stories = await Story.find({status:'public',user:req.params.userId})
            .populate('user')
            .lean()
            console.log(stories)

        if(!stories)
        {
            return res.render('error/404')
        }
            console.log(stories)
             res.render('stories/index',{stories})
        
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
})





router.post('/',ensureAuth,async(req,res) => {
    try {
        req.body.user = req.user.id
        await Story.create({
                        title:req.body.title,
                        status:req.body.status,
                        body:req.body.body,
                        user:req.body.user})
        
        res.render('dashboard')

        
        
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
    // res.render("stories/add")
})

// description = stories
// route  = GET /dashboard

router.get('/',ensureAuth,async(req,res)=>{
    try {
        const stories = await Story.find({status:'public'})
                        .populate('user')
                        .sort({createdAt:'desc'})
                        .lean()
                        // console.log(stories)
            res.render('stories',{stories})
    } catch (error) {
        console.error(error)
        res.render('error/500')
        
    }
})

// description = stories edit
// route  = GET /dashboard

router.get('/edit/:id',ensureAuth,async(req,res)=>{
    try {
        const story = await Story.findOne({_id:req.params.id})
            .lean()
        if(!story)
        {
            return res.render('error/404')
        }
        if(story.user != req.user.id){
            res.redirect('/')
        }
        else{
             res.render('stories/edit',{story})
        }
       
    } catch (error) {
        console.error(error)
        res.render('error/500')
        
    }
})

// description = stories edit
// route  = Delete /stories:id

router.delete('/delete/:id',ensureAuth,async(req,res)=>{
    try {
         await Story.remove({_id:req.params.id})
        
            res.redirect('/dashboard')
    }
     catch (error) {
        console.error(error)
        res.render('error/500')
        
    }
})

// uPDATE STORIES
router.put('/:id',ensureAuth,async(req,res) => {
    try {
        let story = await Story.findById(req.params.id).lean()
        if(!story) {
            return res.render('error/404')
        }

        if(story.user != req.user.id){
            res.redirect('/')
        }
        else{
             story = await Story.findOneAndUpdate({_id:req.params.id},
                req.body,
                {
                    new:true,
                    runValidators:true
                })
                res.redirect('/dashboard')
        }
        
        
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
    // res.render("stories/add")
})




module.exports = router