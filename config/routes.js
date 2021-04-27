
module.exports =function()
{
    app.use('/',require('./routes/index'))
    app.use('/auth',require('./routes/auth'))
    app.use('/stories',require('./routes/stories'))
}