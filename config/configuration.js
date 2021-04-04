module.exports = {
    mongoDbUrl : 'mongodb+srv://elie:brilliant123E@cluster0.c3v9r.mongodb.net/tutorial?retryWrites=true&w=majority',
  //  mongoDbUrl : 'mongodb://localhost:27017/tutorial_cms',
    PORT: process.env.PORT || 3000,
    globalVariables: (req, res, next) => {
        res.locals.success_message = req.flash('success-message');
        res.locals.error_message = req.flash('error-message');        
        
        next();
    }
};