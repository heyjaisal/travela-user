const jwt = require('jsonwebtoken');
require('dotenv').config();

const CheckMiddleware = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  console.log(token,'token');
  
  if (!token) {
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) return res.status(403).send("Token is not valid");

    req.userId = payload.userId;
    next();
  });
};

module.exports = CheckMiddleware;
