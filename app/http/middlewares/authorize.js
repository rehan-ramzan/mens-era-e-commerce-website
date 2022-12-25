function authorize(req,res,next){
    if(req.user){
        return next();
    }
    res.redirect('/login')
}

export default authorize;