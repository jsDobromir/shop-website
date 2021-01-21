const isAuth = (req,res,next) => {

    if(!req.session.isLoggedIn){
        return res.redirect('/auth/login');
    }
    next();
};

export default isAuth;