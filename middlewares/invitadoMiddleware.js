function invitadoMiddleware (req,res,next) {
    if (req.session.userLogged) {
        return res.render('../views/users/profile.ejs', {
            title: 'Perfil de usuario',
            user: req.session.userLogged});
    };
    next ();
};

module.exports = invitadoMiddleware;