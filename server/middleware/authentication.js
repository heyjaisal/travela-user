const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).send("You are not validated");

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) return res.status(403).send("Token is not valid");
      
      req.userId = payload.userId; 
      next();
  });
};

module.exports = authMiddleware;
