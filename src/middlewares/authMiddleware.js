const db = require('../database/models');
// const sequelize = db.sequelize;
const { Op } = require("sequelize");
const moment = require('moment');
const { log } = require('console');
const Users = db.Users;

// const { getUserByUsername } = require('../data/services/userServices');
const guestMiddleware = (req, res, next) => {
    if (req.session.user) {
        return res.redirect('profile/'+req.session.username);
    }
    next();
};
const authMiddleware = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/users/login');
    }
    next();
};
const rememberMiddleware = async (req, res, next) => {
    if (req.cookies.remember && !req.session.user) {
        // Lógica para autenticar al usuario basándose en la cookie
        // Puedes reutilizar partes de tu lógica de login aquí
        const username = req.cookies.remember; // Recupera el nombre de usuario desde la cookie
        const existingUser = await db.Users.findOne({ where: { username: username } });
        // const existingUser = getUserByUsername(username);

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