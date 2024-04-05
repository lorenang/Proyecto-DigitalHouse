const User = require ("../models/User");

function adminMiddleware (req,res,next) {
    if (req.session.userLogged.categoria !== "administrador") {
        let adminError = {};
        return res.render('../views/users/profile.ejs', {
            title: 'Perfil de usuario',
            user: req.session.userLogged,
            adminError
            });
    }
    next ();
};

module.exports = adminMiddleware;