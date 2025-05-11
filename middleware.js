module.exports.isuserLoggeddIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in");
        return res.redirect("/auth/login");
    }
    next();
};