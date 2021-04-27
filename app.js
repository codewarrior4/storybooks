const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const morgan = require('morgan')
const handlebars = require('express-handlebars')
const path = require('path')
const passport = require('passport')
const session = require('express-session')
const  MongoStore = require('connect-mongo')(session)
const connectDB = require('./config/db')
const methodOverride = require('method-override')


// Load config file
dotenv.config({path:'./config/config.env'})

//pass passport to passport config
require('./config/passport')(passport)

// call connection
connectDB()

const app = express();

// Use body parser to
app.use(express.urlencoded({extended:false}))
// app.use(express.json())


app.use(methodOverride((req, res) => {
  if(req.body && typeof req.body ==='object' && '_method' in req.body){
    let method = req.body._method
    delete req.body._method
    return method
  }
}))

// loggin in
if(process.env.NODE_ENV === 'developement')
{
    app.use(morgan('dev'))
    
}

// Handlebars helpers

const {formatDate,stripTags,truncate,edit,select} = require('./helpers/hbs')

// handlebars
app.engine('.hbs',
      handlebars({
        helpers:{
            formatDate,
            stripTags,
            truncate,
            edit,
            select
          },
      defaultLayout:'main',extname:'.hbs'}))
app.set('view engine','.hbs')

// session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
  }))

//passport midleware
app.use(passport.initialize())
app.use(passport.session())


// set global var
app.use((req,res,next)=>{
  res.locals.user =req.user || null
  return next()
})


//routes
app.use('/',require('./routes/index'))
app.use('/auth',require('./routes/auth'))
app.use('/stories',require('./routes/stories'))
// require('config/routes')

app.use(express.static(path.join(__dirname,'public')))


const PORT =  process.env.PORT || 4000

app.listen(PORT,console.log(`server running in ${process.env.NODE_ENV} mode in ${PORT}`))