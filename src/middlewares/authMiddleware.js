const { getUserByUsername } = require('../controllers/mainController');

const guestMiddleware = (req, res, next) => {
    if (req.session.user) {
        return res.redirect(`/profile/${req.session.username}`);
    }
    next();
};
const authMiddleware = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};
const rememberMiddleware = (req, res, next) => {
    if (req.cookies.remember && !req.session.user) {
        // Lógica para autenticar al usuario basándose en la cookie
        // Puedes reutilizar partes de tu lógica de login aquí
        const username = req.cookies.remember; // Recupera el nombre de usuario desde la cookie
        const existingUser = getUserByUsername(username);

        if (existingUser) {
            req.session.user = existingUser;
            req.session.username = existingUser.username;
        }
    }

    next();
};

module.exports = {
    guestMiddleware,
    authMiddleware,
    rememberMiddleware
};