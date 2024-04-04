function autorizacionMiddleware (req,res,next) {
        
    if (!req.session.userLogged) {
        let authError = {};
        return res.render('../views/users/login.ejs', {
            title: 'Login',
            authError
            });
    };



next ();
};

module.exports = autorizacionMiddleware;