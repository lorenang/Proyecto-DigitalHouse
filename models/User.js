const User = require ("../models/User");

function sessionMiddleware(req, res, next) {
  
  res.locals.isLogged= false;

  let emailCookie = req.cookies && req.cookies.User.emailCookie;
  if (emailCookie) {
    let userFromCookie = User.getByField("email", emailCookie);
    if (userFromCookie) {
      req.session.userLogged = userFromCookie;
    };
  };
  if (req.session.userLogged) {
    res.locals.isLogged = true;
    res.locals.userLogged = req.session.userLogged;
  };
    next();
  };

 
  
  module.exports = sessionMiddleware;